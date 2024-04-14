import { AudioIndicator } from "bar/applets/Audio";
import { BatteryIndicator } from "bar/applets/Battery";
import { BluetoothIndicator } from "bar/applets/Bluetooth";
import { NetworkIndicator } from "bar/applets/Networks";

export const AppletsButton = Widget.Button({
	class_name: "AppletButton",
	on_clicked: () => {
		App.toggleWindow("applets");
	},
	child: Widget.Box({
		spacing: 4,
		children: [
			BatteryIndicator(),
			AudioIndicator(),
			BluetoothIndicator(),
			NetworkIndicator(),
		],
	}),
});
