import "lock_screen/LockScreen";

import { Bar } from "bar/Bar";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { AppLauncher } from "app_launcher/AppLauncher";
import { Notifications } from "notifications/Notifications";
import { ProgressPopup } from "popups/ProgressPopup";
import { FileMonitorFlags } from "types/@girs/gio-2.0/gio-2.0.cjs";
import { Desktop } from "desktop/Desktop";

const SCSS_PATH = `${App.configDir}/style.scss`;
const CSS_PATH = `/tmp/ags/style.css`;
Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);

App.config({
	style: CSS_PATH,
	windows: [
		Bar(),
		Notifications(),
		QuickSettings(),
		AppLauncher(),
		ProgressPopup(),
		Desktop(),
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
