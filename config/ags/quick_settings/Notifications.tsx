import Notifd from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "ags";
import { OverviewToggle } from "./common/OverviewToggle";
import GObject from "ags/gobject";
import { SCROLL_HEIGHT, set_QUICK_SETTINGS_PAGE } from "./QuickSettings";
import { NotificationList } from "../common/NotificationList";
import { HEADER_BUTTONS_SPACING } from "../bar/QuickSettings";

const notifd = Notifd.get_default();

export const NotificationOverviewToggle = () =>
	OverviewToggle({
		active: createBinding(notifd, "dontDisturb"),
		label: "Do not disturb",
		indicator: NotificationIndicator(),
		on_clicked: () => {
			notifd.set_dont_disturb(!notifd.dontDisturb);
		},
		on_expand_clicked: () => {
			set_QUICK_SETTINGS_PAGE("notifications");
		},
	});

export const NotificationIndicator = () => (
	<Gtk.Image
		class={createBinding(notifd, "notifications").as((notifications) =>
			notifications.length > 0 ? "Indicator Active" : "Indicator"
		)}
		iconName={createBinding(notifd, "dontDisturb").as((dontDisturb) =>
			dontDisturb
				? "notifications-disabled-symbolic"
				: "notifications-applet-symbolic"
		)}
	/>
);

export const NotificationsPage = () => (
	<box $type="named" name="notifications_page" class="Page NotificationPage">
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box class="PageHeader">
				<label class="Label" label="Notifications" />
				<box hexpand />
				<box spacing={HEADER_BUTTONS_SPACING}>
					<button
						class="IconButton"
						onClicked={() => {
							notifd.notifications.forEach((n) => n.dismiss());
						}}
					>
						<Gtk.Image iconName="user-trash-symbolic" />
					</button>
					<switch
						$={(self) => {
							notifd.bind_property(
								"dont-disturb",
								self,
								"active",
								GObject.BindingFlags.BIDIRECTIONAL |
									GObject.BindingFlags.INVERT_BOOLEAN |
									GObject.BindingFlags.SYNC_CREATE
							);
						}}
						class={createBinding(notifd, "dontDisturb").as((dnd) =>
							!dnd ? "active" : ""
						)}
					/>
				</box>
			</box>
			<scrolledwindow
				propagateNaturalHeight
				maxContentHeight={SCROLL_HEIGHT}
				vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
				hscrollbarPolicy={Gtk.PolicyType.NEVER}
			>
				<NotificationList monitor={null} />
			</scrolledwindow>
		</box>
	</box>
);
