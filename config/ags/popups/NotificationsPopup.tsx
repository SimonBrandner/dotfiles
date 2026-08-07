import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Notifd from "gi://AstalNotifd";
import { getWindowName } from "../utils";
import { createBinding, createComputed, onCleanup } from "gnim";
import { NotificationList } from "../common/NotificationList";
import Adw from "gi://Adw?version=1";

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
		visible={createComputed(
			() =>
				!createBinding(notifd, "dontDisturb")() &&
				createBinding(notifd, "notifications")().length > 0
		)}
		$={(self) => onCleanup(() => self.destroy())}
	>
		<Adw.Clamp maximumSize={300} widthRequest={300}>
			<NotificationList monitor={monitor} />
		</Adw.Clamp>
	</window>
);
