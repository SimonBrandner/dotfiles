import { Astal, Gdk } from "ags/gtk3";
import app from "ags/gtk3/app";
import Notifd from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=3.0";

import { Notification } from "../common/Notification";
import { getWindowName } from "../utils";
import { createBinding, For } from "gnim";

const notifd = Notifd.get_default();

export const NotificationsPopup = (monitor: Gdk.Monitor) => (
	<window
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("notifications")}
		anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
		visible={createBinding(notifd, "dontDisturb")((v) => !v)}
	>
		<box
			class="Notifications"
			vexpand={true}
			orientation={Gtk.Orientation.VERTICAL}
		>
			<For each={createBinding(notifd, "notifications")}>
				{(notification) => Notification(notification)}
			</For>
		</box>
	</window>
);
