const notifications = await Service.import("notifications");

const DoNotDisturb = () =>
	Widget.Button({
		on_clicked: (self) => {
			notifications.dnd = !notifications.dnd;
		},
		label: notifications
			.bind("dnd")
			.as((dnd) => (dnd ? "Do disturb" : "Do not disturb")),
	});

export const Overview = () =>
	Widget.Box({
		children: [DoNotDisturb()],
	});
