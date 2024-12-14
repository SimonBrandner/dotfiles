import { Gtk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";

let hyprland = null;
try {
	hyprland = Hyprland.get_default();
} catch {
	hyprland = null;
}

export const Workspaces = () => {
	if (!hyprland) {
		return new Widget.Box();
	}

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
