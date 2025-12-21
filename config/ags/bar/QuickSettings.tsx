import { createComputed, createEffect, createState } from "ags";
import { Gdk, Gtk } from "ags/gtk3";
import app from "ags/gtk3/app";
import { AudioIndicator } from "../quick_settings/Audio";
import { BatteryIndicator } from "../quick_settings/Battery";
import { BluetoothIndicator } from "../quick_settings/Bluetooth";
import { MediaIndicator } from "../quick_settings/Media";
import { NetworkIndicator } from "../quick_settings/Networks";
import { NotificationIndicator } from "../quick_settings/Notifications";
import { getWindowName } from "../utils";

export const QuickSettings = (monitor: Gdk.Monitor) => {
	const quickSettingsWindowName = getWindowName("quick_settings", monitor);
	const [quickSettingsShown, setQuickSettingsShown] = createState(false);
	app.connect("window-toggled", (_, window: Gtk.Window) => {
		if (window.name !== quickSettingsWindowName) return;
		setQuickSettingsShown(window.visible);
	});
	createEffect(() => {
		app.get_window(quickSettingsWindowName)?.set_visible(quickSettingsShown());
	});

	return (
		<button
			class={createComputed(
				() => "QuickSettings" + (quickSettingsShown() ? " Active" : "")
			)}
			onClicked={() => {
				setQuickSettingsShown(!quickSettingsShown());
			}}
		>
			<box spacing={4}>
				<NotificationIndicator />
				<NetworkIndicator />
				<BluetoothIndicator />
				<AudioIndicator />
				<MediaIndicator />
				<BatteryIndicator />
			</box>
		</button>
	);
};
