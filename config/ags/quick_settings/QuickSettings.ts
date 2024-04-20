import { AudioIndicator, AudioPage } from "./Audio";
import { NetworkIndicator, NetworksPage } from "./Networks";
import { OverviewPage, OverviewIndicator } from "./Overview";

type Sections = { [key: string]: { content: any; indicator: any } };

const SECTIONS: Sections = {
	overview: {
		content: OverviewPage(),
		indicator: OverviewIndicator(),
	},
	networks: {
		content: NetworksPage(),
		indicator: NetworkIndicator(),
	},
	audio: {
		content: AudioPage(),
		indicator: AudioIndicator(),
	},
};
export const QUICK_SETTINGS_WINDOW_NAME = "quick_settings";

export const QuickSettings = () => {
	const current_page_name = Variable("overview");
	const pages = () =>
		Widget.Stack({
			children: Object.entries(SECTIONS).reduce(
				(sections: { [key: string]: any }, [sectionName, section]) => {
					sections[sectionName] = section.content;
					return sections;
				},
				{},
			),
		}).hook(current_page_name, (self) => {
			self.visible_child_name = current_page_name.value;
		});
	const pageButtons = () =>
		Widget.Box({
			hpack: "center",
			hexpand: true,
			children: Object.entries(SECTIONS).map(([sectionName, section]) =>
				Widget.Button({
					class_name: "PageButton",
					child: section.indicator,
					on_clicked: () => {
						current_page_name.value = sectionName;
					},
				}).hook(current_page_name, (self) => {
					self.toggleClassName(
						"Active",
						current_page_name.value === sectionName,
					);
				}),
			),
		});

	return Widget.Window({
		visible: false,
		name: QUICK_SETTINGS_WINDOW_NAME,
		anchor: ["top", "right"],
		exclusivity: "exclusive",
		class_name: "QuickSettingsWindow",
		child: Widget.Box({
			class_name: "QuickSettings",
			vertical: true,
			children: [pageButtons(), pages()],
		}),
	});
};
