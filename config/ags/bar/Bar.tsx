import { Astal, Gdk } from "ags/gtk3";
import app from "ags/gtk3/app";
import Gtk from "gi://Gtk?version=3.0";
import { getWindowName } from "../utils";
import { BarClock } from "./Clock";
import { QuickSettings } from "./QuickSettings";
import { SystemTray } from "./Tray";
import { Workspaces } from "./Workspaces";

const Section = (props) => {
	let position: "Left" | "Center" | "Right" | "" = "";
	if (props.halign == Gtk.Align.START) {
		position = "Left";
	} else if (props.halign == Gtk.Align.CENTER) {
		position = "Center";
	} else if (props.halign == Gtk.Align.END) {
		position = "Right";
	}

	return (
		<box
			hexpand={false}
			vexpand={true}
			valign={Gtk.Align.FILL}
			spacing={10}
			class={`Section ${position}`}
			{...props}
		/>
	);
};

export const Bar = ({ monitor }: { monitor: Gdk.Monitor }) => {
	return (
		<window
			gdkmonitor={monitor}
			application={app}
			name={getWindowName("bar", monitor)}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.RIGHT |
				Astal.WindowAnchor.LEFT
			}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
		>
			<centerbox class="Bar">
				<Section $type="start" halign={Gtk.Align.START} child={Workspaces()} />
				<Section
					$type="center"
					halign={Gtk.Align.CENTER}
					valign={Gtk.Align.CENTER}
					child={BarClock(monitor)}
				/>
				<Section
					$type="end"
					halign={Gtk.Align.END}
					children={[SystemTray(), QuickSettings(monitor)]}
				/>
			</centerbox>
		</window>
	);
};
