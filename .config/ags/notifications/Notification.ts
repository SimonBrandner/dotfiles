const NotificationIcon = ({ app_entry, app_icon, image }) => {
	if (image) {
		return Widget.Box({
			css:
				`background-image: url("${image}");` +
				"background-size: contain;" +
				"background-repeat: no-repeat;" +
				"background-position: center;",
		});
	}

	let icon = "dialog-information-symbolic";
	if (Utils.lookUpIcon(app_icon)) icon = app_icon;

	if (app_entry && Utils.lookUpIcon(app_entry)) icon = app_entry;

	return Widget.Box({
		child: Widget.Icon(icon),
	});
};

export const Notification = (n) => {
	const icon = Widget.Box({
		vpack: "start",
		class_name: "Icon",
		child: NotificationIcon(n),
	});

	const title = Widget.Label({
		class_name: "Title",
		xalign: 0,
		justification: "left",
		hexpand: true,
		max_width_chars: 24,
		truncate: "end",
		wrap: true,
		label: n.summary,
		use_markup: true,
	});

	const body = Widget.Label({
		class_name: "Body",
		hexpand: true,
		use_markup: true,
		xalign: 0,
		justification: "left",
		label: n.body,
		wrap: true,
	});

	const actions = Widget.Box({
		class_name: "Actions",
		children: n.actions.map(({ id, label }) =>
			Widget.Button({
				class_name: "ActionButton",
				on_clicked: () => {
					n.invoke(id);
					n.dismiss();
				},
				hexpand: true,
				child: Widget.Label(label),
			})
		),
	});

	return Widget.EventBox(
		{
			attribute: { id: n.id },
			on_primary_click: n.dismiss,
		},
		Widget.Box(
			{
				class_names: ["Notification", n.urgency],
				vertical: true,
			},
			Widget.Box([icon, Widget.Box({ vertical: true }, title, body)]),
			actions
		)
	);
};
