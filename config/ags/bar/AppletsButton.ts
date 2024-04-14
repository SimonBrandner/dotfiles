import { APPLETS_WINDOW_NAME } from "bar/applets/Applets";
import { AudioIndicator } from "bar/applets/Audio";
import { BatteryIndicator } from "bar/applets/Battery";
import { BluetoothIndicator } from "bar/applets/Bluetooth";
import { NetworkIndicator } from "bar/applets/Networks";

export const AppletsButton = () => {
	const appletsShown = Variable(false);
	return Widget.Button({
		class_name: "AppletButton",
		on_clicked: () => {
			appletsShown.value = !appletsShown.value;
		},
		child: Widget.Box({
			spacing: 4,
			children: [
				NetworkIndicator(),
				BluetoothIndicator(),
				AudioIndicator(),
				BatteryIndicator(),
			],
		}),
	}).hook(appletsShown, (self) => {
		self.toggleClassName("Active", appletsShown.value);
		appletsShown.value
			? App.openWindow(APPLETS_WINDOW_NAME)
			: App.closeWindow(APPLETS_WINDOW_NAME);
	});
};
