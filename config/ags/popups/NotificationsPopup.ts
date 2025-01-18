import { Widget, App, Astal, Gdk } from "astal/gtk3";
import { bind } from "astal";
import Notifd from "gi://AstalNotifd";

import { Notification } from "../common/Notification";
import { getWindowName } from "../utils";

const notifications = Notifd.get_default();

export const NotificationsPopup = (monitor: Gdk.Monitor) => {
	const notification_list = new Widget.Box({
		class_name: "Notifications",
		vexpand: true,
		vertical: true,
		children: notifications.get_notifications().map(Notification),
	})
		.hook(notifications, "notified", (self, id) => {
			if (notifications.dontDisturb) return;
			const notification = notifications.get_notification(id);
			if (!notification) return;
			self.children = [Notification(notification), ...self.children];
		})
		.hook(notifications, "resolved", (self, id) => {
			self.children.find((n) => n.attribute.id === id)?.destroy();
		});

	return new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("notifications"),
		anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
		child: notification_list,
	});
};
