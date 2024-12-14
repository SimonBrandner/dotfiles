import { bind, Variable } from "astal";
import { Widget } from "astal/gtk3";
import { SectionName } from "../QuickSettings";
import Mpris from "gi://AstalMpris";

function formatTime(length: number) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? "0" : "";
	return `${min}:${sec0}${sec}`;
}

export const Player = (
	player: Mpris.Player,
	current_page_name?: Variable<SectionName>
) => {
	return new Widget.Box({
		attribute: { player },
		class_name: "Player",
		vertical: true,
		hexpand: true,
		visible: bind(player, "length").as((l) => Boolean(l)),
		children: [
			new Widget.Box({
				class_name: "TopBar",
				children: [
					new Widget.Icon({
						class_name: "Icon",
						hpack: "start",
						icon: player.entry,
					}),
					new Widget.Label({
						class_name: "AppName",
						hpack: "start",
						label: player.identity,
						hexpand: true,
						xalign: 0,
						truncate: "end",
					}),
				],
				setup: (self) => {
					if (current_page_name) {
						self.add(
							new Widget.Button({
								on_clicked: () => {
									if (!current_page_name) return;
									current_page_name.set("media");
								},
								class_name: "Button ExpandButton",
								child: new Widget.Icon({
									class_name: "Icon",
									icon: "pan-end-symbolic",
								}),
							})
						);
					} else {
						self.add(
							new Widget.Button({
								on_clicked: () => {
									player.close();
								},
								class_name: "Button CloseButton",
								child: new Widget.Icon({
									class_name: "Icon",
									icon: "window-close-symbolic",
								}),
							})
						);
					}
				},
			}),
			new Widget.Box({
				class_name: "Content",
				children: [
					new Widget.Box({
						vertical: true,
						hexpand: true,
						children: [
							new Widget.Label({
								class_name: "Title",
								truncate: "end",
								xalign: 0,
								label: bind(player, "title"),
							}),
							new Widget.Label({
								truncate: "end",
								xalign: 0,
								label: bind(player, "artist").as((artist) =>
									artist ? artist : ""
								),
							}),
							new Widget.Slider({
								class_name: "Slider",
								draw_value: false,
								value: bind(player, "position").as(
									(position) => position / player.length
								),
							}),
							new Widget.CenterBox({
								start_widget: new Widget.Label({
									xalign: 0,
								}),
								label: bind(player, "position").as((position) =>
									formatTime(position)
								),
								center_widget: new Widget.Box({
									hexpand: true,
									children: [
										new Widget.Button({
											on_clicked: () => player.previous(),
											class_name: "PlayerButton",
											visible: bind(player, "can-go-prev"),
											child: new Widget.Icon({
												class_name: "Icon",
												icon: "media-skip-backward-symbolic",
											}),
										}),
										new Widget.Button({
											on_clicked: () => player.play_pause(),
											class_name: "PlayerButton",
											visible: bind(player, "can-play"),
											child: new Widget.Icon({
												class_name: "Icon",
												icon: bind(player, "playback_status").as((s) => {
													switch (s) {
														case Mpris.PlaybackStatus.PLAYING:
															return "media-playback-pause-symbolic";
														case Mpris.PlaybackStatus.PAUSED:
														case Mpris.PlaybackStatus.STOPPED:
															return "media-playback-start-symbolic";
													}
												}),
											}),
										}),
										new Widget.Button({
											on_clicked: () => player.next(),
											class_name: "PlayerButton",
											visible: bind(player, "can-go-next"),
											child: new Widget.Icon({
												class_name: "Icon",
												icon: "media-skip-forward-symbolic",
											}),
										}),
									],
								}),
								end_widget: new Widget.Label({
									hpack: "end",
									label: bind(player, "length").as((length) =>
										formatTime(length)
									),
								}),
							}),
						],
					}),
					new Widget.Box({
						class_name: "Cover",
						visible: bind(player, "cover-art").as((coverArt) =>
							Boolean(coverArt)
						),
						css: bind(player, "cover-art").as(
							(coverArt) => `background-image: url("${coverArt}");`
						),
					}),
				],
			}),
		],
	});
};
