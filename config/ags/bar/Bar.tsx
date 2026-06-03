import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import { getWindowName } from "../utils";
import { BarClock } from "./Clock";
import { QuickSettings } from "./QuickSettings";
import { SystemTray } from "./Tray";
import { Workspaces } from "./Workspaces";
import { onCleanup } from "gnim";
import { WorkspaceMinimap } from "./WorkspaceMinimap";

type SectionProps = {
	children: any;
	halign: Gtk.Align;
	$type: string;
};

const Section = ({ children, halign, $type }: SectionProps) => {
	let position: "Left" | "Center" | "Right" | "" = "";
	if (halign == Gtk.Align.START) {
		position = "Left";
	} else if (halign == Gtk.Align.CENTER) {
		position = "Center";
	} else if (halign == Gtk.Align.END) {
		position = "Right";
	}

	return (
		<box
			hexpand={false}
			vexpand
			valign={Gtk.Align.FILL}
			halign={halign}
			spacing={10}
			class={`Section ${position}`}
			$type={$type}
		>
			{children}
		</box>
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
			visible={true}
			$={(self) => onCleanup(() => self.destroy())}
		>
			<centerbox class="Bar">
				<Section $type="start" halign={Gtk.Align.START}>
					<Workspaces />
					<WorkspaceMinimap monitor={monitor} />
				</Section>
				<Section $type="center" halign={Gtk.Align.CENTER}>
					<BarClock monitor={monitor} />
				</Section>
				<Section $type="end" halign={Gtk.Align.END}>
					<SystemTray />
					<QuickSettings monitor={monitor} />
				</Section>
			</centerbox>
		</window>
	);
};
