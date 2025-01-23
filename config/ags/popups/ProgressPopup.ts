import { timeout } from "astal";
import { App, Astal, Gdk, Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";

import Brightness from "../services/Brightness";
import { deepEqual, getAudioIcon, getWindowName } from "../utils";

const audio = Wp.get_default().audio;
const brightness = Brightness.get_default();

const DELAY = 2500;

type InfoType = "audio-speaker" | "brightness-screen";
interface Info {
	iconName: string;
	percentage: number;
}

const getInfo = (type: InfoType): Info => {
	switch (type) {
		case "audio-speaker":
			const volume = Math.round(audio.get_default_speaker().volume * 100);
			return {
				iconName: getAudioIcon(
					"speaker",
					volume,
					audio.get_default_speaker().mute
				),
				percentage: volume,
			};

		case "brightness-screen":
			const screenBrightness = Math.round(brightness.screen * 100);
			return {
				iconName: "display-brightness-symbolic",
				percentage: screenBrightness,
			};

		default:
			throw "Bad arguments supplied";
	}
};

export const ProgressPopup = (monitor: Gdk.Monitor) => {
	const icon = new Widget.Icon({
		class_name: "Icon",
		vpack: "center",
		hpack: "center",
	});
	const progress = new Widget.CircularProgress({
		class_name: "Progress",
		child: icon,
	});
	const label = new Widget.Label({});
	const popupWindow = new Widget.Window({
		gdkmonitor: monitor,
		application: App,
		name: getWindowName("progress_popup"),
		anchor: Astal.WindowAnchor.LEFT,
		visible: false,
		child: new Widget.Box({
			vertical: true,
			class_name: "ProgressPopup",
			children: [progress, label],
		}),
	});

	let count = 0;
	const show = (info: Info) => {
		const { iconName, percentage } = info;
		icon.icon = iconName;
		label.label = `${percentage.toString()}%`;
		progress.value = percentage / 100;

		popupWindow.visible = true;
		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) popupWindow.visible = false;
		});
	};

	const cache: Partial<Record<InfoType, Info | undefined>> = {};
	const update = (type: InfoType) => {
		const cachedInfo = cache[type];
		const info = getInfo(type);

		if (cachedInfo !== undefined && !deepEqual(cachedInfo, info)) {
			show(info);
		}

		cache[type] = info;
	};

	return popupWindow
		.hook(audio.get_default_speaker(), "notify::volume", () => {
			update("audio-speaker");
		})
		.hook(audio.get_default_speaker(), "notify::mute", () => {
			update("audio-speaker");
		})
		.hook(brightness, "notify::screen", () => {
			update("brightness-screen");
		});
};
