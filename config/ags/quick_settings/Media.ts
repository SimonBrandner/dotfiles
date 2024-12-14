import { Player } from "./common/Player";
import Mpris from "gi://AstalMpris";
import { Widget } from "astal/gtk3";
import { bind } from "astal";

const mpris = Mpris.get_default();

export const MediaIndicator = () =>
	new Widget.Icon({
		class_name: "Indicator",
		icon: "media-playback-start-symbolic",
	});

export const MediaPage = () =>
	new Widget.Box({
		class_name: "Page",
		vertical: true,
		children: [
			new Widget.Box({
				class_name: "PageHeader",
				child: new Widget.Label({ class_name: "Label", label: "Media" }),
			}),
			new Widget.Box({
				class_name: "MediaPage",
				vertical: true,
				child: new Widget.Scrollable({
					hscroll: "never",
					child: new Widget.Box({
						vertical: true,
						expand: true,
						children: bind(mpris, "players").as((players) =>
							players.map((p) => Player(p))
						),
					}),
				}),
			}),
		],
	});
