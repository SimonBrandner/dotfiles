import { Widget } from "astal/gtk3";
import { bind } from "astal";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export const BatteryIndicator = () =>
	new Widget.Box({
		child: bind(battery, "available").as(
			(available) =>
				available &&
				new Widget.Box({
					children: [
						new Widget.Icon({ class_name: "Indicator" }).hook(
							battery,
							(self) => {
								self.icon = battery.icon_name;
							}
						),
						new Widget.Label().hook(battery, (self) => {
							self.label = `${battery.percent}%`;
						}),
					],
				})
		),
	});
