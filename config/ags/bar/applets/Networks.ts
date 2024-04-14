import { OverviewToggle } from "bar/applets/common/OverviewToggle";

const network = await Service.import("network");

const { wifi } = await Service.import("network");

export const Networks = () =>
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
	on_expand_clicked: () => void;
}

export const WifiOverviewToggle = ({ on_expand_clicked }: WifiOverviewToggle) =>
	OverviewToggle({
		label: "WiFi",
		connection: [wifi, () => wifi.enabled],
		on_clicked: () => {
			wifi.enabled = !wifi.enabled;
		},
		on_expand_clicked,
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
