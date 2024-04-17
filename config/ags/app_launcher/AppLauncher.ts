import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { Application } from "types/service/applications";

const applications = await Service.import("applications");
const { query } = await Service.import("applications");

export const APP_LAUNCHER_WINDOW_NAME = "app_launcher";

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
			application.launch();
		},
		on_change: ({ text }) => {
			applicationTiles.forEach((tile) => {
				tile.visible = tile.attribute.app.match(text ?? "");
			});
			updatedFocusedTile(0);
		},
	});
	const content = Widget.Box({
		vertical: true,
		className: "AppLauncherContent",
		children: [
			inputWidget,
			Widget.Scrollable({
				class_name: "AppLauncherContentScrollable",
				hscroll: "never",
				child: applicationListWidget,
			}),
		],
	}).hook(App, (_, windowName, visible) => {
		if (windowName !== APP_LAUNCHER_WINDOW_NAME) return;
		if (!visible) return;

		inputWidget.text = "";
		inputWidget.grab_focus();
	});

	const updatedFocusedTile = (newValue: number = focusedTileId): void => {
		const filtered = applicationTiles.filter((t) => t.visible);
		const maxId = filtered.length - 1;

		if (newValue < 0) {
			newValue = 0;
		} else if (newValue > maxId) {
			newValue = maxId;
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
		child: content,
	})
		.on("notify::visible", (self) => {
			applications.reload();
			self.child = content;
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
