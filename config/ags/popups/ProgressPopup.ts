const audio = await Service.import("audio");
import brightness from "services/Brightness";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { deepEqual, getAudioIcon, getWindowName } from "utils";

const DELAY = 2500;

type InfoType = "audio-speaker" | "brightness-screen";
interface Info {
	iconName: string;
	percentage: number;
}

const getInfo = (type: InfoType): Info => {
	switch (type) {
		case "audio-speaker":
			const volume = Math.round(audio.speaker.volume * 100);
			return {
				iconName: getAudioIcon("speaker", volume, audio.speaker.is_muted),
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
	const icon = Widget.Icon({
		class_name: "Icon",
		vpack: "center",
		hpack: "center",
		size: 24,
	});
	const progress = Widget.CircularProgress({
		class_name: "Progress",
		child: icon,
	});
	const label = Widget.Label();
	const popupWindow = Widget.Window({
		gdkmonitor: monitor,
		name: getWindowName("progress_popup"),
		anchor: ["left"],
		visible: false,
		child: Widget.Box({
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
		Utils.timeout(DELAY, () => {
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
		.hook(audio.speaker, () => update("audio-speaker"))
		.hook(brightness, () => update("brightness-screen"), "notify::screen");
};
