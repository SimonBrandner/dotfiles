import { OverviewToggle } from "bar/applets/common/OverviewToggle";

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
