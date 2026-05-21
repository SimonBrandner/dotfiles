import GObject from "ags/gobject";
import { Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import { createBinding, For } from "gnim";
import { Notification } from "../common/Notification";
import { SCROLL_HEIGHT } from "./QuickSettings";
import { HEADER_BUTTONS_SPACING } from "../bar/QuickSettings";

const notifd = Notifd.get_default();

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
				<box orientation={Gtk.Orientation.VERTICAL} vexpand>
					<For each={createBinding(notifd, "notifications")}>
						{(notification) => Notification(notification, true)}
					</For>
				</box>
			</scrolledwindow>
		</box>
	</box>
);
