import { Accessor, createBinding, createComputed, With } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import GObject from "ags/gobject";
import AstalNetwork from "gi://AstalNetwork";
import { OverviewToggle } from "./common/OverviewToggle";
import { SCROLL_HEIGHT, set_QUICK_SETTINGS_PAGE } from "./QuickSettings";
import Pango from "gi://Pango?version=1.0";
import { HEADER_BUTTONS_SPACING } from "../bar/QuickSettings";
import { execAsync } from "ags/process";

const network = AstalNetwork.get_default();

const AccessPointInfoBox = ({ label }: { label: Accessor<string> }) => (
	<box class="InfoBox">
		<label label={label} />
	</box>
);
const AccessPoint = (
	accessPoint: AstalNetwork.AccessPoint,
	active: boolean
) => {
	const frequency = createBinding(
		accessPoint,
		"frequency"
	)((frequency) => `${(frequency / 1000).toFixed(1)} GHz`);
	const bitrate = createBinding(
		accessPoint,
		"maxBitrate"
	)((maxBitrate) => `${maxBitrate / 1000} Mbit/s`);

	return (
		<button class={active ? "Wifi Active" : "Wifi"} vexpand={false}>
			<box spacing={4}>
				<Gtk.Image
					class="Icon"
					iconName={createBinding(accessPoint, "iconName")}
				/>
				<label
					label={createBinding(accessPoint, "ssid")((id) => id ?? "Unknown")}
					ellipsize={Pango.EllipsizeMode.END}
				/>
				<AccessPointInfoBox label={frequency} />
				<AccessPointInfoBox label={bitrate} />
				<box hexpand />
				<Gtk.Image class="Icon" iconName="dialog-ok" visible={active} />
			</box>
		</button>
	);
};

export const NetworksPage = () => (
	<box $type="named" name="networks_page">
		<With value={createBinding(network, "wifi")}>
			{(wifi: AstalNetwork.Wifi | null) => {
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
							<box spacing={HEADER_BUTTONS_SPACING}>
								<button
									class="IconButton Scan"
									sensitive={createBinding(wifi, "scanning")((s) => !s)}
									onClicked={() => wifi.scan()}
								>
									<Gtk.Image class="Icon" iconName="system-reboot-symbolic" />
								</button>
								<button
									class="IconButton"
									onClicked={() => execAsync("alacritty -t nmtui -e nmtui")}
								>
									<Gtk.Image class="Icon" iconName="emblem-system-symbolic" />
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
						</box>
						<With
							value={createComputed(() => {
								const activeAccessPoint = createBinding(
									wifi,
									"activeAccessPoint"
								)();
								let accessPoints = createBinding(wifi, "accessPoints")();

								accessPoints = accessPoints
									.filter((a) => Boolean(a.ssid))
									.sort(
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
							{({
								activeAccessPoint,
								accessPoints,
							}: {
								activeAccessPoint: AstalNetwork.AccessPoint;
								accessPoints: Array<AstalNetwork.AccessPoint>;
							}) => (
								<scrolledwindow
									maxContentHeight={SCROLL_HEIGHT}
									propagateNaturalHeight
									vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
									hscrollbarPolicy={Gtk.PolicyType.NEVER}
								>
									<box visible orientation={Gtk.Orientation.VERTICAL}>
										{accessPoints.map((accessPoint) =>
											AccessPoint(
												accessPoint,
												accessPoint === activeAccessPoint
											)
										)}
									</box>
								</scrolledwindow>
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
						<Gtk.Image
							hexpand
							class="Indicator"
							iconName={createBinding(wifi, "iconName")}
						/>
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
						<Gtk.Image
							hexpand
							class="Indicator"
							iconName={createBinding(wired, "iconName")}
						/>
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
	>
		<WifiIndicator />
		<WiredIndicator />
	</stack>
);
