import { createState } from "ags";
import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import { set_QUICK_SETTINGS_PAGE } from "../quick_settings/QuickSettings";
import { doesFileExist, getIcon, getWindowName } from "../utils";
import Pango from "gi://Pango?version=1.0";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { Gdk } from "ags/gtk4";

const FILE_PROTOCOL_PREFIX = "file://";

const showImage = async (
	notification: AstalNotifd.Notification
): Promise<boolean> => {
	const { image, app_icon } = notification;

	if (!image) return false;
	if (app_icon === image) return false;

	if (image.startsWith(FILE_PROTOCOL_PREFIX)) {
		if (!(await doesFileExist(image.slice(FILE_PROTOCOL_PREFIX.length)))) {
			return false;
		}
	} else {
		if (!(await doesFileExist(image))) return false;
	}

	return true;
};

type AppIconProps = {
	notification: AstalNotifd.Notification;
};

const AppIcon = ({ notification: { appName, appIcon } }: AppIconProps) => (
	<Gtk.Image
		valign={Gtk.Align.START}
		class="AppIcon"
		iconName={getIcon([appIcon, appName])}
	/>
);

const CloseButton = ({
	notification,
}: {
	notification: AstalNotifd.Notification;
}) => (
	<button
		class="Icon Close"
		onClicked={() => {
			notification.dismiss();
		}}
	>
		<Gtk.Image iconName="window-close-symbolic" />
	</button>
);

type NotificationSettingsButtonProps = { monitor: Gdk.Monitor | null };

const NotificationSettingsButton = ({
	monitor,
}: NotificationSettingsButtonProps) => {
	const [visible, _] = createState(Boolean(monitor));

	return (
		<button
			class="Icon Settings"
			visible={visible}
			onClicked={() => {
				if (!monitor) return;
				set_QUICK_SETTINGS_PAGE("notifications");
				app
					.get_window(getWindowName("quick_settings", monitor))
					?.set_visible(true);
			}}
		>
			<Gtk.Image iconName="emblem-system-symbolic" />
		</button>
	);
};

const Title = ({ summary }: { summary: string }) => (
	<label
		hexpand
		use_markup
		class="Title"
		xalign={0}
		justify={Gtk.Justification.LEFT}
		ellipsize={Pango.EllipsizeMode.END}
		label={summary}
	/>
);

const Actions = ({
	notification,
}: {
	notification: AstalNotifd.Notification;
}) => (
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
	<label class="AppName" label={name} hexpand xalign={0} />
);

const Image = ({
	notification,
}: {
	notification: AstalNotifd.Notification;
}) => (
	<Gtk.Image
		class="Image"
		overflow={Gtk.Overflow.HIDDEN}
		valign={Gtk.Align.START}
		visible={false}
		file={notification.image}
		$={(self: Gtk.Image) =>
			showImage(notification).then((v) => (self.visible = v))
		}
	/>
);

const Body = ({ text }: { text: string }) => (
	<label
		hexpand
		useMarkup
		wrap
		class="Body"
		label={text}
		wrapMode={Pango.WrapMode.WORD}
		justify={Gtk.Justification.LEFT}
		ellipsize={Pango.EllipsizeMode.END}
		xalign={0}
		lines={3}
	/>
);

type NotificationProps = {
	notification: AstalNotifd.Notification;
	monitor: Gdk.Monitor | null;
};

export const Notification = ({ notification, monitor }: NotificationProps) => {
	const image = <Image notification={notification} />;
	const actions = <Actions notification={notification} />;

	const titleBar = (
		<box class="TopBar">
			<AppIcon notification={notification} />
			<AppName name={notification.appName} />
			<NotificationSettingsButton monitor={monitor} />
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
		<box class="Content">
			{textContent}
			{image}
		</box>
	);

	return (
		<box
			class={`Notification ${notification.urgency}`}
			orientation={Gtk.Orientation.VERTICAL}
		>
			{titleBar}
			{content}
			{actions}
		</box>
	);
};
