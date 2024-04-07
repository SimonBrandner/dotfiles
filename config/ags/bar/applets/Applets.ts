import { AudioPage } from "bar/applets/Audio";
import { Networks } from "bar/applets/Networks";

export const Applets = (monitor: number) => {
	const current_page_name = Variable("audio");
	const pages = Widget.Stack({
		children: { audio: AudioPage(), networks: Networks() },
		visible_child_name: current_page_name.bind(),
	});

	return Widget.Window({
		monitor,
		visible: false,
		name: `applets`,
		anchor: ["top", "right"],
		exclusivity: "exclusive",
		class_name: "AppletsWindow",
		child: Widget.Box({
			class_name: "Applets",
			vertical: true,
			children: [
				Widget.Label({
					label: "Applet",
				}),
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
	});
};
