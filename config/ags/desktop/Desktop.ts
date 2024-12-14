import { Astal, App, Gdk, Widget } from "astal/gtk3";

import { getWallpaperPath, getWindowName } from "../utils";

export const Desktop = (monitor: Gdk.Monitor) =>
	new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("desktop", monitor),
		class_name: "Desktop",
		layer: Astal.Layer.BOTTOM,
		exclusivity: Astal.Exclusivity.IGNORE,
		anchor:
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT |
			Astal.WindowAnchor.BOTTOM,
		css: `background-image: url("${getWallpaperPath()}");`,
	});
