import Notifd from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=3.0";
import { createBinding } from "ags";

import { OverviewToggle } from "./common/OverviewToggle";
import { Notification } from "../common/Notification";
import GObject from "ags/gobject";
import { set_QUICK_SETTINGS_PAGE } from "./QuickSettings";

const notifd = Notifd.get_default();

interface NotificationOverviewToggleProps {
	current_page_name: any; // SectionName
}

export const NotificationOverviewToggle = ({
	current_page_name,
}: NotificationOverviewToggleProps) =>
	OverviewToggle({
		active: createBinding(notifd, "dont-disturb"),
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
	<icon
		class={createBinding(notifd, "notifications").as((notifications) =>
			notifications.length > 0 ? "Indicator Active" : "Indicator"
		)}
		icon={createBinding(notifd, "dontDisturb").as((dontDisturb) =>
			dontDisturb
				? "notifications-disabled-symbolic"
				: "notifications-applet-symbolic"
		)}
	/>
);

export const NotificationsPage = () => (
	<box name="notifications_page" class="Page NotificationPage">
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
					<icon icon="user-trash-symbolic" />
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
				<box
					orientation={Gtk.Orientation.VERTICAL}
					expand
					$={(self) => {
						notifd.connect("notified", (_, id) => {
							const notification = notifd.get_notification(id);
							if (!notification) return;
							if (self.children.find((child) => child.attribute.id === id))
								return;
							self.children = [
								Notification(notification, true),
								...self.children,
							];
						});
						notifd.connect("resolved", (self, id) => {
							// TODO
						});
					}}
				>
					{notifd.notifications.map((n) => Notification(n, true))}
				</box>
			</scrollable>
		</box>
	</box>
);
