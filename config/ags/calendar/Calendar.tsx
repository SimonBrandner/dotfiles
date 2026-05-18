import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { getWindowName } from "../utils";
import { onCleanup } from "gnim";

export const Calendar = ({ monitor }: { monitor: Gdk.Monitor }) => (
	<window
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("calendar", monitor)}
		anchor={Astal.WindowAnchor.TOP}
		visible={false}
		$={(self) => onCleanup(() => self.destroy())}
	>
		<Gtk.Calendar class="CalendarWindow" />
	</window>
);
