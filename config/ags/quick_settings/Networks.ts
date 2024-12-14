import { bind, execAsync, Variable } from "astal";
import { Widget } from "astal/gtk3";
import AstalNetwork from "gi://AstalNetwork";

import { OverviewToggle } from "./common/OverviewToggle";
import { PageHeader } from "./common/PageHeader";
import { SectionName } from "./QuickSettings";

const network = AstalNetwork.get_default();

export const NetworksPage = () =>
	new Widget.Box({
		name: "networks_page",
		child: bind(network, "wifi").as((wifi) => {
			if (!wifi) {
				return;
			}

			return new Widget.Box({
				class_name: "Page",
				vertical: true,
				hexpand: true,
				children: [
					PageHeader({
						label: "WiFi",
						connection: [network.wifi, () => network.wifi.enabled],
						on_click: (active) => {
							network.wifi.enabled = active;
						},
					}),
					new Widget.Scrollable({
						hscroll: "never",
						expand: true,
						child: new Widget.Box({
							vertical: true,
						}).hook(
							network.wifi,
							(self) =>
								(self.children = network.wifi.access_points
									.sort((a, b) => a.strength - b.strength)
									.map((accessPoint) => {
										new Widget.Button({
											class_name: "Wifi",
											child: new Widget.Box({
												children: [
													new Widget.Icon({
														class_name: "Icon",
														icon: accessPoint.iconName,
													}),
													new Widget.Label({
														label: accessPoint.ssid,
													}),
													new Widget.Box({ hexpand: true }),
													new Widget.Icon({
														class_name: "Icon",
														icon: "dialog-ok",
														visible: false,
													}).hook(network.wifi, (self) => {
														self.visible = accessPoint.active;
													}),
												],
											}),
											on_clicked: () => {
												execAsync(
													`nmcli device wifi connect ${accessPoint.bssid}`
												).catch((e) => {
													console.log("Error while connecting to WiFi", e);
												});
											},
										}).hook(network.wifi, (self) => {
											self.toggleClassName("Active", accessPoint.active);
										});
									}))
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
}: WifiOverviewToggleProps) => {
	return OverviewToggle({
		label: bind(network, "wifi").as((wifi) => {
			if (wifi) {
				return Variable.derive(
					[
						bind(network, "primary"),
						bind(network, "wifi"),
						bind(network.wifi, "ssid"),
					],
					(primary: string, ssid: string) =>
						primary === "wired" ? "Wired" : ssid || "Not connected"
				);
			} else {
				return Variable.derive([bind(network, "primary")], (primary: string) =>
					primary === "wired" ? "Wired" : "Not connected"
				);
			}
		}),
		indicator: NetworkIndicator(),
		connection: [network.wifi, () => network.wifi.enabled],
		on_clicked: () => {
			network.wifi.enabled = !network.wifi.enabled;
		},
		on_expand_clicked: () => {
			current_page_name.set("networks");
		},
	});
};

const WifiIndicator = () =>
	new Widget.Box({
		name: "wifi_indicator",
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
	new Widget.Icon({
		name: "wired_indicator",
		class_name: "Indicator",
		icon: bind(network.wired, "iconName"),
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
