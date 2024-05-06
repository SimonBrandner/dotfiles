import { getAudioIcon } from "utils";

const audio = await Service.import("audio");

const VolumeSlider = (type: "speaker" | "microphone" = "speaker") =>
	Widget.Box({
		children: [
			Widget.Icon({ class_name: "Icon" }).hook(audio[type], (self) => {
				self.icon =
					type === "speaker"
						? getAudioIcon(type, audio[type].volume * 100, audio[type].is_muted)
						: "microphone-sensitivity-high";
			}),
			Widget.Slider({
				class_name: "Slider",
				hexpand: true,
				drawValue: false,
				onChange: ({ value }) => (audio[type].volume = value),
			}).hook(audio[type], (self) => {
				self.value = audio[type].volume;
			}),
			Widget.Label({ class_name: "Label" }).hook(audio[type], (self) => {
				self.label = `${Math.round(audio[type].volume * 100)}%`;
			}),
		],
	});

export const AudioPage = () =>
	Widget.Box({
		class_names: ["Page", "AudioPage"],
		vertical: true,
		children: [
			Widget.Box({
				class_name: "PageHeader",
				child: Widget.Label({ class_name: "Label", label: "Audio" }),
			}),
			Widget.Box({
				vertical: true,
				children: [
					Widget.Label({
						xalign: 0,
						class_name: "SectionHeader",
						label: "Devices",
					}),
					Widget.Box({
						vertical: true,
						children: [VolumeSlider("speaker"), VolumeSlider("microphone")],
					}),
				],
			}),
			Widget.Box({
				vertical: true,
				children: [
					Widget.Label({
						xalign: 0,
						class_name: "SectionHeader",
						label: "Applications",
					}),
					Widget.Box({
						vertical: true,
					}),
				],
			}),
		],
	});

export const AudioIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(audio.speaker, (self) => {
		self.icon = getAudioIcon(
			"speaker",
			Math.round(audio.speaker.volume * 100),
			audio.speaker.is_muted,
		);
	});
