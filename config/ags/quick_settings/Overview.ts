import { Variable } from "types/variable";
import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { NotificationOverviewToggle } from "./Notifications";
import { SectionName } from "quick_settings/QuickSettings";
import { VolumeSlider } from "quick_settings/Audio";

const SPACING = 8;

const AVATAR = `/var/lib/AccountsService/icons/${Utils.USER}`;
const AVATAR_CSS = `background-image: url("${AVATAR}");`;

const Volume = (current_page_name: Variable<SectionName>) =>
	Widget.Box({
		class_name: "Volume",
		children: [
			VolumeSlider("speaker"),
			Widget.Button({
				on_clicked: () => {
					current_page_name.value = "audio";
				},
				class_name: "ExpandButton",
				hpack: "end",
				vpack: "center",
				expand: false,
				child: Widget.Icon({
					class_name: "Icon",
					icon: "pan-end-symbolic",
				}),
			}),
		],
	});

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
			Widget.Box({ hexpand: true }),
			Widget.Box({
				class_name: "PowerMenu",
				children: [
					Widget.Button({
						class_name: "PowerButton",
						child: Widget.Icon({
							class_name: "Icon",
							icon: "system-log-out-symbolic",
						}),
						on_clicked: () => Utils.exec("hyprctl dispatch exit"),
					}),
					Widget.Button({
						class_name: "PowerButton",
						child: Widget.Icon({
							class_name: "Icon",
							icon: "system-restart-symbolic",
						}),
						on_clicked: () => Utils.exec("systemctl reboot"),
					}),
					Widget.Button({
						class_name: "PowerButton",
						child: Widget.Icon({
							class_name: "Icon",
							icon: "system-shutdown-symbolic",
						}),
						on_clicked: () => Utils.exec("systemctl poweroff"),
					}),
				],
			}),
		],
	});

interface OverviewPageProps {
	current_page_name: Variable<SectionName>;
}
export const OverviewPage = ({ current_page_name }: OverviewPageProps) =>
	Widget.Box({
		class_names: ["Page", "OverviewPage"],
		vertical: true,
		children: [
			PageHeader(),
			ButtonGrid({ current_page_name }),
			Volume(current_page_name),
		],
	});

export const OverviewIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "emblem-system-symbolic",
	});
