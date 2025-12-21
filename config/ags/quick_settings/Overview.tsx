import { createBinding, createState, With } from "ags";
import { exec } from "ags/process";
import Gtk from "gi://Gtk?version=3.0";
import Wp from "gi://AstalWp";
import Mpris from "gi://AstalMpris";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { NotificationOverviewToggle } from "./Notifications";
import { VolumeSlider } from "./Audio";
import { Player } from "./common/Player";
import { set_QUICK_SETTINGS_PAGE } from "./QuickSettings";

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

const Media = ({ current_page_name }: any) => {
	const [currentPlayer, setCurrentPlayer] = createState<Mpris.Player | null>(
		getCurrentPlayer()
	);

	const onPlayersChanged = () => {
		setCurrentPlayer(getCurrentPlayer());
	};

	mpris.connect("player-added", onPlayersChanged);
	mpris.connect("player-closed", onPlayersChanged);

	return (
		<box>
			<With value={currentPlayer}>
				{(player) => player && Player(player, current_page_name)}
			</With>
		</box>
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
			expand={false}
		>
			<icon class="Icon" icon="pan-end-symbolic" />
		</button>
	</box>
);

interface ButtonGridProps {
	current_page_name: any;
}

const ButtonGrid = ({ current_page_name }: ButtonGridProps) => (
	<box orientation={Gtk.Orientation.VERTICAL} spacing={SPACING}>
		<box spacing={SPACING} homogeneous={true}>
			<WifiOverviewToggle />
			<BluetoothOverviewToggle current_page_name={current_page_name} />
		</box>
		<box homogeneous>
			<NotificationOverviewToggle current_page_name={current_page_name} />
		</box>
	</box>
);

const PageHeader = () => (
	<box class="PageHeader">
		<label class="Label" label="Settings" />
		<box hexpand />
		<box class="PowerMenu">
			<button class="PowerButton" onClicked={() => exec("swaymsg exit")}>
				<icon class="Icon" icon="system-log-out-symbolic" />
			</button>
			<button class="PowerButton" onClicked={() => exec("systemctl reboot")}>
				<icon class="Icon" icon="system-restart-symbolic" />
			</button>
			<button class="PowerButton" onClicked={() => exec("systemctl poweroff")}>
				<icon class="Icon" icon="system-shutdown-symbolic" />
			</button>
		</box>
	</box>
);

interface OverviewPageProps {
	current_page_name: any;
}

export const OverviewPage = ({ current_page_name }: OverviewPageProps) => (
	<box
		$type="named"
		name="overview_page"
		class="Page OverviewPage"
		orientation={Gtk.Orientation.VERTICAL}
	>
		<PageHeader />
		<ButtonGrid current_page_name={current_page_name} />
		<Volume />
		<Media current_page_name={current_page_name} />
	</box>
);

export const OverviewIndicator = () => (
	<icon class="Indicator" icon="emblem-system-symbolic" />
);
