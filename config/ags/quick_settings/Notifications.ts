const notifications = await Service.import("notifications");

export const DoNotDisturb = () =>
	Widget.Button({
		on_clicked: () => {
			notifications.dnd = !notifications.dnd;
		},
	}).hook(notifications, (self) => {
		self.label = notifications.dnd ? "Silent" : "Noisy";
	});
