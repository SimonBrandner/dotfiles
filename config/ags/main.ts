import "lock_screen/LockScreen";

import { Bar } from "bar/Bar";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { AppLauncher } from "app_launcher/AppLauncher";
import { Notifications } from "notifications/Notifications";
import { ProgressPopup } from "popups/ProgressPopup";
import { FileMonitorFlags } from "types/@girs/gio-2.0/gio-2.0.cjs";
import { Desktop } from "desktop/Desktop";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

const SCSS_PATH = `${App.configDir}/style.scss`;
const CSS_PATH = `/tmp/ags/style.css`;
Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);

const forMonitors = (
	widget: (monitor: number) => Gtk.Window,
): Array<Gtk.Window> => {
	const numberOfMonitors = Gdk.Display.get_default()?.get_n_monitors() || 1;

	let widgets = [];
	for (
		let monitorNumber = 0;
		monitorNumber < numberOfMonitors;
		monitorNumber++
	) {
		widgets.push(widget(monitorNumber));
	}
	return widgets;
};

App.config({
	style: CSS_PATH,
	windows: [
		Notifications(),
		AppLauncher(),
		ProgressPopup(),
		...forMonitors(QuickSettings),
		...forMonitors(Bar),
		...forMonitors(Desktop),
	],
});

Utils.monitorFile(
	App.configDir,
	() => {
		Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);
		App.resetCss();
		App.applyCss(CSS_PATH);
	},
	{ recursive: true, flags: FileMonitorFlags.NONE },
);
