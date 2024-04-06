import { AppletsButton } from "bar/AppletsButton";
import { Clock } from "bar/Clock";
import { Workspaces } from "bar/Workspaces";
import { SystemTray } from "bar/Tray";
import { Align } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { BoxProps } from "types/widgets/box";

const BAR_HEIGHT = 30;

const Section = (props: BoxProps) =>
	Widget.Box({
		hexpand: false,
		valign: Align.FILL,
		vexpand: true,
		className: "Section",
		...props,
	});

export const Bar = (monitor: number) =>
	Widget.Window({
		monitor,
		name: `bar${monitor}`,
		anchor: ["top", "left", "right"],
		exclusivity: "exclusive",
		className: "Bar",
		child: Widget.CenterBox({
			height_request: BAR_HEIGHT,
			startWidget: Section({
				halign: Align.START,
				className: "Section",
				child: Workspaces(),
			}),
			centerWidget: Section({
				halign: Align.CENTER,
				className: "Section",
				child: Clock(),
			}),
			endWidget: Section({
				halign: Align.END,
				children: [SystemTray, AppletsButton],
			}),
		}),
	});
