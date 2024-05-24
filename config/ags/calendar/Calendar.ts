import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { getWindowName } from "utils";

export const Calendar = (monitor: Gdk.Monitor) =>
	Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("calendar", monitor),
		anchor: ["top"],
		visible: false,
		child: Widget.Box({
			class_name: "CalendarWindow",
			child: Widget.Calendar({
				class_name: "Calendar",
				showDayNames: true,
				showHeading: true,
			}),
		}),
	});
