import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { getWindowName, setupWindow } from "../utils";

export const Calendar = ({ monitor }: { monitor: Gdk.Monitor }) => (
	<window
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("calendar", monitor)}
		anchor={Astal.WindowAnchor.TOP}
		visible={false}
		$={setupWindow}
	>
		<box class="Calendar">
			<Gtk.Calendar />
		</box>
	</window>
);
