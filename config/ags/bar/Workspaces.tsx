import { createBinding, For } from "ags";
import { exec } from "ags/process";
import Gtk from "gi://Gtk?version=3.0";
import Sway, { Workspace } from "../services/Sway";

const sway = Sway.get_default();

export const Workspaces = () => {
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
