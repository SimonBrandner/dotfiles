import { Widget, App, Astal, Gdk } from "astal/gtk3";

import { getWindowName } from "../utils";

export const Calendar = (monitor: Gdk.Monitor) =>
	new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("calendar", monitor),
		anchor: Astal.WindowAnchor.TOP,
		visible: false,
		child: new Widget.Box({
			class_name: "CalendarWindow",
			// TODO
		}),
	});
