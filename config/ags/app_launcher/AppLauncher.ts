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
	let applicationTiles = query("").map(AppTile);

	const applicationListWidget = Widget.Box({
		vertical: true,
		children: applicationTiles,
	});
	const inputWidget = Widget.Entry({
		className: "Input",
		hexpand: true,
		on_accept: () => {
			const filteredApplications = applicationTiles.filter((t) => t.visible);
			const application = filteredApplications[0]?.attribute?.app;
			if (!application) return;

			App.toggleWindow(APP_LAUNCHER_WINDOW_NAME);
			application.launch();
		},
		on_change: ({ text }) => {
			applicationTiles.forEach((tile) => {
				tile.visible = tile.attribute.app.match(text ?? "");
			});
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
		});
};
