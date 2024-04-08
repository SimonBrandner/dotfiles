import { BatteryIndicator } from "bar/applets/Battery";

export const AppletsButton = Widget.Button({
	class_name: "AppletButton",
	on_clicked: () => {
		App.toggleWindow("applets");
	},
	child: Widget.Box({
		spacing: 4,
		children: [
			BatteryIndicator,
			Widget.Label({
				label: "Applets",
			}),
		],
	}),
});
