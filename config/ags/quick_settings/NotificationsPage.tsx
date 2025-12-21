import GObject from "ags/gobject";
import { Gtk } from "ags/gtk3";
import Notifd from "gi://AstalNotifd";
import { createBinding, For } from "gnim";
import { Notification } from "../common/Notification";

const notifd = Notifd.get_default();

export const NotificationsPage = () => (
	<box $type="named" name="notifications_page" class="Page NotificationPage">
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box class="PageHeader">
				<label class="Label" label="Notifications" />
				<box hexpand />
				<button
					class="Icon"
					onClicked={() => {
						notifd.notifications.forEach((n) => n.dismiss());
					}}
				>
					<icon icon="user-trash-symbolic"></icon>
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
			<scrollable>
				<box orientation={Gtk.Orientation.VERTICAL} vexpand>
					<For each={createBinding(notifd, "notifications")}>
						{(notification) => Notification(notification, true)}
					</For>
				</box>
			</scrollable>
		</box>
	</box>
);
