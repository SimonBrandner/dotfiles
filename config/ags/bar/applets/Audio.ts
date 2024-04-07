const audio = await Service.import("audio");

const VolumeSlider = (type: "speaker" | "microphone" = "speaker") =>
	Widget.Slider({
		class_name: "Slider",
		hexpand: true,
		drawValue: false,
		onChange: ({ value }) => (audio[type].volume = value),
		value: audio[type].bind("volume"),
	});

export const AudioPage = () =>
	Widget.Box({
		class_name: "AudioPage",
		vertical: true,
		children: [VolumeSlider("speaker"), VolumeSlider("microphone")],
	});
