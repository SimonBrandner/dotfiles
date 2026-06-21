import { createBinding, For } from "ags";
import { Notification } from "./Notification";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { Gdk, Gtk } from "ags/gtk4";

const notifd = AstalNotifd.get_default();

type NotificationListProps = { monitor: Gdk.Monitor | null };

export const NotificationList = ({ monitor }: NotificationListProps) => {
	return (
		<box class="Notifications" vexpand orientation={Gtk.Orientation.VERTICAL}>
			<For each={createBinding(notifd, "notifications")}>
				{(notification: AstalNotifd.Notification) => (
					<Notification notification={notification} monitor={monitor} />
				)}
			</For>
		</box>
	);
};
