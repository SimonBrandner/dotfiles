import { createBinding, createComputed, With } from "ags";
import Gtk from "gi://Gtk?version=3.0";
import GObject from "ags/gobject";
import AstalNetwork from "gi://AstalNetwork";
import { OverviewToggle } from "./common/OverviewToggle";
import { set_QUICK_SETTINGS_PAGE } from "./QuickSettings";

const network = AstalNetwork.get_default();

const AccessPoint = (
	accessPoint: AstalNetwork.AccessPoint,
	active: boolean
) => (
	<button class={active ? "Wifi Active" : "Wifi"}>
		<box>
			<icon class="Icon" icon={createBinding(accessPoint, "iconName")} />
			<label label={createBinding(accessPoint, "ssid")} />
			<box hexpand />
			<icon class="Icon" icon="dialog-ok" visible={active} />
		</box>
	</button>
);

export const NetworksPage = () => (
	<box $type="named" name="networks_page">
		<With value={createBinding(network, "wifi")}>
			{(wifi: AstalNetwork.Wifi) => {
				if (!wifi) {
					return (
						<box
							class="Page"
							orientation={Gtk.Orientation.VERTICAL}
							hexpand
							vexpand
						>
							<box class="PageHeader">
								<label class="Label" label="WiFi" />
							</box>
							<label label="WiFi is not available"></label>
						</box>
					);
				}

				return (
					<box class="Page" orientation={Gtk.Orientation.VERTICAL}>
						<box class="PageHeader">
							<label class="Label" label="WiFi" />
							<box hexpand />
							<button
								class={createBinding(wifi, "scanning").as((scanning) =>
									scanning ? "Scan Active" : "Scan"
								)}
								onClickRelease={() => wifi.scan()}
							>
								<icon class="Icon" icon="system-reboot-symbolic" />
							</button>
							<switch
								class={createBinding(wifi, "enabled").as((active) =>
									active ? "active" : ""
								)}
								active={createBinding(wifi, "enabled")}
								onStateSet={(_, active) => {
									if (!active) return false;

									const intervalId = setInterval(() => {
										if (wifi.enabled) {
											clearInterval(intervalId);
											wifi.scan();
										}
									}, 100);

									return false;
								}}
								$={(self) => {
									wifi.bind_property(
										"enabled",
										self,
										"active",
										GObject.BindingFlags.BIDIRECTIONAL |
											GObject.BindingFlags.SYNC_CREATE
									);
								}}
							/>
						</box>
						<With
							value={createComputed(() => {
								const activeAccessPoint = createBinding(
									wifi,
									"activeAccessPoint"
								)();
								let accessPoints = createBinding(wifi, "accessPoints")();

								accessPoints = accessPoints.sort(
									(
										a: AstalNetwork.AccessPoint,
										b: AstalNetwork.AccessPoint
									) => {
										if ([a, b].includes(activeAccessPoint)) {
											return a === activeAccessPoint ? -1 : 1;
										}
										return b.strength - a.strength;
									}
								);

								return { activeAccessPoint, accessPoints };
							})}
						>
							{({ activeAccessPoint, accessPoints }: any) => (
								<scrollable expand hscroll={Gtk.PolicyType.NEVER}>
									{accessPoints.map((accessPoint) =>
										AccessPoint(accessPoint, accessPoint === activeAccessPoint)
									)}
								</scrollable>
							)}
						</With>
					</box>
				);
			}}
		</With>
	</box>
);

export const WifiOverviewToggle = () => (
	<box>
		<With value={createBinding(network, "wifi")}>
			{(wifi) =>
				wifi ? (
					<OverviewToggle
						label="WiFi"
						indicator={NetworkIndicator()}
						active={createBinding(wifi, "enabled")}
						on_clicked={() => (network.wifi.enabled = !network.wifi.enabled)}
						on_expand_clicked={() => set_QUICK_SETTINGS_PAGE("networks")}
					/>
				) : (
					<OverviewToggle
						label="Wired"
						indicator={NetworkIndicator()}
						active={false}
						on_expand_clicked={() => set_QUICK_SETTINGS_PAGE("networks")}
					/>
				)
			}
		</With>
	</box>
);

const WifiIndicator = () => {
	const wifi = createBinding(network, "wifi");
	return (
		<box $type="named" name="wifi_indicator" visible={wifi(Boolean)}>
			<With value={wifi}>
				{(wifi) =>
					wifi && (
						<icon class="Indicator" icon={createBinding(wifi, "iconName")} />
					)
				}
			</With>
		</box>
	);
};

const WiredIndicator = () => {
	const wired = createBinding(network, "wired");
	return (
		<box $type="named" name="wired_indicator" visible={wired(Boolean)}>
			<With value={wired}>
				{(wired) =>
					wired && (
						<icon class="Indicator" icon={createBinding(wired, "iconName")} />
					)
				}
			</With>
		</box>
	);
};

export const NetworkIndicator = () => (
	<stack
		visibleChildName={createBinding(network, "primary").as((primary) => {
			if (!network.wifi) return "wired_indicator";
			if (!network.wired) return "wifi_indicator";

			return primary === AstalNetwork.Primary.WIFI
				? "wifi_indicator"
				: "wired_indicator";
		})}
		children={[WifiIndicator(), WiredIndicator()]}
	/>
);
