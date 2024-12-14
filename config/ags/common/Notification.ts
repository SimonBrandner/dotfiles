import { Variable } from "astal";
import { Widget } from "astal/gtk3";
import { Notification as Notif } from "./types/service/notifications";

import { QUICK_SETTINGS_PAGE } from "../quick_settings/QuickSettings";
import { doesFileExist, getPrimaryMonitor, getWindowName } from "../utils";

const FILE_PROTOCOL_PREFIX = "file://";

const CUSTOM_ICONS: Record<string, string> = {
	WebCord: "discord",
	vesktop: "discord",
};
const CUSTOM_NAME: Record<string, string> = {
	vesktop: "Discord",
	WebCord: "Discord",
};

const showImage = (notification: Notif): boolean => {
	const { image, app_icon } = notification;

	if (!image) return false;
	if (app_icon === image) return false;

	if (image.startsWith(FILE_PROTOCOL_PREFIX)) {
		if (!doesFileExist(image.slice(FILE_PROTOCOL_PREFIX.length))) {
			return false;
		}
	} else {
		if (!doesFileExist(image)) return false;
	}

	return true;
};

const AppIcon = ({ app_entry, app_icon }: Notif) => {
	let icon = "dialog-information-symbolic";

	if (app_entry && CUSTOM_ICONS[app_entry]) {
		icon = CUSTOM_ICONS[app_entry];
	} else if (lookUpIcon(app_icon)) {
		icon = app_icon;
	} else if (app_entry && lookUpIcon(app_entry)) {
		icon = app_entry;
	}

	return new Widget.Icon({
		vpack: "start",
		class_name: "AppIcon",
		icon,
	});
};

const CloseButton = (notification: Notif) =>
	new Widget.Button({
		class_names: ["Icon", "Close"],
		child: new Widget.Icon({
			icon: "window-close-symbolic",
		}),
		on_clicked: () => {
			notification.close();
		},
	});

const NotificationSettingsButton = (inQuickSettings: boolean) => {
	const visible = Variable(!inQuickSettings);
	return new Widget.Button({
		class_names: ["Icon", "Settings"],
		visible: visible.bind(),
		child: new Widget.Icon({
			icon: "emblem-system-symbolic",
		}),
		on_clicked: () => {
			QUICK_SETTINGS_PAGE.value = "notifications";
			App.openWindow(getWindowName("quick_settings", getPrimaryMonitor()));
		},
	});
};

const Title = (summary: string) =>
	new Widget.Label({
		class_name: "Title",
		xalign: 0,
		justification: "left",
		hexpand: true,
		max_width_chars: 24,
		truncate: "end",
		wrap: true,
		label: summary,
		use_markup: true,
	});

const Actions = (notification: Notif) =>
	new Widget.Box({
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
			})
		),
	});

const AppName = (name: string) =>
	new Widget.Label({
		class_name: "AppName",
		label: CUSTOM_NAME[name] ?? name,
		hexpand: true,
		xalign: 0,
	});

const Image = (notification: Notif) => {
	if (!showImage(notification)) return;

	return new Widget.Box({
		vpack: "start",
		class_name: "Image",
		css: `background-image: url("${notification.image}");`,
	});
};

const Body = (text: string) =>
	new Widget.Label({
		class_name: "Body",
		use_markup: true,
		justification: "left",
		label: text,
		wrap: true,
		xalign: 0,
		truncate: "end",
		lines: 2,
	});

export const Notification = (
	notification: Notif,
	inQuickSettings: boolean = false
) => {
	const image = Image(notification);
	const actions = Actions(notification);

	const titleBar = new Widget.Box({
		class_name: "TopBar",
		children: [
			AppIcon(notification),
			AppName(notification.app_name),
			NotificationSettingsButton(inQuickSettings),
			CloseButton(notification),
		],
	});
	const textContent = new Widget.Box({
		class_name: "TextContent",
		vertical: true,
		children: [Title(notification.summary), Body(notification.body)],
	});
	const content = new Widget.Box({
		class_name: "Content",
		children: image ? [textContent, image] : [textContent],
	});

	return new Widget.Box({
		class_names: ["Notification", notification.urgency],
		vertical: true,
		attribute: { id: notification.id },
		children: [titleBar, content, actions],
	});
};
