const audio = await Service.import("audio");
import brightness from "services/brightness";

const DELAY = 2500;

type BarInfoType = "audio-speaker" | "brightness-screen";

const getInfoForBar = (
	type: BarInfoType,
): { iconName: string; percentageText: string } => {
	switch (type) {
		case "audio-speaker":
			const volume = Math.round(audio.speaker.volume * 100);
			let iconName = "";
			if (audio.speaker.is_muted) iconName = "audio-volume-muted-symbolic";
			else if (volume > 100) iconName = "audio-volume-overamplified-symbolic";
			else if (volume > 66) iconName = "audio-volume-high-symbolic";
			else if (volume > 33) iconName = "audio-volume-medium-symbolic";
			else iconName = "audio-volume-low-symbolic";

			return {
				iconName,
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

const BarPopup = () => {
	const icon = Widget.Icon({
		size: 24,
		vpack: "start",
	});
	const percentage = Widget.Label();
	const revealer = Widget.Revealer({
		transition: "slide_left",
		child: Widget.Box({
			vertical: true,
			class_name: "BarPopup",
			children: [icon, percentage],
		}),
	});

	let count = 0;
	const show = (type: BarInfoType) => {
		const { iconName, percentageText } = getInfoForBar(type);
		icon.icon = iconName;
		percentage.label = percentageText;

		revealer.reveal_child = true;
		count++;
		Utils.timeout(DELAY, () => {
			count--;

			if (count === 0) revealer.reveal_child = false;
		});
	};

	return revealer
		.hook(audio.speaker, () => show("audio-speaker"))
		.hook(brightness, () => show("brightness-screen"), "notify::screen");
};

export const BarPopupWindow = () =>
	Widget.Window({
		name: "BarPopup",
		anchor: ["left"],
		child: Widget.Box({
			css: "padding: 1px;",
			child: BarPopup(),
		}),
	});
