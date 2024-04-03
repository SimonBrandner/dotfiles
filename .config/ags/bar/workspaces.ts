const hyprland = await Service.import("hyprland");

const dispatch = (workspace_index: number) =>
	hyprland.messageAsync(`dispatch workspace ${workspace_index}`);

export const Workspaces = Widget.EventBox({
	child: Widget.Box({
		class_name: "workspaces",
		children: Array.from({ length: 10 }, (_, i) => i + 1).map((i) =>
			Widget.Button({
				class_names: ["workspace"],
				attribute: i,
				label: `${i}`,
				onClicked: () => dispatch(i),
				setup: (self) =>
					self.hook(hyprland, () => {
						if (hyprland.active.workspace.id == self.attribute) {
							self.toggleClassName("active", true);
						} else {
							self.toggleClassName("active", false);
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
