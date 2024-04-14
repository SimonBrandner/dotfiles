import { getAudioIcon } from "utils";

const audio = await Service.import("audio");

const VolumeSlider = (type: "speaker" | "microphone" = "speaker") =>
	Widget.Slider({
		class_name: "Slider",
		hexpand: true,
		drawValue: false,
		onChange: ({ value }) => (audio[type].volume = value),
	}).hook(audio[type], (self) => {
		self.value = audio[type].volume;
	});

export const AudioPage = () =>
	Widget.Box({
		class_name: "AudioPage",
		vertical: true,
		children: [VolumeSlider("speaker"), VolumeSlider("microphone")],
	});

export const AudioIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(audio.speaker, (self) => {
		self.icon = getAudioIcon(
			Math.round(audio.speaker.volume * 100),
			audio.speaker.is_muted,
		);
	});
