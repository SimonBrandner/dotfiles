import { Application } from "types/service/applications";
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

const customEntryMatch = (keywords: Array<string>, term: string): boolean => {
	for (const keyword of keywords) {
		if (keyword.toLowerCase().includes(term.toLowerCase())) {
			return true;
		}
	}

	return false;
};

const AppTile = (app: Application) =>
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
				match: (term: string): boolean =>
					customEntryMatch(["Shutdown", "Poweroff"], term),
			} as Application,
			{
				name: "Reboot",
				icon_name: "system-restart",
				launch: () => exec("systemctl reboot"),
				match: (term: string): boolean =>
					customEntryMatch(["Reboot", "Restart"], term),
			} as Application,
			{
				name: "Logout",
				icon_name: "system-log-out",
				launch: () => {
					Utils.exec("hyprctl dispatch exit");
					Utils.exec("swaymsg exit");
				},
				match: (term: string): boolean =>
					customEntryMatch(["Log", "Out", "Logout", "Leave"], term),
			} as Application,
		]
			.sort((a, b) => (a.name > b.name ? 1 : -1))
			.map(AppTile);

	let appTiles = Variable(getApps());
	let filter: string | null = null;
	let firstVisibleTileId = 0; // of filtered tiles
	let focusedTileId = 0; // of visible tiles

	const getFilteredApps = () =>
		appTiles
			.get()
			.filter((t) => t.attribute.app.match(filter ?? ""))
			.map((t) => t.attribute.app);

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
			window.set_visible(window.get_visible());
			reset();
			application.launch();
		},
	}).hook("notify::text", (self) => {
		filter = self.get_text();
		reset();
	});

	return new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("app_launcher"),
		class_name: "AppLauncher",
		visible: false,
		keymode: Astal.Exclusivity.EXCLUSIVE,
		anchor: Astal.WindowAnchor.TOP,
		margins: [200, 0],
		child: new Widget.Box({
			vertical: true,
			className: "AppLauncherContent",
			children: [
				input,
				new Widget.Box({
					vertical: true,
					child: bind(appTiles, "value").as(
						(tiles) => new Widget.Box({ children: tiles })
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
	}).hook("notify::visible", () => {
		applications.reload();
		filter = "";
		input.text = "";
		input.grab_focus();
		appTiles.set(getApps());

		reset();
	});
};
