import { getWindowName } from "services/WindowName";

const WALLPAPER_PATH = "$XDG_PICTURES_DIR/Wallpapers/Abstract/0013.jpg";

// This is a bit of hack, so that we can use the XDG_PICTURES_DIR env variable
const getWallpaperPath = (): string => {
	return Utils.exec(`zsh -c "ls ${WALLPAPER_PATH}"`);
};

export const Desktop = () =>
	Widget.Window({
		name: getWindowName("desktop"),
		layer: "bottom",
		class_name: "Desktop",
		exclusivity: "ignore",
		anchor: ["top", "bottom", "left", "right"],
		css: `background-image: url("${getWallpaperPath()}");`,
		child: Widget.Box({
			css: "padding: 1px;",
			child: Widget.Revealer({
				reveal_child: false,
				transition: "crossfade",
				transitionDuration: 1000,
				child: Widget.Box({
					class_name: "Octopus",
				}),
				setup: (self) => {
					const loop = () => {
						Utils.timeout(3000, () => {
							self.reveal_child = !self.reveal_child;
							loop();
						});
					};

					loop();
				},
			}),
		}),
	});
