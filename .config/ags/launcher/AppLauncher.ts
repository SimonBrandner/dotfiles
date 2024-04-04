import { Application } from "types/service/applications";

const { query } = await Service.import("applications");

export const APP_LAUNCHER_WINDOW_NAME = "app_launcher";

const AppTile = (app: Application) =>
	Widget.Button({
		on_clicked: () => {
			App.closeWindow(APP_LAUNCHER_WINDOW_NAME);
			app.launch();
		},
		attribute: { app },
		child: Widget.Box({
			children: [
				Widget.Icon({
					icon: app.icon_name || "",
					size: 42,
				}),
				Widget.Label({
					class_name: "title",
					label: app.name,
					xalign: 0,
					vpack: "center",
					truncate: "end",
				}),
			],
		}),
	});

const AppLauncherContent = ({ width = 500, height = 500, spacing = 12 }) => {
	// list of application buttons
	let applications = query("").map(AppTile);

	// container holding the buttons
	const list = Widget.Box({
		vertical: true,
		children: applications,
		spacing,
	});

	// repopulate the box, so the most frequent apps are on top of the list
	function repopulate() {
		applications = query("").map(AppTile);
		list.children = applications;
	}

	// search entry
	const entry = Widget.Entry({
		hexpand: true,
		css: `margin-bottom: ${spacing}px;`,

		// to launch the first item on Enter
		on_accept: () => {
			// make sure we only consider visible (searched for) applications
			const results = applications.filter((item) => item.visible);
			if (results[0]) {
				App.toggleWindow(APP_LAUNCHER_WINDOW_NAME);
				applications[0].attribute.app.launch();
			}
		},

		// filter out the list
		on_change: ({ text }) =>
			applications.forEach((item) => {
				item.visible = item.attribute.app.match(text ?? "");
			}),
	});

	return Widget.Box({
		vertical: true,
		css: `margin: ${spacing * 2}px;`,
		children: [
			entry,

			// wrap the list in a scrollable
			Widget.Scrollable({
				hscroll: "never",
				css: `min-width: ${width}px;` + `min-height: ${height}px;`,
				child: list,
			}),
		],
		setup: (self) =>
			self.hook(App, (_, windowName, visible) => {
				if (windowName !== APP_LAUNCHER_WINDOW_NAME) return;

				// when the applauncher shows up
				if (visible) {
					repopulate();
					entry.text = "";
					entry.grab_focus();
				}
			}),
	});
};

export const AppLauncher = () =>
	Widget.Window({
		name: APP_LAUNCHER_WINDOW_NAME,
		setup: (self) =>
			self.keybind("Escape", () => {
				App.closeWindow(APP_LAUNCHER_WINDOW_NAME);
			}),
		visible: false,
		keymode: "exclusive",
		child: AppLauncherContent({
			width: 500,
			height: 500,
			spacing: 12,
		}),
	});
