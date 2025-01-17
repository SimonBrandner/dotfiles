import { Gtk, Widget } from "astal/gtk3";
import { bind } from "astal";
import Hyprland from "gi://AstalHyprland";

import Sway, { Workspace } from "../services/Sway.ts";

let hyprland = null;
try {
	hyprland = Hyprland.get_default();
} catch {
	hyprland = null;
}

let sway = null;
try {
	sway = Sway.get_default();
} catch {
	sway = null;
}

export const Workspaces = () => {
	if (hyprland) {
		return HyprlandWorkspaces();
	} else if (sway) {
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
					children: workspaces.map(
						(workspace: Workspace) =>
							new Widget.Button({
								className: workspace.focused ? "Workspace Active" : "Workspace",
								label: workspace.name,
								onClicked: () => {},

								valign: Gtk.Align.CENTER,
							})
					),
				})
		),
	});
};

export const HyprlandWorkspaces = () => {
	const dispatch = (workspace_index: number) =>
		hyprland.messageAsync(`dispatch workspace ${workspace_index}`);

	return new Widget.Box({
		child: new Widget.Box({
			class_name: "Workspaces",
			children: Array.from({ length: 11 }, (_, i) => i + 1).map(
				(i) =>
					new Widget.Button({
						className: "Workspace",
						attribute: i,
						label: `${i - 1}`, // I prefer to have a 0th workspace and this is
						// a hack to achieve it
						valign: Gtk.Align.CENTER,
						onClicked: () => dispatch(i),
						setup: (self) =>
							self.hook(hyprland, () => {
								if (hyprland.active.workspace.id == self.attribute) {
									self.toggleClassName("Active", true);
								} else {
									self.toggleClassName("Active", false);
								}
							}),
					})
			),
			setup: (self) =>
				self.hook(hyprland, () =>
					self.children.forEach((workspace_button) => {
						workspace_button.visible = hyprland.workspaces.some(
							(ws) => ws.id === workspace_button.attribute
						);
					})
				),
		}),
	});
};
