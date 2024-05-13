import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { Application } from "types/service/applications";
import { getWindowName } from "utils";

const applications = await Service.import("applications");
const { query } = await Service.import("applications");

const MAX_VISIBLE_TILES = 8;

const AppTile = (app: Application) =>
	Widget.Button({
		class_name: "AppTile",
		on_clicked: () => {
			App.closeWindow(getWindowName("app_launcher"));
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

export const AppLauncher = (monitor: Gdk.Monitor) => {
	const getApps = () =>
		query("")
			.sort((a, b) => (a.name > b.name ? 1 : -1))
			.map(AppTile);

	let appTiles = Variable(getApps());
	let filter: string | null = null;
	let firstVisibleTileId = 0; // of filtered tiles
	let focusedTileId = 0; // of visible tiles

	const getFilteredApps = () =>
		appTiles.value
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
		appTiles.value.forEach((t) => {
			t.visible = windowApps.includes(t.attribute.app);
		});

		// Update focused tile
		const app = getVisibleWindow()[focusedTileId];
		appTiles.value.forEach((tile) => {
			tile.toggleClassName("Focused", tile.attribute.app === app);
		});
	};

	const reset = () => {
		firstVisibleTileId = 0;
		changeFocusedTile(0);
	};

	const input = Widget.Entry({
		className: "Input",
		hexpand: true,
		on_accept: () => {
			const windowApps = getVisibleWindow();
			const application = windowApps[focusedTileId];
			if (!application) return;

			App.toggleWindow(getWindowName("app_launcher"));
			reset();
			application.launch();
		},
		on_change: ({ text }) => {
			filter = text;
			reset();
		},
	});

	return Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("app_launcher"),
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
					children: appTiles.bind("value"),
				}),
			],
		}),
	})
		.on("notify::visible", () => {
			applications.reload();
			filter = "";
			input.text = "";
			input.grab_focus();
			appTiles.value = getApps();

			reset();
		})
		.keybind("Escape", () => {
			App.closeWindow(getWindowName("app_launcher"));
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
