import { Bar } from "bar/Bar";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { AppLauncher } from "app_launcher/AppLauncher";
import { Notifications } from "notifications/Notifications";
import { BarPopupWindow } from "popups/BarPopup";
import { FileMonitorFlags } from "types/@girs/gio-2.0/gio-2.0.cjs";

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
		BarPopupWindow(),
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

//Utils.notify({
//	summary: "Notification Popup Example",
//	iconName: "info-symbolic",
//	body:
//		"Lorem ipsum dolor sit amet, qui minim labore adipisicing " +
//		"minim sint cillum sint consectetur cupidatat.",
//	actions: {
//		Cool: () => print("pressed Cool"),
//	},
//});
