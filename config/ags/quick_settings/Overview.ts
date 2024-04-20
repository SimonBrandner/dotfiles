import { Variable } from "types/variable";
import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { NotificationOverviewToggle } from "./Notifications";
import { SectionName } from "quick_settings/QuickSettings";

interface ButtonGridProps {
	current_page_name: Variable<SectionName>;
}
const ButtonGrid = ({ current_page_name }: ButtonGridProps) =>
	Widget.Box({
		vertical: true,
		children: [
			Widget.Box({
				homogeneous: true,
				children: [
					WifiOverviewToggle({ current_page_name }),
					BluetoothOverviewToggle({ current_page_name }),
				],
			}),
			Widget.Box({
				homogeneous: true,
				children: [NotificationOverviewToggle({ current_page_name })],
			}),
		],
	});

interface OverviewPageProps {
	current_page_name: Variable<SectionName>;
}
export const OverviewPage = ({ current_page_name }: OverviewPageProps) =>
	Widget.Box({
		class_name: "Page",
		vertical: true,
		children: [ButtonGrid({ current_page_name })],
	});

export const OverviewIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "open-menu",
	});
