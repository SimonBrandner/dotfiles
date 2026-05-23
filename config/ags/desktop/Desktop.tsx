import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { getWallpaperPath, getWindowName } from "../utils";
import Gio from "gi://Gio?version=2.0";
import { onCleanup } from "gnim";

export const Desktop = ({ monitor }: { monitor: Gdk.Monitor }) => (
	<window
		visible={true}
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("desktop", monitor)}
		layer={Astal.Layer.BACKGROUND}
		exclusivity={Astal.Exclusivity.IGNORE}
		anchor={
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT |
			Astal.WindowAnchor.BOTTOM
		}
		$={(self) => onCleanup(() => self.destroy())}
	>
		<Gtk.Picture
			contentFit={Gtk.ContentFit.COVER}
			vexpand
			hexpand
			file={Gio.file_new_for_path(getWallpaperPath())}
		/>
	</window>
);
