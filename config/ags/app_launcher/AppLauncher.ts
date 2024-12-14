import { Variable, exec, bind } from "astal";
import Apps from "gi://AstalApps";
import { Gdk, App, Widget, Astal } from "astal/gtk3";

import { getWindowName } from "../utils";

const applications = new Apps.Apps({
	nameMultiplier: 2,
	entryMultiplier: 0,
	executableMultiplier: 2,
});

const MAX_VISIBLE_TILES = 8;

const match = (keywords: Array<string>, term: string): boolean => {
	for (const keyword of keywords) {
		if (keyword.toLowerCase().includes(term.toLowerCase())) {
			return true;
		}
	}

	return false;
};

const AppTile = (app) =>
	new Widget.Button({
		class_name: "AppTile",
		on_clicked: () => {
			App.get_window(getWindowName("app_launcher")).set_visible(false);
			app.launch();
		},
		attribute: { app },
		child: new Widget.Box({
			children: [
				new Widget.Icon({
					class_name: "Icon",
					icon: app.icon_name || "",
				}),
				new Widget.Label({
					label: app.name,
					truncate: "end",
				}),
			],
		}),
	});

export const AppLauncher = (monitor: Gdk.Monitor) => {
	const getApps = () =>
		[
			...applications.fuzzy_query(""),
			{
				name: "Shutdown",
				icon_name: "system-shutdown",
				launch: () => exec("systemctl poweroff"),
				get_keywords: () => ["Shutdown", "Poweroff"],
				get_categories: () => ["Power"],
			},
			{
				name: "Reboot",
				icon_name: "system-restart",
				launch: () => exec("systemctl reboot"),
				get_keywords: () => ["Reboot", "Restart"],
				get_categories: () => ["Power"],
			},
			{
				name: "Logout",
				icon_name: "system-log-out",
				launch: () => {
					try {
						exec("hyprctl dispatch exit");
					} catch {
						exec("swaymsg exit");
					}
				},
				get_keywords: () => ["Log", "Out", "Logout", "Leave"],
				get_categories: () => ["Power"],
			},
		]
			.sort((a, b) => (a.name > b.name ? 1 : -1))
			.map(AppTile);

	let appTiles = Variable(getApps());
	let filter: string | null = null;
	let firstVisibleTileId = 0; // of filtered tiles
	let focusedTileId = 0; // of visible tiles

	const getFilteredApps = () => {
		return appTiles
			.get()
			.map((t) => t.attribute.app)
			.filter((app) => {
				if (!filter) {
					return true;
				}
				return match(
					[app.name, ...app.get_keywords(), ...app.get_categories()],
					filter
				);
			});
	};

	const getVisibleWindow = () =>
		getFilteredApps().slice(
			firstVisibleTileId,
			firstVisibleTileId + MAX_VISIBLE_TILES
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
		appTiles.get().forEach((t) => {
			t.visible = windowApps.includes(t.attribute.app);
		});

		// Update focused tile
		const app = getVisibleWindow()[focusedTileId];
		appTiles.get().forEach((tile) => {
			tile.toggleClassName("Focused", tile.attribute.app === app);
		});
	};

	const reset = () => {
		firstVisibleTileId = 0;
		changeFocusedTile(0);
	};

	const input = new Widget.Entry({
		className: "Input",
		hexpand: true,
		primary_icon_name: "search-symbolic",
		onActivate: () => {
			const windowApps = getVisibleWindow();
			const application = windowApps[focusedTileId];
			if (!application) return;

			const window = App.get_window(getWindowName("app_launcher"));
			window.set_visible(false);
			reset();
			application.launch();
		},
		setup: (self) =>
			self.hook(self, "notify::text", () => {
				filter = self.get_text();
				reset();
			}),
	});

	return new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("app_launcher"),
		class_name: "AppLauncher",
		visible: false,
		keymode: Astal.Exclusivity.EXCLUSIVE,
		anchor: Astal.WindowAnchor.TOP,
		margin_top: 200,
		child: new Widget.Box({
			vertical: true,
			className: "AppLauncherContent",
			children: [
				input,
				new Widget.Box({
					vertical: true,
					child: bind(appTiles, "value").as(
						(tiles) => new Widget.Box({ vertical: true, children: tiles })
					),
				}),
			],
		}),
		onKeyPressEvent: (_, event: Gdk.Event) => {
			const key_value = event.get_keyval()[1];
			if (key_value === Gdk.KEY_Escape) {
				App.get_window(getWindowName("app_launcher")).set_visible(false);
			}
			if (key_value === Gdk.KEY_Up) {
				changeFocusedTile(focusedTileId - 1);
				return Gdk.EVENT_STOP;
			}
			if (key_value === Gdk.KEY_Down) {
				changeFocusedTile(focusedTileId + 1);
				return Gdk.EVENT_STOP;
			}
		},
		setup: (self) =>
			self.hook(self, "notify::visible", () => {
				applications.reload();
				filter = "";
				input.text = "";
				input.grab_focus();
				appTiles.set(getApps());

				reset();
			}),
	});
};
