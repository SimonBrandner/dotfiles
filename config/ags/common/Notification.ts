import { bind, Variable } from "astal";
import { App, Widget } from "astal/gtk3";
import { Notification as NotifdNotification } from "gi://AstalNotifd";

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

const showImage = (notification: NotifdNotification): boolean => {
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

const AppIcon = ({ app_entry, app_icon }: NotifdNotification) => {
	let icon = "dialog-information-symbolic";

	if (app_entry && CUSTOM_ICONS[app_entry]) {
		icon = CUSTOM_ICONS[app_entry];
	} else if (Widget.Icon.lookup_icon(app_icon)) {
		icon = app_icon;
	} else if (app_entry && Widget.Icon.lookup_icon(app_entry)) {
		icon = app_entry;
	}

	return new Widget.Icon({
		vpack: "start",
		class_name: "AppIcon",
		icon,
	});
};

const CloseButton = (notification: NotifdNotification) =>
	new Widget.Button({
		class_name: "Icon Close",
		child: new Widget.Icon({
			icon: "window-close-symbolic",
		}),
		on_clicked: () => {
			notification.dismiss();
		},
	});

const NotificationSettingsButton = (inQuickSettings: boolean) => {
	const visible = Variable(!inQuickSettings);
	return new Widget.Button({
		class_name: "Icon Settings",
		visible: bind(visible, "value"),
		child: new Widget.Icon({
			icon: "emblem-system-symbolic",
		}),
		on_clicked: () => {
			QUICK_SETTINGS_PAGE.set("notifications");
			App.get_window(
				getWindowName("quick_settings", getPrimaryMonitor())
			).set_visible(true);
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

const Actions = (notification: NotifdNotification) =>
	new Widget.Box({
		class_name: "Actions",
		children: notification.actions.map(
			({ id, label }: { id; label: string }) =>
				new Widget.Button({
					class_name: "ActionButton",
					hexpand: true,
					child: new Widget.Label({ label }),
					on_clicked: () => {
						notification.invoke(id);
						notification.dismiss();
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

const Image = (notification: NotifdNotification) => {
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
	notification: NotifdNotification,
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
		class_name: `Notification ${notification.urgency}`,
		vertical: true,
		attribute: { id: notification.id },
		children: [titleBar, content, actions],
	});
};
