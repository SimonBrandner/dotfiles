import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Notifd from "gi://AstalNotifd";
import { getWindowName } from "../utils";
import { createBinding, onCleanup } from "gnim";
import { NotificationList } from "../common/NotificationList";

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
		<NotificationList monitor={monitor} />
	</window>
);
