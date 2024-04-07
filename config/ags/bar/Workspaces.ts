const hyprland = await Service.import("hyprland");

const dispatch = (workspace_index: number) =>
	hyprland.messageAsync(`dispatch workspace ${workspace_index}`);

const SIZE = 30;
const SELECtED_WIDTH = 45;

export const Workspaces = () =>
	Widget.Box({
		child: Widget.Box({
			class_name: "Workspaces",
			children: Array.from({ length: 10 }, (_, i) => i + 1).map((i) =>
				Widget.Button({
					className: "Workspace",
					attribute: i,
					label: `${i}`,
					height_request: SIZE,
					onClicked: () => dispatch(i),
					setup: (self) =>
						self.hook(hyprland, () => {
							if (hyprland.active.workspace.id == self.attribute) {
								self.toggleClassName("Active", true);
								self.width_request = SELECtED_WIDTH;
							} else {
								self.toggleClassName("Active", false);
								self.width_request = SIZE;
							}
						}),
				}),
			),
			setup: (self) =>
				self.hook(hyprland, () =>
					self.children.forEach((workspace_button) => {
						workspace_button.visible = hyprland.workspaces.some(
							(ws) => ws.id === workspace_button.attribute,
						);
					}),
				),
		}),
	});
