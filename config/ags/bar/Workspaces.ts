import { bind, exec } from "astal";
import { Gtk, Widget } from "astal/gtk3";

import Sway, { Workspace } from "../services/Sway.ts";

let sway = null;
try {
	sway = Sway.get_default();
} catch {
	sway = null;
}

export const Workspaces = () => {
	if (sway) {
		return SwayWorkspaces();
	} else {
		throw "No known window manager running";
	}
};

export const SwayWorkspaces = () => {
	return new Widget.Box({
		child: bind(sway!, "workspaces").as(
			(workspaces) =>
				new Widget.Box({
					class_name: "Workspaces",
					children: workspaces
						.sort((a, b) => {
							try {
								return parseInt(a.name) > parseInt(b.name);
							} catch {
								return false;
							}
						})
						.map(
							(workspace: Workspace) =>
								new Widget.Button({
									className: workspace.focused
										? "Workspace Active"
										: "Workspace",
									label: workspace.name,
									onClickRelease: () =>
										exec(`swaymsg workspace ${workspace.name}`),
									valign: Gtk.Align.CENTER,
								})
						),
				})
		),
	});
};
