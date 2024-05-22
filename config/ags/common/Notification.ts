import { QUICK_SETTINGS_PAGE } from "quick_settings/QuickSettings";
import { Notification as Notif } from "types/service/notifications";
import { doesFileExist, getPrimaryMonitor, getWindowName } from "utils";

const FILE_PROTOCOL_PREFIX = "file://";

type CustomIcons = "WebCord";
const CUSTOM_ICONS: Record<CustomIcons, string> = {
	WebCord: "discord",
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

	if (app_entry && CUSTOM_ICONS[app_entry as CustomIcons]) {
		icon = CUSTOM_ICONS[app_entry as CustomIcons];
	}
	if (Utils.lookUpIcon(app_icon)) icon = app_icon;
	if (app_entry && Utils.lookUpIcon(app_entry)) icon = app_entry;

	return Widget.Icon({
		vpack: "start",
		class_name: "AppIcon",
		icon,
	});
};

const CloseButton = (notification: Notif) =>
	Widget.Button({
		class_names: ["Icon", "Close"],
		child: Widget.Icon({
			icon: "window-close-symbolic",
		}),
		on_clicked: () => {
			notification.close();
		},
	});

const NotificationSettingsButton = (inQuickSettings: boolean) => {
	const visible = Variable(!inQuickSettings);
	return Widget.Button({
		class_names: ["Icon", "Settings"],
		visible: visible.bind(),
		child: Widget.Icon({
			icon: "emblem-system-symbolic",
		}),
		on_clicked: () => {
			QUICK_SETTINGS_PAGE.value = "notifications";
			App.openWindow(getWindowName("quick_settings", getPrimaryMonitor()));
		},
	});
};

const Title = (summary: string) =>
	Widget.Label({
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
	});

const AppName = (name: string) =>
	Widget.Label({
		class_name: "AppName",
		label: name,
		hexpand: true,
		xalign: 0,
	});

const Image = (notification: Notif) => {
	if (!showImage(notification)) return;

	return Widget.Box({
		vpack: "start",
		class_name: "Image",
		css: `background-image: url("${notification.image}");`,
	});
};

const Body = (text: string) =>
	Widget.Label({
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
	inQuickSettings: boolean = false,
) => {
	const image = Image(notification);
	const actions = Actions(notification);

	const titleBar = Widget.Box({
		class_name: "TopBar",
		children: [
			AppIcon(notification),
			AppName(notification.app_name),
			NotificationSettingsButton(inQuickSettings),
			CloseButton(notification),
		],
	});
	const textContent = Widget.Box({
		class_name: "TextContent",
		vertical: true,
		children: [Title(notification.summary), Body(notification.body)],
	});
	const content = Widget.Box({
		class_name: "Content",
		children: image ? [textContent, image] : [textContent],
	});

	return Widget.Box({
		class_names: ["Notification", notification.urgency],
		vertical: true,
		attribute: { id: notification.id },
		children: [titleBar, content, actions],
	});
};
