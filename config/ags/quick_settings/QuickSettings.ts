import { Widget } from "astal/gtk3";
import { Variable } from "astal";

import { BluetoothIndicator, BluetoothPage } from "./Bluetooth";
import { AudioIndicator, AudioPage } from "./Audio";
import { NetworkIndicator, NetworksPage } from "./Networks";
import { OverviewPage, OverviewIndicator } from "./Overview";
import { NotificationIndicator, NotificationsPage } from "./Notifications";
import { ClipboardIndicator, ClipboardPage } from "./Clipboard";
import { getWindowName } from "../utils";
import { MediaIndicator, MediaPage } from "./Media";

export type SectionName =
	| "overview"
	| "networks"
	| "bluetooth"
	| "audio"
	| "media"
	| "notifications"
	| "clipboard";
type Sections = Record<SectionName, { page: any; indicator: any }>;

// We export this, so that we can change it from other places
export const QUICK_SETTINGS_PAGE = Variable<SectionName>("overview");

export const QuickSettings = (monitor: Gdk.Monitor) => {
	const sections: Sections = {
		overview: {
			page: OverviewPage({ current_page_name: QUICK_SETTINGS_PAGE }),
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
		media: {
			page: MediaPage(),
			indicator: MediaIndicator(),
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
				{}
			),
		}).hook(QUICK_SETTINGS_PAGE, (self) => {
			self.visible_child_name = QUICK_SETTINGS_PAGE.value;
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
						QUICK_SETTINGS_PAGE.value = sectionName as SectionName;
					},
				}).hook(QUICK_SETTINGS_PAGE, (self) => {
					self.toggleClassName(
						"Active",
						QUICK_SETTINGS_PAGE.value === sectionName
					);
				})
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
