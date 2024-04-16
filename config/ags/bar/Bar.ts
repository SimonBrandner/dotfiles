import { QuickSettings } from "./QuickSettings";
import { Clock } from "bar/Clock";
import { Workspaces } from "bar/Workspaces";
import { SystemTray } from "bar/Tray";
import { Align } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { BoxProps } from "types/widgets/box";

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

export const Bar = () =>
	Widget.Window({
		name: `bar`,
		anchor: ["top", "left", "right"],
		exclusivity: "exclusive",
		className: "Bar",
		child: Widget.CenterBox({
			startWidget: Section({
				halign: Align.START,
				child: Workspaces(),
			}),
			centerWidget: Section({
				halign: Align.CENTER,
				child: Clock(),
			}),
			endWidget: Section({
				halign: Align.END,
				children: [SystemTray(), QuickSettings()],
			}),
		}),
	});
