import { BoxProps } from "types/widgets/box";
import { Widget } from "astal/gtk3";

import { QuickSettings } from "./QuickSettings";
import { Workspaces } from "./Workspaces";
import { SystemTray } from "./Tray";
import { BarClock } from "./Clock";
import { getWindowName } from "../utils";

const Section = (props: BoxProps) => {
	let position: "Left" | "Center" | "Right" | "" = "";
	if (props.halign === Align.START) {
		position = "Left";
	} else if (props.halign === Align.CENTER) {
		position = "Center";
	} else if (props.halign === Align.END) {
		position = "Right";
	}

	return Widget.Box({
		hexpand: false,
		vexpand: true,
		valign: Align.FILL,
		spacing: 10,
		class_names: ["Section", position],
		...props,
	});
};

export const Bar = (monitor: Gdk.Monitor) =>
	Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("bar", monitor),
		anchor: ["top", "left", "right"],
		exclusivity: "exclusive",
		child: Widget.CenterBox({
			className: "Bar",
			startWidget: Section({
				halign: Align.START,
				child: Workspaces(),
			}),
			centerWidget: Section({
				halign: Align.CENTER,
				valign: Align.CENTER,
				child: BarClock(monitor),
			}),
			endWidget: Section({
				halign: Align.END,
				children: [SystemTray(), QuickSettings(monitor)],
			}),
		}),
	});
