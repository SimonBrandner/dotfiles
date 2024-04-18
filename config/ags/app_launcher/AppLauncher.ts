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
	let filter: string | undefined | null;
	let focusedTileId = 0;
	let applicationTiles = query("").map(AppTile);

	const applicationListWidget = Widget.Box({
		vertical: true,
		children: applicationTiles,
	});
	const inputWidget = Widget.Entry({
		className: "Input",
		hexpand: true,
		on_accept: () => {
			const filtered = applicationTiles.filter((t) => t.visible);
			const application = filtered[focusedTileId]?.attribute?.app;
			if (!application) return;

			App.toggleWindow(APP_LAUNCHER_WINDOW_NAME);
			updatedFocusedTile(0);
			application.launch();
		},
		on_change: ({ text }) => {
			filter = text;
			updateVisibleTiles();
		},
	});
	const content = Widget.Box({
		vertical: true,
		className: "AppLauncherContent",
		children: [inputWidget, applicationListWidget],
	}).hook(App, (_, windowName, visible) => {
		if (windowName !== APP_LAUNCHER_WINDOW_NAME) return;
		if (!visible) return;

		inputWidget.text = "";
		inputWidget.grab_focus();
	});

	const updateVisibleTiles = () => {
		let numberOfVisibleTiles = 0;
		for (const tile of applicationTiles) {
			if (numberOfVisibleTiles > MAX_VISIBLE_TILES) {
				tile.visible = false;
				continue;
			}
			const visible = tile.attribute.app.match(filter ?? "");
			tile.visible = visible;
			if (visible) numberOfVisibleTiles++;
		}
		updatedFocusedTile(0);
	};

	const updatedFocusedTile = (newValue: number = focusedTileId): void => {
		const filtered = applicationTiles.filter((t) => t.visible);
		const maxId = filtered.length - 1;

		if (newValue < 0) {
			newValue = maxId;
		} else if (newValue > maxId) {
			newValue = 0;
		}

		focusedTileId = newValue;
		filtered.forEach((tile, tileId) => {
			tile.toggleClassName("Focused", focusedTileId === tileId);
		});
	};

	return Widget.Window({
		name: APP_LAUNCHER_WINDOW_NAME,
		class_name: "AppLauncher",
		visible: false,
		keymode: "exclusive",
		anchor: ["top"],
		margins: [200, 0],
		child: content,
	})
		.on("notify::visible", (self) => {
			applications.reload();
			self.child = content;
			updateVisibleTiles();
		})
		.keybind("Escape", () => {
			App.closeWindow(APP_LAUNCHER_WINDOW_NAME);
		})
		.keybind("Up", () => {
			updatedFocusedTile(focusedTileId - 1);
			return Gdk.EVENT_STOP;
		})
		.keybind("Down", () => {
			updatedFocusedTile(focusedTileId + 1);
			return Gdk.EVENT_STOP;
		});
};
