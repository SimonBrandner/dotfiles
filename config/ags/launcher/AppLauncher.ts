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
					icon: app.icon_name || "",
					size: 42,
				}),
				Widget.Label({
					label: app.name,
					xalign: 0,
					vpack: "center",
					truncate: "end",
				}),
			],
		}),
	});

const AppLauncherContent = () => {
	let application_tiles = query("").map(AppTile);

	const application_list_widget = Widget.Box({
		vertical: true,
		children: application_tiles,
	});

	const input_widget = Widget.Entry({
		className: "Input",
		hexpand: true,
		on_accept: () => {
			const filtered_applications = application_tiles.filter(
				(item) => item.visible,
			);
			const application = filtered_applications[0]?.attribute?.app;
			if (!application) return;

			App.toggleWindow(APP_LAUNCHER_WINDOW_NAME);
			application.launch();
		},
		on_change: ({ text }) =>
			application_tiles.forEach((item) => {
				item.visible = item.attribute.app.match(text ?? "");
			}),
	});

	return Widget.Box({
		vertical: true,
		className: "AppLauncherContent",
		children: [
			input_widget,
			Widget.Scrollable({
				class_name: "AppLauncherContentScrollable",
				hscroll: "never",
				child: application_list_widget,
			}),
		],
		setup: (self) =>
			self.hook(App, (_, windowName, visible) => {
				if (windowName !== APP_LAUNCHER_WINDOW_NAME) return;

				// when the applauncher shows up
				if (visible) {
					input_widget.text = "";
					input_widget.grab_focus();
				}
			}),
	});
};

export const AppLauncher = () =>
	Widget.Window({
		name: APP_LAUNCHER_WINDOW_NAME,
		class_name: "AppLauncher",
		setup: (self) => {
			self.keybind("Escape", () => {
				App.closeWindow(APP_LAUNCHER_WINDOW_NAME);
			});
			// This is an ugly hack to reload the application list each time we
			// show the launcher
			self.connect("notify::visible", () => {
				applications.reload();
				self.child = AppLauncherContent();
			});
		},
		visible: false,
		keymode: "exclusive",
		child: AppLauncherContent(),
	});
