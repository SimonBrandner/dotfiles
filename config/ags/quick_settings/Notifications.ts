import { Variable } from "types/variable";
import { SectionName } from "quick_settings/QuickSettings";
import { OverviewToggle } from "quick_settings/common/OverviewToggle";
import { Notification } from "common/Notification";

const notifications = await Service.import("notifications");

interface NotificationOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}

export const NotificationOverviewToggle = ({
	current_page_name,
}: NotificationOverviewToggleProps) =>
	OverviewToggle({
		connection: [notifications, () => !notifications.dnd],
		label: notifications.bind("dnd").as((d) => {
			return d ? "Silent" : "Noisy";
		}),
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
		class_name: "Page",
		child: Widget.Scrollable({
			hscroll: "never",
			child: Widget.Box({
				vertical: true,
				children: notifications.notifications.map((n) => Notification(n)),
			})
				.hook(
					notifications,
					(self, id) => {
						const notification = notifications.getNotification(id);
						if (!notification) return;
						self.children = [Notification(notification), ...self.children];
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
	});
