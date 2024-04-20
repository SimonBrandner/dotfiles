import { BluetoothIndicator, BluetoothPage } from "quick_settings/Bluetooth";
import { AudioIndicator, AudioPage } from "./Audio";
import { NetworkIndicator, NetworksPage } from "./Networks";
import { OverviewPage, OverviewIndicator } from "./Overview";

export type SectionName = "overview" | "networks" | "bluetooth" | "audio";
type Sections = Record<SectionName, { page: any; indicator: any }>;

export const QUICK_SETTINGS_WINDOW_NAME = "quick_settings";

export const QuickSettings = () => {
	const current_page_name = Variable<SectionName>("overview");
	const sections: Sections = {
		overview: {
			page: OverviewPage({ current_page_name }),
			indicator: OverviewIndicator(),
		},
		networks: {
			page: NetworksPage(),
			indicator: NetworkIndicator(),
		},
		bluetooth: {
			page: BluetoothPage(),
			indicator: BluetoothIndicator(),
		},
		audio: {
			page: AudioPage(),
			indicator: AudioIndicator(),
		},
	};
	const pages = () =>
		Widget.Stack({
			class_name: "PageStack",
			transition: "over_left_right",
			children: Object.entries(sections).reduce(
				(sections: { [key: string]: any }, [sectionName, section]) => {
					sections[sectionName] = section.page;
					return sections;
				},
				{},
			),
		}).hook(current_page_name, (self) => {
			self.visible_child_name = current_page_name.value;
		});
	const pageButtons = () =>
		Widget.Box({
			class_name: "PageButtons",
			hpack: "center",
			children: Object.entries(sections).map(([sectionName, section]) =>
				Widget.Button({
					class_name: "PageButton",
					child: section.indicator,
					on_clicked: () => {
						current_page_name.value = sectionName as SectionName;
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
		class_name: "QuickSettingsWindow",
		child: Widget.Box({
			class_name: "QuickSettings",
			vertical: true,
			children: [pageButtons(), pages()],
		}),
	});
};
