import { Widget } from "astal/gtk3";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export const BatteryIndicator = () =>
	Widget.Box({
		children: [
			Widget.Icon({ class_name: "Indicator" }).hook(battery, (self) => {
				self.icon = battery.icon_name;
			}),
			Widget.Label().hook(battery, (self) => {
				self.label = `${battery.percent}%`;
			}),
		],
		visible: battery.bind("available"),
	});
