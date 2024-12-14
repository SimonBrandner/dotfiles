import { Player } from "./common/Player";
import Mpris from "gi://AstalMpris";

const audio = Mpris.Player.new("spotify");

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
				child: Widget.Scrollable({
					hscroll: "never",
					child: Widget.Box({
						vertical: true,
						expand: true,
						children: mpris
							.bind("players")
							.as((players) => players.map((p) => Player(p))),
					}),
				}),
			}),
		],
	});
