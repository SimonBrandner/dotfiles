import { Widget } from "astal/gtk3";
import { bind } from "astal";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export const BatteryIndicator = () =>
	new Widget.Box({
		child: bind(battery, "isPresent").as((isPresent) =>
			isPresent
				? new Widget.Box({
						children: [
							new Widget.Icon({
								class_name: "Indicator",
								icon: bind(battery, "battery-icon-name"),
							}),
							new Widget.Label({
								label: bind(battery, "percentage").as(
									(percentage) => `${Math.floor(percentage * 100)}%`
								),
							}),
						],
					})
				: new Widget.Box({})
		),
	});
