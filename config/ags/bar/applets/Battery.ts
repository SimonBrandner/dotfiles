import { getBatteryIcon } from "utils";

const battery = await Service.import("battery");

export const BatteryIndicator = () =>
	Widget.Box({
		children: [
			Widget.Label().hook(battery, (self) => {
				self.label = `${battery.percent}%`;
			}),
			Widget.Icon({ class_name: "Indicator" }).hook(battery, (self) => {
				self.icon = getBatteryIcon(
					battery.percent,
					battery.charging,
					battery.charged,
				);
			}),
		],
	});
