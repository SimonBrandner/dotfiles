import { Variable } from "./types/variable";
import Notifd from "gi://AstalNotifd";
import { Widget } from "astal/gtk3";

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
		connection: [notifd, () => notifd.dnd],
		label: "Do not disturb",
		indicator: NotificationIndicator(),
		on_clicked: () => {
			notifd.dnd = !notifd.dnd;
		},
		on_expand_clicked: () => {
			current_page_name.set("notifications");
		},
	});

export const NotificationIndicator = () =>
	new Widget.Icon({ class_name: "Indicator" }).hook(notifd, (self) => {
		self.icon = notifd.dnd
			? "notifications-disabled-symbolic"
			: "notifications-applet-symbolic";
		self.toggleClassName("Active", notifd.notifications.length > 0);
	});

export const NotificationsPage = () =>
	new Widget.Box({
		name: "notifications_page",
		class_names: ["Page", "NotificationPage"],
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
								icon: "trash",
							}),
							on_clicked: () => {
								notifd.notifications.forEach((n) => n.close());
							},
						}),
						new Widget.Box({
							child: new Widget.Switch({})
								//.on("notify::active", (self) => (notifd.dnd = !self.active))
								.hook(notifd, (self) => {
									const active = !notifd.dnd;
									self.active = active;
									self.toggleClassName("active", active);
								}),
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
