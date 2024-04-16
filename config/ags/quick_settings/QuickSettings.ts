import { AudioPage } from "./Audio";
import { Networks } from "./Networks";
import { Overview } from "./Overview";

export const QUICK_SETTINGS_WINDOW_NAME = "quick_settings";

export const QuickSettings = () => {
	const current_page_name = Variable("overview");
	const pages = Widget.Stack({
		children: {
			overview: Overview(),
			audio: AudioPage(),
			networks: Networks(),
		},
	}).hook(current_page_name, (self) => {
		self.visible_child_name = current_page_name.value;
	});

	return Widget.Window({
		visible: false,
		name: QUICK_SETTINGS_WINDOW_NAME,
		anchor: ["top", "right"],
		exclusivity: "exclusive",
		class_name: "AppletsWindow",
		child: Widget.Box({
			css: "padding: 1px;",
			child: Widget.Box({
				class_name: "Applets",
				vertical: true,
				children: [
					Widget.Box({
						children: Object.keys(pages.children).map((page) =>
							Widget.Button({
								on_clicked: () => {
									current_page_name.setValue(page);
								},
								label: page,
							}),
						),
					}),
					pages,
				],
			}),
		}),
	});
};
