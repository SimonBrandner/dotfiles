import { Variable } from "types/variable";
import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "quick_settings/QuickSettings";

const network = await Service.import("network");

const { wifi } = await Service.import("network");

export const NetworksPage = () =>
	Widget.Box({
		vertical: true,
		setup: (self) =>
			self.hook(
				wifi,
				() =>
					(self.children = wifi.access_points.map((accessPoint) =>
						Widget.Box({
							child: Widget.Label({
								label: accessPoint.ssid,
							}),
						}),
					)),
			),
	});

interface WifiOverviewToggle {
	current_page_name: Variable<SectionName>;
}

export const WifiOverviewToggle = ({ current_page_name }: WifiOverviewToggle) =>
	OverviewToggle({
		label: "WiFi",
		connection: [wifi, () => wifi.enabled],
		on_clicked: () => {
			wifi.enabled = !wifi.enabled;
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
