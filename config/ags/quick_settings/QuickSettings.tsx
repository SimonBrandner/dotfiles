import { createState } from "ags";
import { Astal, Gdk } from "ags/gtk3";
import app from "ags/gtk3/app";
import Gtk from "gi://Gtk?version=3.0";
import { getWindowName } from "../utils";
import { AudioIndicator, AudioPage } from "./Audio";
import { BluetoothIndicator, BluetoothPage } from "./Bluetooth";
import { ClipboardIndicator, ClipboardPage } from "./Clipboard";
import { MediaIndicator, MediaPage } from "./Media";
import { NetworkIndicator, NetworksPage } from "./Networks";
import { NotificationIndicator } from "./Notifications";
import { NotificationsPage } from "./NotificationsPage";
import { OverviewIndicator, OverviewPage } from "./Overview";

export type SectionName =
	| "overview"
	| "networks"
	| "bluetooth"
	| "audio"
	| "media"
	| "notifications"
	| "clipboard";
type Sections = Record<
	SectionName,
	{
		page: any;
		indicator: any;
	}
>;

// We export this, so that we can change it from other places
export const [QUICK_SETTINGS_PAGE, set_QUICK_SETTINGS_PAGE] =
	createState<SectionName>("overview");

export const QuickSettings = ({ monitor }: { monitor: Gdk.Monitor }) => {
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

	return (
		<window
			gdkmonitor={monitor}
			application={app}
			visible={false}
			name={getWindowName("quick_settings", monitor)}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
			class="QuickSettingsWindow"
		>
			<box class="QuickSettings" orientation={Gtk.Orientation.VERTICAL}>
				<box class="PageButtons" halign={Gtk.Align.CENTER}>
					{Object.entries(sections).map(([sectionName, section]) => (
						<button
							class={QUICK_SETTINGS_PAGE(
								(n) => "PageButton" + (n === sectionName ? " Active" : "")
							)}
							onClicked={() =>
								set_QUICK_SETTINGS_PAGE(sectionName as SectionName)
							}
						>
							{section.indicator}
						</button>
					))}
				</box>
				<stack
					class="PageStack"
					visibleChildName={QUICK_SETTINGS_PAGE((n) => n + "_page")}
					children={Object.values(sections).map((s) => s.page)}
				/>
			</box>
		</window>
	);
};
