import { Bar } from "bar/Bar";
import { Applets } from "bar/applets/Applets";
import { AppLauncher } from "launcher/AppLauncher";
import { Notifications } from "notifications/Notifications";
import { FileMonitorFlags } from "types/@girs/gio-2.0/gio-2.0.cjs";

const SCSS_PATH = `${App.configDir}/style.scss`;
const CSS_PATH = `/tmp/ags/style.css`;
Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);

App.config({
	style: CSS_PATH,
	windows: [Bar(0), Notifications(0), Applets(0), AppLauncher()],
});

Utils.monitorFile(
	App.configDir,
	() => {
		Utils.exec(`sassc ${SCSS_PATH} ${CSS_PATH}`);
		App.resetCss();
		App.applyCss(CSS_PATH);
	},
	{ recursive: true, flags: FileMonitorFlags.NONE }
);

//Utils.timeout(100, () =>
//	Utils.notify({
//		summary: "Notification Popup Example",
//		iconName: "info-symbolic",
//		body:
//			"Lorem ipsum dolor sit amet, qui minim labore adipisicing " +
//			"minim sint cillum sint consectetur cupidatat.",
//		actions: {
//			Cool: () => print("pressed Cool"),
//		},
//	})
//);
