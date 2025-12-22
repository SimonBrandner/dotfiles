import { createBinding } from "ags";
import Gtk from "gi://Gtk?version=3.0";
import Mpris from "gi://AstalMpris";
import { set_QUICK_SETTINGS_PAGE } from "../QuickSettings";
import Pango from "gi://Pango?version=1.0";

function formatTime(length: number) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? "0" : "";
	return `${min}:${sec0}${sec}`;
}

export const Player = (player: Mpris.Player, current_page_name?: any) => (
	<box
		class="Player"
		orientation={Gtk.Orientation.VERTICAL}
		hexpand
		visible={createBinding(player, "length").as((l) => Boolean(l))}
	>
		<box
			class="TopBar"
			$={(self) => {
				if (current_page_name) {
					self.add(
						(
							<button
								onClicked={() => {
									if (!current_page_name) return;
									set_QUICK_SETTINGS_PAGE("media");
								}}
								class="Button ExpandButton"
							>
								<icon class="Icon" icon="pan-end-symbolic" />
							</button>
						) as any
					);
				} else {
					self.add(
						(
							<button
								onClicked={() => {
									player.quit();
								}}
								class="Button CloseButton"
							>
								<icon class="Icon" icon="window-close-symbolic" />
							</button>
						) as any
					);
				}
			}}
		>
			<icon class="Icon" halign={Gtk.Align.START} icon={player.entry} />
			<label
				class="AppName"
				halign={Gtk.Align.START}
				label={player.identity}
				hexpand
				xalign={0}
				ellipsize={Pango.EllipsizeMode.END}
			/>
		</box>
		<box class="Content">
			<box orientation={Gtk.Orientation.VERTICAL} hexpand>
				<label
					class="Title"
					ellipsize={Pango.EllipsizeMode.END}
					xalign={0}
					label={createBinding(player, "title")}
				/>
				<label
					ellipsize={Pango.EllipsizeMode.END}
					xalign={0}
					label={createBinding(
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
					)((position) => position / player.length)}
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
							<icon class="Icon" icon="media-skip-backward-symbolic" />
						</button>
						<button
							onClicked={() => player.play_pause()}
							class="PlayerButton"
							sensitive={createBinding(player, "canPlay")}
						>
							<icon
								class="Icon"
								icon={createBinding(
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
							<icon class="Icon" icon="media-skip-forward-symbolic" />
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
			<box
				class="Cover"
				visible={createBinding(
					player,
					"coverArt"
				)((coverArt) => Boolean(coverArt))}
				css={createBinding(
					player,
					"coverArt"
				)((coverArt) => `background-image: url("${coverArt}");`)}
			/>
		</box>
	</box>
);
