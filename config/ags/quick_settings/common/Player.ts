import { SectionName } from "quick_settings/QuickSettings";
import { MprisPlayer } from "types/service/mpris";
import { Variable } from "types/variable";

function formatTime(length: number) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? "0" : "";
	return `${min}:${sec0}${sec}`;
}

export const Player = (
	player: MprisPlayer,
	current_page_name?: Variable<SectionName>,
) => {
	return Widget.Box({
		attribute: { player },
		class_name: "Player",
		vertical: true,
		hexpand: true,
		visible: player.bind("length").transform(Boolean),
		children: [
			Widget.Box({
				class_name: "TopBar",
				children: [
					Widget.Icon({
						class_name: "Icon",
						hpack: "start",
						icon: player.entry,
					}),
					Widget.Label({
						class_name: "AppName",
						hpack: "start",
						label: player.identity,
						hexpand: true,
						xalign: 0,
						truncate: "end",
					}),
				],
				setup: (self) => {
					if (!current_page_name) return;
					self.add(
						Widget.Button({
							on_clicked: () => {
								if (!current_page_name) return;
								current_page_name.value = "media";
							},
							class_name: "ExpandButton",
							visible: !!current_page_name,
							child: Widget.Icon({
								class_name: "Icon",
								icon: "pan-end-symbolic",
							}),
						}),
					);
				},
			}),
			Widget.Box({
				class_name: "Content",
				children: [
					Widget.Box({
						vertical: true,
						hexpand: true,
						children: [
							Widget.Label({
								class_name: "Title",
								truncate: "end",
								xalign: 0,
							}).hook(player, (self) => {
								self.label = player.track_title;
							}),
							Widget.Label({
								truncate: "end",
								xalign: 0,
							}).hook(player, (self) => {
								self.label = player.track_artists.reduce(
									(acc, a) => (acc += a),
									"",
								);
							}),
							Widget.Slider({
								class_name: "Slider",
								draw_value: false,
							}).poll(1000, (self) => {
								self.value = player.position / player.length;
							}),
							Widget.CenterBox({
								start_widget: Widget.Label({
									xalign: 0,
								}).poll(1000, (self) => {
									self.label = formatTime(player.position);
								}),
								center_widget: Widget.Box({
									hexpand: true,
									children: [
										Widget.Button({
											on_clicked: () => player.previous(),
											class_name: "PlayerButton",
											visible: player.bind("can_go_prev"),
											child: Widget.Icon({
												class_name: "Icon",
												icon: "media-skip-backward-symbolic",
											}),
										}),
										Widget.Button({
											on_clicked: () => player.playPause(),
											class_name: "PlayerButton",
											visible: player.bind("can_play"),
											child: Widget.Icon({
												class_name: "Icon",
												icon: player.bind("play_back_status").transform((s) => {
													switch (s) {
														case "Playing":
															return "media-playback-pause-symbolic";
														case "Paused":
														case "Stopped":
															return "media-playback-start-symbolic";
													}
												}),
											}),
										}),
										Widget.Button({
											on_clicked: () => player.next(),
											class_name: "PlayerButton",
											visible: player.bind("can_go_next"),
											child: Widget.Icon({
												class_name: "Icon",
												icon: "media-skip-forward-symbolic",
											}),
										}),
									],
								}),
								end_widget: Widget.Label({ hpack: "end" }).hook(
									player,
									(self) => {
										self.label = formatTime(player.length);
									},
								),
							}),
						],
					}),
					Widget.Box({
						class_name: "Cover",
						visible: player.bind("track_cover_url").transform(Boolean),
					}).hook(player, (self) => {
						self.css = `background-image: url("${player.track_cover_url}");`;
					}),
				],
			}),
		],
	});
};
