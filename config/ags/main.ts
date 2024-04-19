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

for (let i = 0; i < 2; i++) {
	Utils.notify({
		summary: "Test",
		body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ultricies pellentesque vehicula. Maecenas quis nisi hendrerit, suscipit arcu accumsan, elementum nisl. Vestibulum dictum risus vel aliquam condimentum. Fusce eget justo ante. Integer sagittis eget elit in tincidunt. Praesent et nulla vel ex venenatis sodales. Ut aliquam pretium nisi sit amet fermentum. Donec a urna odio. Ut sit amet consequat purus, id rutrum nisl. Suspendisse laoreet pulvinar magna in porttitor. Morbi augue dui, tristique viverra quam hendrerit, porttitor finibus tortor. Sed at hendrerit nulla, nec venenatis tellus.",
		actions: {
			Tets: () => {},
			Test2: () => {},
		},
	});
}
