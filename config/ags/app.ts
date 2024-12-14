import { App, Gdk } from "astal/gtk3";

//import "./lock_screen/LockScreen";
import { Bar } from "./bar/Bar";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { AppLauncher } from "./app_launcher/AppLauncher";
import { NotificationsPopup } from "./popups/NotificationsPopup";
import { ProgressPopup } from "./popups/ProgressPopup";
import { Desktop } from "./desktop/Desktop";
import { getDisplay, getMonitors, getPrimaryMonitor } from "./utils";
import { Calendar } from "./calendar/Calendar";

import style from "./style.scss";

const getWindowForMonitor = (monitor: Gdk.Monitor) => {
	return [
		QuickSettings(monitor),
		Bar(monitor),
		Desktop(monitor),
		Calendar(monitor),
	];
};
const getMainMonitorWindows = (monitor: Gdk.Monitor) => {
	return [
		NotificationsPopup(monitor),
		AppLauncher(monitor),
		ProgressPopup(monitor),
	];
};

App.start({
	css: style,
	iconTheme: "Papirus",
	requestHandler(request, res) {
		print(request);
		res("ok");
	},
	main: () => {
		const display = getDisplay();
		const monitors = getMonitors();
		const primaryMonitor = getPrimaryMonitor();

		monitors.forEach((m) =>
			getWindowForMonitor(m).forEach((w) => App.addWindow(w))
		);
		getMainMonitorWindows(primaryMonitor).forEach((w) => App.addWindow(w));

		display?.connect("monitor-added", (_, monitor) => {
			// This is an ugly hack necessary because Gdk is quicker at telling us
			// about the new monitor than the information traveling to us from Hyprland
			timeout(500, () => {
				getWindowForMonitor(monitor).forEach((w) => App.addWindow(w));
			});
		});
		display?.connect("monitor-removed", (_, monitor) => {
			App.windows.forEach((window) => {
				if ((window as any).gdkmonitor === monitor) App.removeWindow(window);
			});
		});
	},
});
