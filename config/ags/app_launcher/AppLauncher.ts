import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { Application } from "types/service/applications";

const applications = await Service.import("applications");
const { query } = await Service.import("applications");

export const APP_LAUNCHER_WINDOW_NAME = "app_launcher";
const MAX_VISIBLE_TILES = 8;

const AppTile = (app: Application) =>
	Widget.Button({
		class_name: "AppTile",
		on_clicked: () => {
			App.closeWindow(APP_LAUNCHER_WINDOW_NAME);
			app.launch();
		},
		attribute: { app },
		child: Widget.Box({
			children: [
				Widget.Icon({
					class_name: "Icon",
					icon: app.icon_name || "",
				}),
				Widget.Label({
					label: app.name,
					truncate: "end",
				}),
			],
		}),
	});

export const AppLauncher = () => {
	let appTiles = query("")
		.sort((a, b) => (a.name > b.name ? 1 : -1))
		.map(AppTile);
	let filter: string | null = null;
	let firstVisibleTileId = 0; // of filtered tiles
	let focusedTileId = 0; // of visible tiles

	const getFilteredApps = () =>
		appTiles
			.filter((t) => t.attribute.app.match(filter ?? ""))
			.map((t) => t.attribute.app);

	const getVisibleWindow = () =>
		getFilteredApps().slice(
			firstVisibleTileId,
			firstVisibleTileId + MAX_VISIBLE_TILES,
		);

	const changeFocusedTile = (newValue: number) => {
		const filteredApps = getFilteredApps();

		// Set new values
		if (newValue < 0) {
			newValue = 0;
			if (firstVisibleTileId > 0) {
				firstVisibleTileId--;
			}
		} else if (newValue > MAX_VISIBLE_TILES - 1) {
			newValue = MAX_VISIBLE_TILES - 1;
			if (firstVisibleTileId < filteredApps.length - MAX_VISIBLE_TILES) {
				firstVisibleTileId++;
			}
		} else if (newValue > filteredApps.length - 1) {
			newValue = filteredApps.length - 1;
		}
		focusedTileId = newValue;

		// Update visible tiles
		const windowApps = getVisibleWindow();
		appTiles.forEach((t) => {
			t.visible = windowApps.includes(t.attribute.app);
		});

		// Update focused tile
		const app = getVisibleWindow()[focusedTileId];
		appTiles.forEach((tile) => {
			tile.toggleClassName("Focused", tile.attribute.app === app);
		});
	};

	const input = Widget.Entry({
		className: "Input",
		hexpand: true,
		on_accept: () => {
			const windowApps = getVisibleWindow();
			const application = windowApps[focusedTileId];
			if (!application) return;

			App.toggleWindow(APP_LAUNCHER_WINDOW_NAME);
			changeFocusedTile(0);
			application.launch();
		},
		on_change: ({ text }) => {
			filter = text;
			changeFocusedTile(0);
		},
	});

	return Widget.Window({
		name: APP_LAUNCHER_WINDOW_NAME,
		class_name: "AppLauncher",
		visible: false,
		keymode: "exclusive",
		anchor: ["top"],
		margins: [200, 0],
		child: Widget.Box({
			vertical: true,
			className: "AppLauncherContent",
			children: [
				input,
				Widget.Box({
					vertical: true,
					children: appTiles,
				}),
			],
		}),
	})
		.on("notify::visible", (self) => {
			applications.reload();
			filter = "";
			input.text = "";
			input.grab_focus();

			changeFocusedTile(0);
		})
		.keybind("Escape", () => {
			App.closeWindow(APP_LAUNCHER_WINDOW_NAME);
		})
		.keybind("Up", () => {
			changeFocusedTile(focusedTileId - 1);
			return Gdk.EVENT_STOP;
		})
		.keybind("Down", () => {
			changeFocusedTile(focusedTileId + 1);
			return Gdk.EVENT_STOP;
		});
};
