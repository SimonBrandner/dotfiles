const audio = await Service.import("audio");
import brightness from "services/Brightness";
import { getWindowName } from "services/WindowName";
import { deepEqual, getAudioIcon } from "utils";

const DELAY = 2500;

type InfoType = "audio-speaker" | "brightness-screen";
interface Info {
	iconName: string;
	percentageText: string;
}

const getInfo = (type: InfoType): Info => {
	switch (type) {
		case "audio-speaker":
			const volume = Math.round(audio.speaker.volume * 100);
			return {
				iconName: getAudioIcon(volume, audio.speaker.is_muted),
				percentageText: `${volume}%`,
			};

		case "brightness-screen":
			const screenBrightness = Math.round(brightness.screen * 100);
			return {
				iconName: "display-brightness-symbolic",
				percentageText: `${screenBrightness}%`,
			};

		default:
			throw "Bad arguments supplied";
	}
};

export const ProgressPopup = () => {
	const icon = Widget.Icon({
		size: 24,
		vpack: "start",
	});
	const percentage = Widget.Label();
	const popupWindow = Widget.Window({
		name: getWindowName("bar_popup"),
		anchor: ["left"],
		visible: false,
		child: Widget.Box({
			vertical: true,
			class_name: "BarPopup",
			children: [icon, percentage],
		}),
	});

	let count = 0;
	const show = (info: Info) => {
		const { iconName, percentageText } = info;
		icon.icon = iconName;
		percentage.label = percentageText;

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
