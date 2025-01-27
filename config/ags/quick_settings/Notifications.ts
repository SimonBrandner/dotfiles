import { GObject, Variable } from "astal";
import Notifd from "gi://AstalNotifd";
import { Widget } from "astal/gtk3";
import { bind } from "astal";

import { SectionName } from "./QuickSettings";
import { OverviewToggle } from "./common/OverviewToggle";
import { Notification } from "../common/Notification";

const notifd = Notifd.get_default();

interface NotificationOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}

export const NotificationOverviewToggle = ({
	current_page_name,
}: NotificationOverviewToggleProps) =>
	OverviewToggle({
		active: bind(notifd, "dont-disturb"),
		label: "Do not disturb",
		indicator: NotificationIndicator(),
		on_clicked: () => {
			notifd.set_dont_disturb(!notifd.dontDisturb);
		},
		on_expand_clicked: () => {
			current_page_name.set("notifications");
		},
	});

export const NotificationIndicator = () =>
	new Widget.Icon({
		class_name: bind(notifd, "notifications").as((notifications) =>
			notifications.length > 0 ? "Indicator Active" : "Indicator"
		),
		icon: bind(notifd, "dont-disturb").as((dontDisturb) =>
			dontDisturb
				? "notifications-disabled-symbolic"
				: "notifications-applet-symbolic"
		),
	});

export const NotificationsPage = () =>
	new Widget.Box({
		name: "notifications_page",
		class_name: "Page NotificationPage",
		child: new Widget.Box({
			vertical: true,
			children: [
				new Widget.Box({
					class_name: "PageHeader",
					children: [
						new Widget.Label({
							class_name: "Label",
							label: "Notifications",
						}),
						new Widget.Box({ hexpand: true }),
						new Widget.Button({
							class_name: "Icon",
							child: new Widget.Icon({
								icon: "user-trash-symbolic",
							}),
							on_clicked: () => {
								notifd.notifications.forEach((n) => n.dismiss());
							},
						}),
						new Widget.Switch({
							setup: (self) => {
								notifd.bind_property(
									"dont-disturb",
									self,
									"active",
									GObject.BindingFlags.BIDIRECTIONAL |
										GObject.BindingFlags.INVERT_BOOLEAN |
										GObject.BindingFlags.SYNC_CREATE
								);
							},
							className: bind(notifd, "dont-disturb").as((dnd) =>
								!dnd ? "active" : ""
							),
						}),
					],
				}),
				new Widget.Scrollable({
					hscroll: "never",
					child: new Widget.Box({
						vertical: true,
						expand: true,
						children: notifd.notifications.map((n) => Notification(n, true)),
					})
						.hook(notifd, "notified", (self, id) => {
							const notification = notifd.get_notification(id);
							if (!notification) return;
							if (self.children.find((child) => child.attribute.id === id))
								return;
							self.children = [
								Notification(notification, true),
								...self.children,
							];
						})
						.hook(notifd, "resolved", (self, id) => {
							self.children.find((n) => n.attribute.id === id)?.destroy();
						}),
				}),
			],
		}),
	});
