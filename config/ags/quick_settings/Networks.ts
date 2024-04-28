import { Variable } from "types/variable";
import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "quick_settings/QuickSettings";
import { PageHeader } from "quick_settings/common/PageHeader";

const network = await Service.import("network");

export const NetworksPage = () => {
	const pageHeader = PageHeader({
		label: "WiFi",
		connection: [network.wifi, () => network.wifi.enabled],
		on_click: (active) => {
			network.wifi.enabled = active;
		},
	});
	const wifiList = Widget.Box({
		vertical: true,
	}).hook(
		network.wifi,
		(self) =>
			(self.children = network.wifi.access_points.map((accessPoint) =>
				Widget.Button({
					class_name: "Wifi",
					child: Widget.Box({
						children: [
							Widget.Icon({
								class_name: "Icon",
								icon: accessPoint.iconName,
							}),
							Widget.Label({
								label: accessPoint.ssid,
							}),
							Widget.Box({ hexpand: true }),
							Widget.Icon({
								class_name: "Icon",
								icon: "dialog-ok",
								visible: false,
							}).hook(network.wifi, (self) => {
								self.visible = accessPoint.active;
							}),
						],
					}),
					on_clicked: () => {
						Utils.execAsync(
							`nmcli device wifi connect ${accessPoint.bssid}`,
						).catch((e) => {
							console.log("Error while connecting to WiFi", e);
						});
					},
				}).hook(network.wifi, (self) => {
					self.toggleClassName("Active", accessPoint.active);
				}),
			)),
	);

	return Widget.Box({
		class_name: "Page",
		vertical: true,
		hexpand: true,
		children: [pageHeader, wifiList],
	});
};

interface WifiOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}

export const WifiOverviewToggle = ({
	current_page_name,
}: WifiOverviewToggleProps) =>
	OverviewToggle({
		label: Utils.merge(
			[network.bind("primary"), network.wifi.bind("ssid")],
			(primary, ssid) =>
				primary === "wired" ? "Wired" : ssid || "Not connected",
		),
		indicator: NetworkIndicator(),
		connection: [network.wifi, () => network.wifi.enabled],
		on_clicked: () => {
			network.wifi.enabled = !network.wifi.enabled;
		},
		on_expand_clicked: () => {
			current_page_name.value = "networks";
		},
	});

const WifiIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(network.wifi, (self) => {
		self.icon = network.wifi.icon_name;
	});

const WiredIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(network.wired, (self) => {
		self.icon = network.wired.icon_name;
	});

export const NetworkIndicator = () =>
	Widget.Stack({
		children: {
			wifi: WifiIndicator(),
			wired: WiredIndicator(),
		},
	}).hook(network, (self) => {
		self.shown = network.primary || "wifi";
	});
