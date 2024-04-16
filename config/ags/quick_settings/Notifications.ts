const notifications = await Service.import("notifications");

export const DoNotDisturb = () =>
	Widget.Button({
		on_clicked: () => {
			notifications.dnd = !notifications.dnd;
		},
	}).hook(notifications, (self) => {
		self.label = notifications.dnd ? "Silent" : "Noisy";
	});

export const NotificationIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(notifications, (self) => {
		self.icon = notifications.dnd
			? "notifications-disabled-symbolic"
			: "notifications-symbolic";
		self.toggleClassName("Active", notifications.notifications.length > 0);
	});
