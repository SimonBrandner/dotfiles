import { Variable } from "types/variable";
import { SectionName } from "quick_settings/QuickSettings";
import { OverviewToggle } from "quick_settings/common/OverviewToggle";

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
			: "notifications-symbolic";
		self.toggleClassName("Active", notifications.notifications.length > 0);
	});

export const NotificationsPage = () => Widget.Box({ class_name: "Page" });
