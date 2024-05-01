import "lock_screen/LockScreen";

import { Bar } from "bar/Bar";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { AppLauncher } from "./app_launcher/AppLauncher";
import { Notifications } from "notifications/Notifications";
import { ProgressPopup } from "popups/ProgressPopup";
import { Desktop } from "desktop/Desktop";
import { getDisplay, getMonitors } from "utils";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";

const SCSS_PATH = `${App.configDir}/style.scss`;
const CSS_PATH = `/tmp/ags/style.css`;
Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);

const getWindowForMonitor = (monitor: Gdk.Monitor) => {
	return [QuickSettings(monitor), Bar(monitor), Desktop(monitor)];
};
const getMainMonitorWindows = (monitor: Gdk.Monitor) => {
	return [Notifications(monitor), AppLauncher(monitor), ProgressPopup(monitor)];
};

const main = () => {
	const display = getDisplay();
	const monitors = getMonitors();
	const primaryMonitor = monitors[0];

	App.config({
		style: CSS_PATH,
	});

	monitors.forEach((m) =>
		getWindowForMonitor(m).forEach((w) => App.addWindow(w)),
	);
	getMainMonitorWindows(primaryMonitor).forEach((w) => App.addWindow(w));

	display?.connect("monitor-added", (_, monitor) => {
		getWindowForMonitor(monitor).forEach((w) => App.addWindow(w));
	});
	display?.connect("monitor-removed", (_, monitor) => {
		App.windows.forEach((window) => {
			if ((window as any).gdkmonitor === monitor) App.removeWindow(window);
		});
	});
};

main();
