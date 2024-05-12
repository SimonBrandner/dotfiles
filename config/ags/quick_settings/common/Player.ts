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
) =>
	Widget.Box({
		attribute: { player },
		class_name: "Player",
		vertical: true,
		hexpand: true,
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
								center_widget: Widget.Box({ hexpand: true }),
								end_widget: Widget.Label({ hpack: "end" }).hook(
									player,
									(self) => {
										self.label = formatTime(player.length);
									},
								),
							}),
						],
					}),
					Widget.Box({ class_name: "Cover" }).hook(player, (self) => {
						self.css = `background-image: url("${player.track_cover_url}");`;
					}),
				],
			}),
		],
	});
