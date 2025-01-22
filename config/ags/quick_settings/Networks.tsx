import { bind, Variable, GObject } from "astal";
import { Widget } from "astal/gtk3";
import AstalNetwork from "gi://AstalNetwork";

import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "./QuickSettings";

const network = AstalNetwork.get_default();

const AccessPoint = (
	accessPoint: AstalNetwork.AccessPoint,
	active: boolean
) => (
	<button
		className={active ? "Wifi Active" : "Wifi"}
		onClickRelease={() => console.log("Connect to access point")}
	>
		<box>
			<icon className="Icon" icon={bind(accessPoint, "iconName")}></icon>
			<label label={bind(accessPoint, "ssid")}></label>
			<box hexpand={true}></box>
			<icon className="Icon" icon="dialog-ok" visible={active}></icon>
		</box>
	</button>
);

export const NetworksPage = () =>
	new Widget.Box({
		name: "networks_page",
		child: bind(network, "wifi").as((wifi) => {
			if (!wifi) {
				return new Widget.Box({
					class_name: "Page",
					vertical: true,
					hexpand: true,
					vexpand: true,
					children: [
						new Widget.Box({
							class_name: "PageHeader",
							children: [
								new Widget.Label({
									class_name: "Label",
									label: "WiFi",
								}),
							],
						}),
						new Widget.Label({
							label: "WiFi is not available",
						}),
					],
				});
			}

			const header = (
				<box className={"PageHeader"}>
					<label className="Label" label="WiFi" />
					<box hexpand={true}></box>
					<button
						className={bind(wifi, "scanning").as((scanning) =>
							scanning ? "Scan Active" : "Scan"
						)}
						onClickRelease={() => wifi.scan()}
					>
						<icon className="Icon" icon="system-restart-symbolic" />
					</button>
					<switch
						className={bind(wifi, "enabled").as((active) =>
							active ? "active" : ""
						)}
						active={bind(wifi, "enabled")}
						onStateSet={(_, active) => {
							if (!active) {
								return;
							}
							while (!wifi.enabled);
							wifi.scan();
						}}
						setup={(self) => {
							wifi.bind_property(
								"enabled",
								self,
								"active",
								GObject.BindingFlags.BIDIRECTIONAL |
									GObject.BindingFlags.SYNC_CREATE
							);
						}}
					></switch>
				</box>
			);

			return new Widget.Box({
				class_name: "Page",
				vertical: true,
				hexpand: true,
				children: [
					header,
					new Widget.Scrollable({
						hscroll: "never",
						expand: true,
						child: bind(
							Variable.derive(
								[bind(wifi, "accessPoints"), bind(wifi, "activeAccessPoint")],
								(accessPoints, activeAccessPoint) =>
									new Widget.Box({
										vertical: true,
										children: accessPoints
											.sort(
												(
													a: AstalNetwork.AccessPoint,
													b: AstalNetwork.AccessPoint
												) => {
													if ([a, b].includes(activeAccessPoint)) {
														return a === activeAccessPoint ? -1 : 1;
													}
													return a.strength - b.strength;
												}
											)
											.map((accessPoint: AstalNetwork.AccessPoint) =>
												AccessPoint(
													accessPoint,
													accessPoint === activeAccessPoint
												)
											),
									})
							)
						),
					}),
				],
			});
		}),
	});

interface WifiOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}

export const WifiOverviewToggle = ({
	current_page_name,
}: WifiOverviewToggleProps) =>
	new Widget.Box({
		child: bind(network, "wifi").as((wifi) =>
			wifi
				? OverviewToggle({
						label: "WiFi",
						indicator: NetworkIndicator(),
						active: bind(wifi, "enabled"),
						on_clicked: () => {
							network.wifi.enabled = !network.wifi.enabled;
						},
						on_expand_clicked: () => {
							current_page_name.set("networks");
						},
					})
				: OverviewToggle({
						label: "Wired",
						indicator: NetworkIndicator(),
						active: false,
						on_expand_clicked: () => {
							current_page_name.set("networks");
						},
					})
		),
	});

const WifiIndicator = () =>
	new Widget.Box({
		name: "wifi_indicator",
		visible: bind(network, "wifi"),
		child: bind(network, "wifi").as((wifi) => {
			return (
				wifi &&
				new Widget.Icon({
					class_name: "Indicator",
					icon: bind(network.wifi, "iconName"),
				})
			);
		}),
	});

const WiredIndicator = () =>
	new Widget.Box({
		name: "wired_indicator",
		visible: bind(network, "wired"),
		child: bind(network, "wired").as((wired) => {
			return (
				wired &&
				new Widget.Icon({
					class_name: "Indicator",
					icon: bind(wired, "iconName"),
				})
			);
		}),
	});

export const NetworkIndicator = () =>
	new Widget.Stack({
		children: [WifiIndicator(), WiredIndicator()],
		shown: bind(network, "primary").as((primary) => {
			if (!network.wifi) {
				return "wired_indicator";
			}
			if (!network.wired) {
				return "wifi_indicator";
			}

			return primary === AstalNetwork.Primary.WIFI
				? "wifi_indicator"
				: "wired_indicator";
		}),
	});
