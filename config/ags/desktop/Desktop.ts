import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { getWallpaperPath, getWindowName } from "utils";

export const Desktop = (monitor: Gdk.Monitor) =>
	Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("desktop", monitor),
		layer: "bottom",
		class_name: "Desktop",
		exclusivity: "ignore",
		anchor: ["top", "bottom", "left", "right"],
		css: `background-image: url("${getWallpaperPath()}");`,
	});
