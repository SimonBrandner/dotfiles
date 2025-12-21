import { Astal, Gdk, Gtk } from "ags/gtk3";
import app from "ags/gtk3/app";
import { getWindowName } from "../utils";

export const Calendar = ({ monitor }: { monitor: Gdk.Monitor }) => (
	<window
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("calendar", monitor)}
		anchor={Astal.WindowAnchor.TOP}
		visible={false}
	>
		<Gtk.Calendar class="CalendarWindow" />
	</window>
);
