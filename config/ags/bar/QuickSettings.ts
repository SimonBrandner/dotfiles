import { QUICK_SETTINGS_WINDOW_NAME } from "../quick_settings/QuickSettings";
import { AudioIndicator } from "../quick_settings/Audio";
import { BatteryIndicator } from "../quick_settings/Battery";
import { BluetoothIndicator } from "../quick_settings/Bluetooth";
import { NetworkIndicator } from "../quick_settings/Networks";
import { NotificationIndicator } from "quick_settings/Notifications";

export const QuickSettings = () => {
	const appletsShown = Variable(false);
	return Widget.Button({
		class_name: "AppletButton",
		on_clicked: () => {
			appletsShown.value = !appletsShown.value;
		},
		child: Widget.Box({
			spacing: 4,
			children: [
				NotificationIndicator(),
				NetworkIndicator(),
				BluetoothIndicator(),
				AudioIndicator(),
				BatteryIndicator(),
			],
		}),
	}).hook(appletsShown, (self) => {
		self.toggleClassName("Active", appletsShown.value);
		appletsShown.value
			? App.openWindow(QUICK_SETTINGS_WINDOW_NAME)
			: App.closeWindow(QUICK_SETTINGS_WINDOW_NAME);
	});
};
