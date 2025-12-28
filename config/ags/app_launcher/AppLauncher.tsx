import { Accessor, createComputed, createEffect, createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import app from "ags/gtk3/app";
import Apps from "gi://AstalApps";
import { getWindowName } from "../utils";
import Pango from "gi://Pango?version=1.0";
import { exec } from "ags/process";

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

const MAX_VISIBLE_TILES = 8;

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

const AppTile = ({
	application,
	visible,
	focused,
}: {
	focused: Accessor<boolean>;
	visible: Accessor<boolean>;
	application: AppLauncherEntry;
}) => (
	<button
		class={focused((v) => "AppTile" + (v ? " Focused" : ""))}
		visible={visible}
		onClicked={() => {
			app.get_window(getWindowName("app_launcher"))?.set_visible(false);
			application.launch();
		}}
	>
		<box>
			<icon class="Icon" icon={application.icon_name || ""} />
			<label label={application.name} ellipsize={Pango.EllipsizeMode.END} />
		</box>
	</button>
);

export const AppLauncher = (monitor: Gdk.Monitor) => {
	let [filterText, setFilterText] = createState("");
	let [selectionOffset, setSelectionOffset] = createState(0);
	let [windowOffset, setWindowOffset] = createState(0);

	let visibleApplications = createComputed(() =>
		getFilteredApplicationsIndices(filterText()).slice(
			windowOffset(),
			windowOffset() + MAX_VISIBLE_TILES
		)
	);
	let focusedApplication = createComputed(
		() => getFilteredApplicationsIndices(filterText())[selectionOffset()]
	);

	createEffect(() => {
		const sel = selectionOffset();
		const win = windowOffset();

		if (sel < win) {
			setWindowOffset(sel);
		} else if (sel >= win + MAX_VISIBLE_TILES) {
			setWindowOffset(sel - MAX_VISIBLE_TILES + 1);
		}
	});

	const moveSelection = (delta: 1 | -1) => {
		const newSelectionOffset = selectionOffset() + delta;
		if (
			newSelectionOffset >= 0 &&
			newSelectionOffset + 1 <=
				getFilteredApplicationsIndices(filterText()).length - 1
		) {
			setSelectionOffset(newSelectionOffset);
		}
	};

	const reset = () => {
		applications.reload();

		input.grab_focus();
		input.text = "";
		setFilterText("");
		setSelectionOffset(0);
		setWindowOffset(0);
	};

	let input: Gtk.Entry;
	return (
		<window
			gdkmonitor={monitor}
			application={app}
			name={getWindowName("app_launcher")}
			class="AppLauncher"
			visible={false}
			keymode={Astal.Keymode.EXCLUSIVE}
			anchor={Astal.WindowAnchor.TOP}
			margin_top={200}
			$={(self) => {
				self.connect("notify::visible", reset);
			}}
			onKeyPressEvent={(_, event) => {
				const keyValue = (event as any).get_keyval()[1];
				if (keyValue === Gdk.KEY_Escape) {
					app.get_window(getWindowName("app_launcher"))?.set_visible(false);
					reset();
				}
				if (keyValue === Gdk.KEY_Up) {
					moveSelection(-1);
					return Gdk.EVENT_STOP;
				}
				if (keyValue === Gdk.KEY_Down) {
					moveSelection(+1);
					return Gdk.EVENT_STOP;
				}
			}}
		>
			<box orientation={Gtk.Orientation.VERTICAL} class="AppLauncherContent">
				<entry
					class="Input"
					hexpand={true}
					primary_icon_name="search-symbolic"
					$={(self) => {
						input = self;
						self.connect("notify::text", () => {
							setWindowOffset(0);
							setSelectionOffset(0);
							setFilterText(self.get_text());
						});
					}}
					onActivate={() => {
						const application = getAllApplications()[focusedApplication()];
						if (!application) {
							return;
						}
						application.launch();

						app.get_window(getWindowName("app_launcher"))?.set_visible(false);
						reset();
					}}
				></entry>
				<box orientation={Gtk.Orientation.VERTICAL}>
					{getAllApplications().map((application, index) => (
						<AppTile
							visible={visibleApplications((v) => v.includes(index))}
							focused={focusedApplication((f) => f === index)}
							application={application}
						/>
					))}
				</box>
			</box>
		</window>
	);
};
