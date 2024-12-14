import { Variable } from "astal";
import { Widget, App, Gdk } from "astal/gtk3";

import { AudioIndicator } from "../quick_settings/Audio";
import { BatteryIndicator } from "../quick_settings/Battery";
import { BluetoothIndicator } from "../quick_settings/Bluetooth";
import { NetworkIndicator } from "../quick_settings/Networks";
import { NotificationIndicator } from "../quick_settings/Notifications";
import { getWindowName } from "../utils";
import { MediaIndicator } from "../quick_settings/Media";

export const QuickSettings = (monitor: Gdk.Monitor) => {
	const quickSettingsWindowName = getWindowName("quick_settings", monitor);
	const quickSettingsShown = Variable(false);

	return new Widget.Button({
		class_name: "QuickSettings",
		child: new Widget.Box({
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
			quickSettingsShown.set(!quickSettingsShown.get());
		},
	})
		.hook(App, "window-toggled", (_, name: string, visible: boolean) => {
			if (name !== quickSettingsWindowName) return;
			quickSettingsShown.set(visible);
		})
		.hook(quickSettingsShown, (self) => {
			self.toggleClassName("Active", quickSettingsShown.get());
			App.get_window(quickSettingsWindowName).set_visible(
				quickSettingsShown.get()
			);
		});
};
