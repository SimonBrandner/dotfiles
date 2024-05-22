import { Stream } from "types/service/audio";
import { AudioDeviceType, getAudioIcon } from "utils";

const audio = await Service.import("audio");

export const VolumeSlider = (type: AudioDeviceType) =>
	Widget.Box({
		class_name: "StreamContent",
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

const AudioDevice = (s: Stream, active: boolean) =>
	Widget.Button({
		class_names: active ? ["Device", "Active"] : ["Device"],
		child: Widget.Label({ label: s.description, truncate: "end" }),
	});

const VolumeSliderWithDropdown = (type: AudioDeviceType = "speaker") => {
	const devices = Widget.Revealer({
		child: Widget.Box({
			class_name: "Devices",
			vertical: true,
			children: audio[type === "speaker" ? "speakers" : "microphones"].map(
				(d) => AudioDevice(d, audio[type] === d),
			),
		}).hook(audio, (self) => {
			//self.children
		}),
	});

	return Widget.EventBox({
		class_name: "Stream",
		child: Widget.Box({
			vertical: true,
			children: [VolumeSlider(type), devices],
		}),
		on_primary_click: () => {
			devices.reveal_child = !devices.reveal_child;
		},
	});
};

const ApplicationVolumeSlider = (app: Stream) => Widget.Box({});

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
						children: [
							VolumeSliderWithDropdown("speaker"),
							VolumeSliderWithDropdown("microphone"),
						],
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
						children: audio
							.bind("apps")
							.as((apps) => apps.map((a) => ApplicationVolumeSlider(a))),
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
