import { createState } from "ags";
import app from "ags/gtk3/app";
import { Notification as NotifdNotification } from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=3.0";

import { set_QUICK_SETTINGS_PAGE } from "../quick_settings/QuickSettings";
import { doesFileExist, getPrimaryMonitor, getWindowName } from "../utils";
import Pango from "gi://Pango?version=1.0";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

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
	} else if (app_icon) {
		icon = app_icon;
	} else if (app_entry && app_entry) {
		icon = app_entry;
	}

	return <icon valign={Gtk.Align.START} class="AppIcon" icon={icon} />;
};

const CloseButton = ({
	notification,
}: {
	notification: NotifdNotification;
}) => (
	<button
		class="Icon Close"
		onClicked={() => {
			notification.dismiss();
		}}
	>
		<icon icon="window-close-symbolic" />
	</button>
);

const NotificationSettingsButton = ({
	inQuickSettings,
}: {
	inQuickSettings: boolean;
}) => {
	const [visible, _] = createState(!inQuickSettings);

	return (
		<button
			class="Icon Settings"
			visible={visible}
			onClicked={() => {
				set_QUICK_SETTINGS_PAGE("notifications");
				app
					.get_window(getWindowName("quick_settings", getPrimaryMonitor()))
					?.set_visible(true);
			}}
		>
			<icon icon="emblem-system-symbolic" />
		</button>
	);
};

const Title = ({ summary }: { summary: string }) => (
	<label
		class="Title"
		xalign={0}
		justify={Gtk.Justification.LEFT}
		hexpand
		max_width_chars={24}
		ellipsize={Pango.EllipsizeMode.END}
		wrap
		label={summary}
		use_markup
	/>
);

const Actions = ({ notification }: { notification: NotifdNotification }) => (
	<box class="Actions">
		{notification.actions.map(({ id, label }: AstalNotifd.Action) => (
			<button
				class="ActionButton"
				hexpand={true}
				onClicked={() => {
					notification.invoke(id);
					notification.dismiss();
				}}
			>
				<label label={label} />
			</button>
		))}
	</box>
);

const AppName = ({ name }: { name: string }) => (
	<label class="AppName" label={CUSTOM_NAME[name] ?? name} hexpand xalign={0} />
);

const Image = ({ notification }: { notification: NotifdNotification }) => {
	if (!showImage(notification)) return <box />;

	return (
		<box
			valign={Gtk.Align.START}
			class="Image"
			css={`
				background-image: url("${notification.image}");
			`}
		/>
	);
};

const Body = ({ text }: { text: string }) => (
	<label
		class="Body"
		use_markup
		justify={Gtk.Justification.LEFT}
		label={text}
		wrap
		xalign={0}
		ellipsize={Pango.EllipsizeMode.END}
		lines={2}
	/>
);

export const Notification = (
	notification: NotifdNotification,
	inQuickSettings: boolean = false
) => {
	const image = <Image notification={notification} />;
	const actions = <Actions notification={notification} />;

	const titleBar = (
		<box class="TopBar">
			<AppIcon notification={notification} />
			<AppName name={notification.app_name} />
			<NotificationSettingsButton inQuickSettings={inQuickSettings} />
			<CloseButton notification={notification} />
		</box>
	);

	const textContent = (
		<box class="TextContent" orientation={Gtk.Orientation.VERTICAL}>
			<Title summary={notification.summary} />
			<Body text={notification.body} />
		</box>
	);
	const content = (
		<box class="Content">{image ? [textContent, image] : [textContent]}</box>
	);

	return (
		<box
			class={`Notification ${notification.urgency}`}
			orientation={Gtk.Orientation.VERTICAL}
		>
			{titleBar} {content} {actions}
		</box>
	);
};
