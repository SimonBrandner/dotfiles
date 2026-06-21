import { createBinding, With } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import Mpris from "gi://AstalMpris";
import { set_QUICK_SETTINGS_PAGE } from "../QuickSettings";
import Pango from "gi://Pango?version=1.0";
import { getIcon } from "../../utils";

function formatTime(seconds: number) {
	const hours = Math.floor(seconds / (60 * 60));
	seconds = Math.floor(seconds % (60 * 60));
	const minutes = Math.floor(seconds / 60);
	seconds = Math.floor(seconds % 60);
	const seconds0 = seconds < 10 ? "0" : "";

	let text = "";
	if (hours !== 0) {
		text += `${hours}:`;
	}
	text += `${minutes}:${seconds0}${seconds}`;
	return text;
}

export const Player = (player: Mpris.Player, overview_page: boolean) => (
	<box
		class="Player"
		orientation={Gtk.Orientation.VERTICAL}
		visible={createBinding(player, "length").as((l) => Boolean(l))}
	>
		<box class="TopBar">
			<Gtk.Image
				class="Icon"
				halign={Gtk.Align.START}
				iconName={getIcon([player.entry])}
			/>
			<label
				class="AppName"
				halign={Gtk.Align.START}
				label={player.identity}
				hexpand
				xalign={0}
				ellipsize={Pango.EllipsizeMode.END}
			/>
			{overview_page ? (
				<button
					onClicked={() => {
						set_QUICK_SETTINGS_PAGE("media");
					}}
					class="Button ExpandButton"
				>
					<Gtk.Image class="Icon" iconName="pan-end-symbolic" />
				</button>
			) : (
				<button
					onClicked={() => {
						player.quit();
					}}
					class="Button CloseButton"
				>
					<Gtk.Image class="Icon" iconName="window-close-symbolic" />
				</button>
			)}
		</box>
		<box class="Content">
			<box orientation={Gtk.Orientation.VERTICAL}>
				<Gtk.Inscription
					class="Title"
					textOverflow={Gtk.InscriptionOverflow.ELLIPSIZE_END}
					xalign={0}
					text={createBinding(player, "title")}
				/>
				<Gtk.Inscription
					textOverflow={Gtk.InscriptionOverflow.ELLIPSIZE_END}
					xalign={0}
					text={createBinding(
						player,
						"artist"
					)((artist) => (artist ? artist : ""))}
				/>
				<slider
					class="Slider"
					draw_value={false}
					value={createBinding(
						player,
						"position"
					)((position) => {
						const value = position / player.length;
						if (!isFinite(value) || isNaN(value)) {
							return 0;
						}
						return value;
					})}
				/>
				<box>
					<label
						xalign={0}
						label={createBinding(player, "position").as((position) =>
							formatTime(position)
						)}
					/>
					<box hexpand>
						<button
							onClicked={() => player.previous()}
							class="PlayerButton"
							sensitive={createBinding(player, "canGoPrevious")}
						>
							<Gtk.Image class="Icon" iconName="media-skip-backward-symbolic" />
						</button>
						<button
							onClicked={() => player.play_pause()}
							class="PlayerButton"
							sensitive={createBinding(player, "canPlay")}
						>
							<Gtk.Image
								class="Icon"
								iconName={createBinding(
									player,
									"playbackStatus"
								)((s) => {
									switch (s) {
										case Mpris.PlaybackStatus.PLAYING:
											return "media-playback-pause-symbolic";
										case Mpris.PlaybackStatus.PAUSED:
										case Mpris.PlaybackStatus.STOPPED:
											return "media-playback-start-symbolic";
									}
								})}
							/>
						</button>
						<button
							onClicked={() => player.next()}
							class="PlayerButton"
							sensitive={createBinding(player, "canGoNext")}
						>
							<Gtk.Image class="Icon" iconName="media-skip-forward-symbolic" />
						</button>
					</box>
					<label
						halign={Gtk.Align.END}
						label={createBinding(player, "length").as((length) =>
							formatTime(length)
						)}
					/>
				</box>
			</box>
			<Gtk.Image
				class="Cover"
				overflow={Gtk.Overflow.HIDDEN}
				file={createBinding(player, "coverArt")}
				visible={createBinding(
					player,
					"coverArt"
				)((coverArt) => Boolean(coverArt))}
			/>
		</box>
	</box>
);
