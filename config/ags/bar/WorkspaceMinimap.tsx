import { Gdk, Gtk } from "ags/gtk4";
import { createBinding, For, With } from "gnim";
import Niri from "../services/Niri";

const niri = Niri.get_default();

type WorkspaceMinimapProps = {
	monitor: Gdk.Monitor;
};

// We must wrap the thing in a box in order to avoid reorders
export const WorkspaceMinimap = ({ monitor }: WorkspaceMinimapProps) => (
	<box>
		<With value={createBinding(niri, "running")}>
			{(niriRunning) => {
				if (!niriRunning) {
					return <box />;
				}

				const workspace = createBinding(
					niri,
					"workspaces"
				)((ws) =>
					ws
						.filter((w) => w.output === monitor.connector)
						.find((w) => w.is_active)
				);
				const windows = createBinding(
					niri,
					"windows"
				)((ws) =>
					ws
						.filter((w) => !w.is_floating)
						.filter((w) => w.workspace_id === workspace()?.id)
						.sort((a, b) => {
							const aPosition = a.layout.pos_in_scrolling_layout!;
							const bPosition = b.layout.pos_in_scrolling_layout!;
							if (aPosition[0] > bPosition[0]) {
								return 1;
							} else if (aPosition[0] < bPosition[0]) {
								return -1;
							} else {
								return aPosition[1] < bPosition[1] ? 1 : -1;
							}
						})
				);

				return (
					<box class="WorkspaceMinimap">
						<For each={windows}>
							{(window) => (
								<button
									class={"Window" + (window.is_focused ? " Active" : "")}
									onClicked={() => niri.focusWindow(window.id)}
								>
									<Gtk.Image iconName={window.app_id} />
								</button>
							)}
						</For>
					</box>
				);
			}}
		</With>
	</box>
);
