import { BluetoothIndicator, BluetoothPage } from "quick_settings/Bluetooth";
import { AudioIndicator, AudioPage } from "./Audio";
import { NetworkIndicator, NetworksPage } from "./Networks";
import { OverviewPage, OverviewIndicator } from "./Overview";
import {
	NotificationIndicator,
	NotificationsPage,
} from "quick_settings/Notifications";
import { ClipboardIndicator, ClipboardPage } from "quick_settings/Clipboard";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { getWindowName } from "utils";

export type SectionName =
	| "overview"
	| "networks"
	| "bluetooth"
	| "audio"
	| "notifications"
	| "clipboard";
type Sections = Record<SectionName, { page: any; indicator: any }>;

export const QuickSettings = (monitor: Gdk.Monitor) => {
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
		clipboard: {
			page: ClipboardPage(),
			indicator: ClipboardIndicator(),
		},
		notifications: {
			page: NotificationsPage(),
			indicator: NotificationIndicator(),
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
		gdkmonitor: monitor,
		visible: false,
		name: getWindowName("quick_settings", monitor),
		anchor: ["top", "right"],
		class_name: "QuickSettingsWindow",
		child: Widget.Box({
			class_name: "QuickSettings",
			vertical: true,
			children: [pageButtons(), pages()],
		}),
	});
};
