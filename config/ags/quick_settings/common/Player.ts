import { SectionName } from "quick_settings/QuickSettings";
import { MprisPlayer } from "types/service/mpris";
import { Variable } from "types/variable";

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
						icon: player.entry,
					}),
					Widget.Label({
						class_name: "AppName",
						label: player.identity,
						hexpand: true,
						xalign: 0,
					}),
				],
				setup: (self) => {
					if (current_page_name) {
						self.add(
							Widget.Button({
								on_clicked: () => {
									current_page_name.value = "media";
								},
								class_name: "ExpandButton",
								hpack: "end",
								child: Widget.Icon({
									class_name: "Icon",
									icon: "pan-end-symbolic",
								}),
							}),
						);
					}
				},
			}),
			Widget.Box({
				vertical: true,
				hpack: "start",
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
				],
			}),
		],
	});
