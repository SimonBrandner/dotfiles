import { timeout } from "astal/time";
import { App, Gdk } from "astal/gtk3";

import { AppLauncher } from "./app_launcher/AppLauncher";
// import "./lock_screen/LockScreen";
import { Bar } from "./bar/Bar";
import { Calendar } from "./calendar/Calendar";
import { Desktop } from "./desktop/Desktop";
import { NotificationsPopup } from "./popups/NotificationsPopup";
import { ProgressPopup } from "./popups/ProgressPopup";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { getMonitorName, getPrimaryMonitorName } from "./utils";

import style from "./style.scss";

const createWindowsForMonitor = (monitor: Gdk.Monitor): Array<Gdk.Window> => {
	return [
		QuickSettings(monitor),
		Bar(monitor),
		Desktop(monitor),
		Calendar(monitor),
	];
};
const createWindowsForPrimaryMonitor = (monitor: Gdk.Monitor) => {
	NotificationsPopup(monitor);
	AppLauncher(monitor);
	ProgressPopup(monitor);
};

App.start({
	css: style,
	iconTheme: "Papirus",
	requestHandler(_, res) {
		res("ok");
	},
	main() {
		const monitors = App.get_monitors();
		const primaryMonitor =
			monitors.find(
				(monitor: Gdk.Monitor) =>
					getMonitorName(monitor) === getPrimaryMonitorName()
			) ?? monitors[0];
		const windows = new Map<Gdk.Monitor, Array<Gdk.Window>>();

		monitors.forEach((monitor: Gdk.Monitor) =>
			windows.set(monitor, createWindowsForMonitor(monitor))
		);
		createWindowsForPrimaryMonitor(primaryMonitor);

		App.connect("monitor-added", (_, monitor: Gdk.Monitor) => {
			// This is an ugly hack necessary because Gdk is quicker at telling us
			// about the new monitor than the information traveling to us from
			// Hyprland
			timeout(500, () => {
				windows.set(monitor, createWindowsForMonitor(monitor));
			});
		});
		App.connect("monitor-removed", (_, monitor: Gdk.Monitor) => {
			windows.get(monitor)?.forEach((window) => window.destroy());
		});
	},
});
