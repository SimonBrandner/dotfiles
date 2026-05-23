import { createBinding, For } from "ags";
import { exec } from "ags/process";
import Gtk from "gi://Gtk?version=4.0";
import Sway, { Workspace } from "../services/Sway";

export const Workspaces = () => {
	let sway;
	try {
		sway = Sway.get_default();
	} catch {}

	if (!sway) {
		return <box />;
	}

	const workspaces = createBinding(sway, "workspaces");

	return (
		<box class="Workspaces">
			<For
				each={workspaces((ws: Array<Workspace>) =>
					ws.sort((a, b) => (a.name > b.name ? 1 : -1))
				)}
			>
				{(workspace: Workspace) => (
					<button
						class={workspace.focused ? "Workspace Active" : "Workspace"}
						label={workspace.name}
						onClicked={() => exec(`swaymsg workspace ${workspace.name}`)}
						valign={Gtk.Align.CENTER}
					/>
				)}
			</For>
		</box>
	);
};
