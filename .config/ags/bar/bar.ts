import { Clock } from "bar/clock";
import { Workspaces } from "bar/workspaces";
//import { SystemTray } from "bar/tray";

export const Bar = (monitor: number) =>
	Widget.Window({
		monitor,
		name: `bar${monitor}`,
		anchor: ["top", "left", "right"],
		exclusivity: "exclusive",
		class_name: "bar",
		child: Widget.CenterBox({
			start_widget: Workspaces,
			center_widget: Clock,
			//end_widget: SystemTray,
		}),
	});
