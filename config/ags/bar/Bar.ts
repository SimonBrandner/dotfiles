import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";

import { getWindowName } from "../utils";

import { BarClock } from "./Clock";
import { QuickSettings } from "./QuickSettings";
import { SystemTray } from "./Tray";
import { Workspaces } from "./Workspaces";

const Section = (props) => {
	let position: "Left" | "Center" | "Right" | "" = "";
	if (props.halign === Gtk.Align.START) {
		position = "Left";
	} else if (props.halign === Gtk.Align.CENTER) {
		position = "Center";
	} else if (props.halign === Gtk.Align.END) {
		position = "Right";
	}

	return new Widget.Box({
		hexpand: false,
		vexpand: true,
		valign: Gtk.Align.FILL,
		spacing: 10,
		class_name: `Section ${position}`,
		...props,
	});
};

export const Bar = (monitor: Gdk.Monitor) =>
	new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("bar", monitor),
		anchor:
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.RIGHT |
			Astal.WindowAnchor.LEFT,
		exclusivity: Astal.Exclusivity.EXCLUSIVE,
		child: new Widget.CenterBox({
			className: "Bar",
			startWidget: Section({
				halign: Gtk.Align.START,
				child: Workspaces(),
			}),
			centerWidget: Section({
				halign: Gtk.Align.CENTER,
				valign: Gtk.Align.CENTER,
				child: BarClock(monitor),
			}),
			endWidget: Section({
				halign: Gtk.Align.END,
				children: [SystemTray(), QuickSettings(monitor)],
			}),
		}),
	});
