import { createBinding, createState, With } from "ags";
import { exec } from "ags/process";
import Gtk from "gi://Gtk?version=4.0";
import Wp from "gi://AstalWp";
import Mpris from "gi://AstalMpris";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { NotificationOverviewToggle } from "./Notifications";
import { VolumeSlider } from "./Audio";
import { Player } from "./common/Player";
import { set_QUICK_SETTINGS_PAGE } from "./QuickSettings";
import { HEADER_BUTTONS_SPACING } from "../bar/QuickSettings";

const audio = Wp.get_default().audio;
const mpris = Mpris.get_default();

const SPACING = 8;

const getCurrentPlayer = () => {
	return (
		mpris.players.find(
			(p) => p.playbackStatus === AstalMpris.PlaybackStatus.PLAYING
		) ??
		mpris.players.find(
			(p) => p.playbackStatus === AstalMpris.PlaybackStatus.PAUSED
		) ??
		mpris.players[0] ??
		null
	);
};

const Media = () => {
	const [currentPlayer, setCurrentPlayer] = createState<Mpris.Player | null>(
		getCurrentPlayer()
	);

	const onPlayersChanged = () => {
		setCurrentPlayer(getCurrentPlayer());
	};

	mpris.connect("player-added", onPlayersChanged);
	mpris.connect("player-closed", onPlayersChanged);

	return (
		<With value={currentPlayer}>
			{(player) => player && Player(player, true)}
		</With>
	);
};

const Volume = () => (
	<box class="Volume">
		<box>
			<With value={createBinding(audio, "defaultSpeaker")}>
				{(stream: Wp.Endpoint) =>
					stream && <VolumeSlider endpoint={stream} type="speaker" />
				}
			</With>
		</box>
		<button
			onClicked={() => set_QUICK_SETTINGS_PAGE("audio")}
			class="ExpandButton"
			halign={Gtk.Align.END}
			valign={Gtk.Align.CENTER}
		>
			<Gtk.Image class="Icon" iconName="pan-end-symbolic" />
		</button>
	</box>
);

const ButtonGrid = () => (
	<box orientation={Gtk.Orientation.VERTICAL} spacing={SPACING}>
		<box spacing={SPACING} homogeneous={true}>
			<WifiOverviewToggle />
			<BluetoothOverviewToggle />
		</box>
		<box homogeneous>
			<NotificationOverviewToggle />
		</box>
	</box>
);

const PageHeader = () => (
	<box class="PageHeader">
		<label class="Label" label="Settings" />
		<box hexpand />
		<box spacing={HEADER_BUTTONS_SPACING}>
			<button class="IconButton" onClicked={() => exec("swaymsg exit")}>
				<Gtk.Image class="Icon" iconName="system-log-out-symbolic" />
			</button>
			<button class="IconButton" onClicked={() => exec("systemctl reboot")}>
				<Gtk.Image class="Icon" iconName="system-restart-symbolic" />
			</button>
			<button class="IconButton" onClicked={() => exec("systemctl poweroff")}>
				<Gtk.Image class="Icon" iconName="system-shutdown-symbolic" />
			</button>
		</box>
	</box>
);

export const OverviewPage = () => (
	<box
		$type="named"
		name="overview_page"
		class="Page OverviewPage"
		orientation={Gtk.Orientation.VERTICAL}
	>
		<PageHeader />
		<ButtonGrid />
		<Volume />
		<Media />
	</box>
);

export const OverviewIndicator = () => (
	<Gtk.Image class="Indicator" iconName="emblem-system-symbolic" />
);
