import { Notification as Notif } from "types/service/notifications";
import { doesFileExist } from "utils";

const FILE_PROTOCOL_PREFIX = "file://";

const imageExists = (path?: string): boolean => {
	if (!path) return false;

	if (path.startsWith(FILE_PROTOCOL_PREFIX)) {
		console.log("Starts with");
		if (!doesFileExist(path.slice(FILE_PROTOCOL_PREFIX.length))) {
			return false;
		}
	} else {
		if (!doesFileExist(path)) return false;
	}

	return true;
};

const NotificationIcon = ({ app_entry, app_icon, image }: Notif) => {
	if (imageExists(image)) {
		return Widget.Box({
			vpack: "start",
			class_name: "Image",
			css: `background-image: url("${image}");`,
		});
	}

	let icon = "dialog-information-symbolic";
	if (Utils.lookUpIcon(app_icon)) icon = app_icon;

	if (app_entry && Utils.lookUpIcon(app_entry)) icon = app_entry;

	return Widget.Icon({
		vpack: "start",
		class_name: "Icon",
		icon,
	});
};

export const Notification = (notification: Notif) => {
	return Widget.Box({
		class_names: ["Nnixpkgs_5otification", notification.urgency],
		vertical: true,
		attribute: { id: notification.id },
		children: [
			Widget.Box({
				children: [
					NotificationIcon(notification),
					Widget.Box({
						class_name: "Content",
						vertical: true,
						children: [
							Widget.Box({
								children: [
									Widget.Label({
										class_name: "Title",
										xalign: 0,
										justification: "left",
										hexpand: true,
										max_width_chars: 24,
										truncate: "end",
										wrap: true,
										label: notification.summary,
										use_markup: true,
									}),
									Widget.Button({
										class_name: "Close",
										child: Widget.Icon({
											icon: "window-close-symbolic",
										}),
										on_clicked: () => {
											notification.close();
										},
									}),
								],
							}),
							Widget.Label({
								class_name: "Body",
								use_markup: true,
								justification: "left",
								label: notification.body,
								wrap: true,
								xalign: 0,
								truncate: "end",
								lines: 3,
							}),
						],
					}),
				],
			}),
			Widget.Box({
				class_name: "Actions",
				children: notification.actions.map(({ id, label }) =>
					Widget.Button({
						class_name: "ActionButton",
						hexpand: true,
						child: Widget.Label(label),
						on_clicked: () => {
							notification.invoke(id);
							notification.close();
						},
					}),
				),
			}),
		],
	});
};
