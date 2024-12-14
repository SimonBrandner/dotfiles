import { Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";

import { Notification } from "../common/Notification";
import { getWindowName } from "../utils";

export const NotificationsPopup = (monitor: Gdk.Monitor) => {
	const notification_list = Widget.Box({
		class_name: "Notifications",
		vexpand: true,
		vertical: true,
		children: Notifd.popups.map(Notification),
	})
		.hook(
			Notifd,
			(self, id) => {
				const notification = Notifd.getNotification(id);
				if (notification?.popup)
					self.children = [Notification(notification), ...self.children];
			},
			"notified"
		)
		.hook(
			Notifd,
			(self, id) => {
				self.children.find((n) => n.attribute.id === id)?.destroy();
			},
			"closed"
		);

	return Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("notifications"),
		anchor: ["top", "right"],
		child: notification_list,
	});
};
