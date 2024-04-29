const DESKTOP_WINDOW_NAME = "desktop";
const WALLPAPER_PATH =
	"$XDG_PICTURES_DIR/Wallpapers/LinuxDistros/NixOS/0003.png";

// This is a bit of hack, so that we can use the XDG_PICTURES_DIR env variable
const getWallpaperPath = (): string => {
	return Utils.exec(`zsh -c "ls ${WALLPAPER_PATH}"`);
};

export const Desktop = () =>
	Widget.Window({
		name: DESKTOP_WINDOW_NAME,
		layer: "bottom",
		class_name: "Desktop",
		exclusivity: "ignore",
		anchor: ["top", "bottom", "left", "right"],
		css: `background-image: url("${getWallpaperPath()}");`,
	});
