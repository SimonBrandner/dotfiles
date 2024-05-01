import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { getWindowName } from "utils";

const WALLPAPER_PATH = "$XDG_PICTURES_DIR/Wallpapers/Abstract/0013.jpg";

// This is a bit of hack, so that we can use the XDG_PICTURES_DIR env variable
const getWallpaperPath = (): string => {
	return Utils.exec(`zsh -c "ls ${WALLPAPER_PATH}"`);
};

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
