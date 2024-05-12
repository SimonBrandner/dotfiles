import { Player } from "quick_settings/common/Player";

const mpris = await Service.import("mpris");

export const MediaIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "media-playback-start-symbolic",
	});
export const MediaPage = () =>
	Widget.Box({
		class_name: "Page",
		vertical: true,
		children: [
			Widget.Box({
				class_name: "PageHeader",
				child: Widget.Label({ class_name: "Label", label: "Media" }),
			}),
			Widget.Box({
				class_name: "MediaPage",
				vertical: true,
				children: mpris
					.bind("players")
					.as((players) => players.map((p) => Player(p))),
			}),
		],
	});
