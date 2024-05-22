import { Variable } from "types/variable";
import { SectionName } from "quick_settings/QuickSettings";
import { OverviewToggle } from "quick_settings/common/OverviewToggle";
import { Notification } from "common/Notification";
import { PageHeader } from "quick_settings/common/PageHeader";

const notifications = await Service.import("notifications");

interface NotificationOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}

export const NotificationOverviewToggle = ({
	current_page_name,
}: NotificationOverviewToggleProps) =>
	OverviewToggle({
		connection: [notifications, () => notifications.dnd],
		label: "Do not disturb",
		indicator: NotificationIndicator(),
		on_clicked: () => {
			notifications.dnd = !notifications.dnd;
		},
		on_expand_clicked: () => {
			current_page_name.value = "notifications";
		},
	});

export const NotificationIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(notifications, (self) => {
		self.icon = notifications.dnd
			? "notifications-disabled-symbolic"
			: "notifications-applet-symbolic";
		self.toggleClassName("Active", notifications.notifications.length > 0);
	});

export const NotificationsPage = () =>
	Widget.Box({
		class_names: ["Page", "NotificationPage"],
		child: Widget.Box({
			vertical: true,
			children: [
				Widget.Box({
					class_name: "PageHeader",
					children: [
						Widget.Label({
							class_name: "Label",
							label: "Notifications",
						}),
						Widget.Box({ hexpand: true }),
						Widget.Button({
							class_name: "Icon",
							child: Widget.Icon({
								icon: "trash",
							}),
							on_clicked: () => {
								notifications.notifications.forEach((n) => n.close());
							},
						}),
						Widget.Box({
							child: Widget.Switch()
								.on(
									"notify::active",
									(self) => (notifications.dnd = !self.active),
								)
								.hook(notifications, (self) => {
									const active = !notifications.dnd;
									self.active = active;
									self.toggleClassName("active", active);
								}),
						}),
					],
				}),
				Widget.Scrollable({
					hscroll: "never",
					child: Widget.Box({
						vertical: true,
						expand: true,
						children: notifications.notifications.map((n) =>
							Notification(n, true),
						),
					})
						.hook(
							notifications,
							(self, id) => {
								const notification = notifications.getNotification(id);
								if (!notification) return;
								self.children = [
									Notification(notification, true),
									...self.children,
								];
							},
							"notified",
						)
						.hook(
							notifications,
							(self, id) => {
								self.children.find((n) => n.attribute.id === id)?.destroy();
							},
							"closed",
						),
				}),
			],
		}),
	});
