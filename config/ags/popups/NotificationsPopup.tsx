import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Notifd from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=4.0";

import { Notification } from "../common/Notification";
import { getWindowName } from "../utils";
import { createBinding, For, onCleanup } from "gnim";

const notifd = Notifd.get_default();

type NotificationsPopupProps = {
	monitor: Gdk.Monitor;
};

export const NotificationsPopup = ({ monitor }: NotificationsPopupProps) => (
	<window
		gdkmonitor={monitor}
		application={app}
		name={getWindowName("notifications", monitor)}
		anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
		visible={createBinding(notifd, "dontDisturb")((v) => !v)}
		$={(self) => onCleanup(() => self.destroy())}
	>
		<box class="Notifications" vexpand orientation={Gtk.Orientation.VERTICAL}>
			<For each={createBinding(notifd, "notifications")}>
				{(notification) => Notification(notification)}
			</For>
		</box>
	</window>
);
