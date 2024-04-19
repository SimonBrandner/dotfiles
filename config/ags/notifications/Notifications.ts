const notifications = await Service.import("notifications");

import { Notification } from "./Notification";

export const Notifications = () => {
	const notification_list = Widget.Box({
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
			"dismissed",
		);

	return Widget.Window({
		name: `notifications`,
		anchor: ["top", "right"],
		child: Widget.Box({
			class_name: "Notifications",
			child: notification_list,
		}),
	});
};
