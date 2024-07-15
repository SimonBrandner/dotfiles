import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { AudioIndicator } from "../quick_settings/Audio";
import { BatteryIndicator } from "../quick_settings/Battery";
import { BluetoothIndicator } from "../quick_settings/Bluetooth";
import { NetworkIndicator } from "../quick_settings/Networks";
import { NotificationIndicator } from "quick_settings/Notifications";
import { getWindowName } from "utils";
import { MediaIndicator } from "quick_settings/Media";

export const QuickSettings = (monitor: Gdk.Monitor) => {
	const quickSettingsWindowName = getWindowName("quick_settings", monitor);
	const quickSettingsShown = Variable(false);

	return Widget.Button({
		class_name: "QuickSettings",
		child: Widget.Box({
			spacing: 4,
			children: [
				NotificationIndicator(),
				NetworkIndicator(),
				BluetoothIndicator(),
				AudioIndicator(),
				MediaIndicator(),
				BatteryIndicator(),
			],
		}),
		on_clicked: () => {
			quickSettingsShown.value = !quickSettingsShown.value;
		},
	})
		.hook(
			App,
			(_, name: string, visible: boolean) => {
				if (name !== quickSettingsWindowName) return;
				quickSettingsShown.value = visible;
			},
			"window-toggled"
		)
		.hook(quickSettingsShown, (self) => {
			self.toggleClassName("Active", quickSettingsShown.value);
			quickSettingsShown.value
				? App.openWindow(quickSettingsWindowName)
				: App.closeWindow(quickSettingsWindowName);
		});
};
