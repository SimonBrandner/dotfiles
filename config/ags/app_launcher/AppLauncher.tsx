import { Accessor, createState } from "ags";
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
	let [visibleApplications, setVisibleApplications] = createState<
		Array<number>
	>(getAllApplications().map((_, i) => i));
	let [focusedApplication, setFocusedApplication] = createState<number>(0);

	const reset = () => {
		applications.reload();

		input.text = "";

		setVisibleApplications(
			getAllApplications()
				.map((_, i) => i)
				.slice(0, MAX_VISIBLE_TILES)
		);
		setFocusedApplication(0);
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
				self.connect("notify::visible", () => {
					input.grab_focus();
					reset();
				});
			}}
			onKeyPressEvent={(_, event) => {
				const keyValue = (event as any).get_keyval()[1];
				if (keyValue === Gdk.KEY_Escape) {
					app.get_window(getWindowName("app_launcher"))?.set_visible(false);
					reset();
				}
				let newFocused = focusedApplication();
				if (keyValue === Gdk.KEY_Up) {
					newFocused--;
					while (
						newFocused > 0 &&
						!visibleApplications().includes(newFocused)
					) {
						newFocused--;
					}

					if (newFocused == 0 && !visibleApplications().includes(newFocused)) {
						return Gdk.EVENT_STOP;
					}
					setFocusedApplication(newFocused);

					return Gdk.EVENT_STOP;
				}
				if (keyValue === Gdk.KEY_Down) {
					newFocused++;
					while (
						newFocused < getAllApplications().length &&
						!visibleApplications().includes(newFocused)
					) {
						newFocused++;
					}

					if (
						newFocused == getAllApplications().length &&
						!visibleApplications().includes(newFocused)
					) {
						return Gdk.EVENT_STOP;
					}
					setFocusedApplication(newFocused);

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
							const filter = self.get_text();
							if (!filter) {
								return;
							}

							setVisibleApplications(
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
											filter!
										);
									})
									.slice(0, MAX_VISIBLE_TILES)
							);
							setFocusedApplication(visibleApplications()[0]);
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
