import { Notification } from "common/Notification";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { getWindowName } from "utils";

const notifications = await Service.import("notifications");

export const NotificationsPopup = (monitor: Gdk.Monitor) => {
	const notification_list = Widget.Box({
		class_name: "Notifications",
		vexpand: true,
		vertical: true,
		children: notifications.popups.map(Notification),
	})
		.hook(
			notifications,
			(self, id) => {
				const notification = notifications.getNotification(id);
				if (notification?.popup)
					self.children = [Notification(notification), ...self.children];
			},
			"notified",
		)
		.hook(
			notifications,
			(self, id) => {
				self.children.find((n) => n.attribute.id === id)?.destroy();
			},
			"closed",
		);

	return Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("notifications"),
		anchor: ["top", "right"],
		vexpand: true,
		child: notification_list,
	});
};
