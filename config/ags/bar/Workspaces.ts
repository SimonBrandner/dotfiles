import { Align } from "types/@girs/gtk-3.0/gtk-3.0.cjs";

let hyprland = null;
try {
	hyprland = await Service.import("hyprland");
} catch {
	hyprland = null;
}

export const Workspaces = () => {
	if (!hyprland) {
		return Widget.Box();
	}

	const dispatch = (workspace_index: number) =>
		hyprland.messageAsync(`dispatch workspace ${workspace_index}`);

	return Widget.Box({
		child: Widget.Box({
			class_name: "Workspaces",
			children: Array.from({ length: 11 }, (_, i) => i + 1).map((i) =>
				Widget.Button({
					className: "Workspace",
					attribute: i,
					label: `${i - 1}`, // I prefer to have a 0th workspace and this is
					// a hack to achieve it
					valign: Align.CENTER,
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
