import { Variable } from "types/variable";
import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { NotificationOverviewToggle } from "./Notifications";
import { SectionName } from "quick_settings/QuickSettings";

const SPACING = 8;

const AVATAR = `/var/lib/AccountsService/icons/${Utils.USER}`;
const AVATAR_CSS = `background-image: url("${AVATAR}");`;

interface ButtonGridProps {
	current_page_name: Variable<SectionName>;
}
const ButtonGrid = ({ current_page_name }: ButtonGridProps) =>
	Widget.Box({
		vertical: true,
		spacing: SPACING,
		children: [
			Widget.Box({
				spacing: SPACING,
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

const PageHeader = () =>
	Widget.Box({
		class_name: "PageHeader",
		children: [
			Widget.Box({
				class_name: "Avatar",
				css: AVATAR_CSS,
			}),
			Widget.Label({
				class_name: "Username",
				vpack: "center",
				label: Utils.USER,
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
		children: [PageHeader(), ButtonGrid({ current_page_name })],
	});

export const OverviewIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "emblem-system-symbolic",
	});
