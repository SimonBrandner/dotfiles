import { createBinding, With } from "ags";
import { Notification } from "./Notification";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { Gdk, Gtk } from "ags/gtk4";

const MAX_NOTIFICATION_COUNT = 300;

const notifd = AstalNotifd.get_default();

type NotificationListProps = { monitor: Gdk.Monitor | null };

export const NotificationList = ({ monitor }: NotificationListProps) => {
	return (
		<With value={createBinding(notifd, "notifications")}>
			{(notifications: Array<AstalNotifd.Notification>) =>
				notifications.length > MAX_NOTIFICATION_COUNT ? (
					<label label="To many notifications to display. We would get Error 24 (Too many open files)." />
				) : (
					<box
						hexpand
						vexpand
						class="Notifications"
						orientation={Gtk.Orientation.VERTICAL}
					>
						{notifications.map((notification: AstalNotifd.Notification) => (
							<Notification notification={notification} monitor={monitor} />
						))}
					</box>
				)
			}
		</With>
	);
};
