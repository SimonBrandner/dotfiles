import "lock_screen/LockScreen";

import { Bar } from "bar/Bar";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { AppLauncher } from "./app_launcher/AppLauncher";
import { NotificationsPopup } from "popups/NotificationsPopup";
import { ProgressPopup } from "popups/ProgressPopup";
import { Desktop } from "desktop/Desktop";
import {
	getDisplay,
	getMonitorName,
	getMonitors,
	getPrimaryMonitor,
	getPrimaryMonitorName,
} from "utils";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";

const SCSS_PATH = `${App.configDir}/style.scss`;
const CSS_PATH = `/tmp/ags/style.css`;
Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);

const getWindowForMonitor = (monitor: Gdk.Monitor) => {
	return [QuickSettings(monitor), Bar(monitor), Desktop(monitor)];
};
const getMainMonitorWindows = (monitor: Gdk.Monitor) => {
	return [
		NotificationsPopup(monitor),
		AppLauncher(monitor),
		ProgressPopup(monitor),
	];
};

const main = () => {
	const display = getDisplay();
	const monitors = getMonitors();
	const primaryMonitor = getPrimaryMonitor();

	App.config({
		style: CSS_PATH,
		iconTheme: "Papirus",
	});

	monitors.forEach((m) =>
		getWindowForMonitor(m).forEach((w) => App.addWindow(w)),
	);
	getMainMonitorWindows(primaryMonitor).forEach((w) => App.addWindow(w));

	display?.connect("monitor-added", (_, monitor) => {
		// This is an ugly hack necessary because Gdk is quicker at telling us
		// about the new monitor than the information traveling to us from Hyprland
		Utils.timeout(500, () => {
			getWindowForMonitor(monitor).forEach((w) => App.addWindow(w));
		});
	});
	display?.connect("monitor-removed", (_, monitor) => {
		App.windows.forEach((window) => {
			if ((window as any).gdkmonitor === monitor) App.removeWindow(window);
		});
	});
};

main();
