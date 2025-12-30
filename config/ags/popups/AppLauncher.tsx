import { Accessor } from "ags";
import { Gdk } from "ags/gtk3";
import Apps from "gi://AstalApps";
import { getWindowName } from "../utils";
import Pango from "gi://Pango?version=1.0";
import { exec } from "ags/process";
import { PopupSearch } from "./PopupSearch";

interface AppLauncherEntry {
	name: string;
	icon_name: string;
	launch: () => void;
	get_keywords: () => Array<string>;
	get_categories: () => Array<string>;
}

const applications = new Apps.Apps({
	nameMultiplier: 2,
	entryMultiplier: 0,
	executableMultiplier: 2,
});

const match = (keywords: Array<string>, term: string): boolean => {
	for (const keyword of keywords) {
		if (keyword.toLowerCase().includes(term.toLowerCase())) {
			return true;
		}
	}

	return false;
};

const getAllApplications = (): Array<AppLauncherEntry> =>
	[
		...applications.fuzzy_query(""),
		{
			name: "Shutdown",
			icon_name: "system-shutdown",
			launch: () => exec("systemctl poweroff"),
			get_keywords: () => ["Shutdown", "Poweroff"],
			get_categories: () => ["Power"],
		},
		{
			name: "Reboot",
			icon_name: "system-restart",
			launch: () => exec("systemctl reboot"),
			get_keywords: () => ["Reboot", "Restart"],
			get_categories: () => ["Power"],
		},
		{
			name: "Logout",
			icon_name: "system-log-out",
			launch: () => {
				try {
					exec("hyprctl dispatch exit");
				} catch {
					exec("swaymsg exit");
				}
			},
			get_keywords: () => ["Log", "Out", "Logout", "Leave"],
			get_categories: () => ["Power"],
		},
	].sort((a, b) => (a.name > b.name ? 1 : -1));

const getFilteredApplicationsIndices = (filterText: string) =>
	getAllApplications()
		.map((_, i) => i)
		.filter((index) => {
			const application = getAllApplications()[index];
			return match(
				[
					application.name,
					...application.get_categories(),
					...application.get_keywords(),
				],
				filterText
			);
		});

const AppTile = ({ application }: { application: AppLauncherEntry }) => (
	<box class="AppTile">
		<icon class="Icon" icon={application.icon_name} />
		<label label={application.name} ellipsize={Pango.EllipsizeMode.END} />
	</box>
);

export const AppLauncher = (monitor: Gdk.Monitor) => (
	<PopupSearch
		monitor={monitor}
		windowName={getWindowName("app_launcher")}
		onActivate={(index: number) => {
			const application = getAllApplications()[index];
			if (!application) {
				return;
			}
			application.launch();
		}}
		getFilteredIndices={getFilteredApplicationsIndices}
		onReset={() => applications.reload()}
	>
		{getAllApplications().map((application) => (
			<AppTile application={application} />
		))}
	</PopupSearch>
);
