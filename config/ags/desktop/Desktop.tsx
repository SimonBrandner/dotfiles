import { Astal, Gdk } from "ags/gtk3";
import app from "ags/gtk3/app";

import { getWallpaperPath, getWindowName } from "../utils";

export const Desktop = ({ monitor }: { monitor: Gdk.Monitor }) => (
	<window
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("desktop", monitor)}
		class="Desktop"
		layer={Astal.Layer.BOTTOM}
		exclusivity={Astal.Exclusivity.IGNORE}
		anchor={
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT |
			Astal.WindowAnchor.BOTTOM
		}
		css={`
			background-image: url("${getWallpaperPath()}");
		`}
	/>
);
