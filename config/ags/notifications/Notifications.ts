const notifications = await Service.import("notifications");

import { Notification } from "./Notification";

export const Notifications = () => {
	const notification_list = Widget.Box({
		vertical: true,
		children: notifications.popups.map(Notification),
	});

	const onNotified = (_, id: number) => {
		const notification = notifications.getNotification(id);
		if (notification)
			notification_list.children = [
				Notification(notification),
				...notification_list.children,
			];
	};

	const onDismissed = (_, id: number) => {
		notification_list.children.find((n) => n.attribute.id === id)?.destroy();
	};

	notification_list
		.hook(notifications, onNotified, "notified")
		.hook(notifications, onDismissed, "dismissed");

	return Widget.Window({
		name: `notifications`,
		anchor: ["top", "right"],
		child: Widget.Box({
			class_name: "Notifications",
			vertical: true,
			child: notification_list,
		}),
	});
};
