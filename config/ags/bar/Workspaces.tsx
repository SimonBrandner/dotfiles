import { With } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import {
	focusWorkspace,
	getWorkspaces,
	Workspace,
} from "../services/WindowManager";

export const Workspaces = () => (
	<With value={getWorkspaces()}>
		{(workspaces) => {
			if (workspaces === null) {
				return <label class="Workspaces" label="Cannot access workspaces" />;
			}
			workspaces.sort((a, b) => (a.name > b.name ? 1 : -1));

			return (
				<box class="Workspaces">
					{workspaces.map((workspace: Workspace) => (
						<button
							class={workspace.focused ? "Workspace Active" : "Workspace"}
							label={workspace.name}
							onClicked={() => focusWorkspace(workspace.name)}
							valign={Gtk.Align.CENTER}
						/>
					))}
				</box>
			);
		}}
	</With>
);
