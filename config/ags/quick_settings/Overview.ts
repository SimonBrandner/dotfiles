import { Variable, exec, bind } from "astal";
import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import Mpris from "gi://AstalMpris";

import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { NotificationOverviewToggle } from "./Notifications";
import { SectionName } from "./QuickSettings";
import { VolumeSlider } from "./Audio";
import { Player } from "./common/Player";

const audio = Wp.get_default().audio;
const mpris = Mpris.get_default();

const SPACING = 8;

const Media = (current_page_name: Variable<SectionName>) => {
	const widget = new Widget.Box({});
	const onPlayersChanged = () => {
		const player =
			mpris.players.find((p) => p.play_back_status === "Playing") ??
			mpris.players.find((p) => p.play_back_status === "Paused") ??
			mpris.players[0];

		if (player) {
			widget.child = Player(player, current_page_name);
		} else {
			widget.child.destroy();
		}
	};

	return widget
		.hook(mpris, "player-closed", onPlayersChanged)
		.hook(mpris, "player-added", onPlayersChanged);
};

const Volume = (current_page_name: Variable<SectionName>) =>
	new Widget.Box({
		class_name: "Volume",
		children: [
			new Widget.Box({
				child: bind(audio, "default-speaker").as(
					(stream) => stream && VolumeSlider({ stream, type: "speaker" })
				),
			}),
			new Widget.Button({
				on_clicked: () => {
					current_page_name.set("audio");
				},
				class_name: "ExpandButton",
				hpack: "end",
				vpack: "center",
				expand: false,
				child: new Widget.Icon({
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
	new Widget.Box({
		vertical: true,
		spacing: SPACING,
		children: [
			new Widget.Box({
				spacing: SPACING,
				homogeneous: true,
				children: [
					WifiOverviewToggle({ current_page_name }),
					BluetoothOverviewToggle({ current_page_name }),
				],
			}),
			new Widget.Box({
				homogeneous: true,
				children: [NotificationOverviewToggle({ current_page_name })],
			}),
		],
	});

const PageHeader = () =>
	new Widget.Box({
		class_name: "PageHeader",
		children: [
			new Widget.Label({
				class_name: "Label",
				label: "Settings",
			}),
			new Widget.Box({ hexpand: true }),
			new Widget.Box({
				class_name: "PowerMenu",
				children: [
					new Widget.Button({
						class_name: "PowerButton",
						child: new Widget.Icon({
							class_name: "Icon",
							icon: "system-log-out-symbolic",
						}),
						on_clicked: () => exec("hyprctl dispatch exit"),
					}),
					new Widget.Button({
						class_name: "PowerButton",
						child: new Widget.Icon({
							class_name: "Icon",
							icon: "system-restart-symbolic",
						}),
						on_clicked: () => exec("systemctl reboot"),
					}),
					new Widget.Button({
						class_name: "PowerButton",
						child: new Widget.Icon({
							class_name: "Icon",
							icon: "system-shutdown-symbolic",
						}),
						on_clicked: () => exec("systemctl poweroff"),
					}),
				],
			}),
		],
	});

interface OverviewPageProps {
	current_page_name: Variable<SectionName>;
}
export const OverviewPage = ({ current_page_name }: OverviewPageProps) =>
	new Widget.Box({
		name: "overview_page",
		class_name: "Page OverviewPage",
		vertical: true,
		children: [
			PageHeader(),
			ButtonGrid({ current_page_name }),
			Volume(current_page_name),
			Media(current_page_name),
		],
	});

export const OverviewIndicator = () =>
	new Widget.Icon({
		class_name: "Indicator",
		icon: "emblem-system-symbolic",
	});
