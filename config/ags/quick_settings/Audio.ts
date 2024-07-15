import { Binding } from "types/service";
import { Stream } from "types/service/audio";
import { AudioDeviceType, getAudioIcon } from "utils";

const audio = await Service.import("audio");

export const OldVolumeSlider = (type: AudioDeviceType) =>
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

interface VolumeSliderProps {
	stream: Stream;
	type: AudioDeviceType;
}

const VolumeSlider = ({ stream, type }: VolumeSliderProps) =>
	Widget.Box({
		children: [
			Widget.Icon({ class_name: "Icon" }).hook(stream, (self) => {
				self.icon =
					stream.icon_name ??
					getAudioIcon(type, stream.volume * 100, stream.is_muted);
			}),
			Widget.Slider({
				class_name: "Slider",
				hexpand: true,
				drawValue: false,
				onChange: ({ value }) => (stream.volume = value),
			}).hook(stream, (self) => {
				self.value = stream.volume;
			}),
			Widget.Label({ class_name: "Label" }).hook(stream, (self) => {
				self.label = `${Math.round(stream.volume * 100)}%`;
			}),
		],
	});

interface SectionProps {
	label: string;
	children?: Binding<
		typeof audio,
		"speakers" | "microphones" | "apps" | "recorders",
		Array<ReturnType<typeof VolumeSlider>>
	>;
}

const Section = ({ label, children }: SectionProps) =>
	Widget.Box({
		vertical: true,
		children: [
			Widget.Label({
				xalign: 0,
				class_name: "SectionHeader",
				label,
			}),
			Widget.Box({
				vertical: true,
				children,
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
			Section({
				label: "Output Devices",
				children: audio
					.bind("speakers")
					.as((apps) =>
						apps.map((app) => VolumeSlider({ stream: app, type: "speaker" }))
					),
			}),
			Section({
				label: "Input Devices",
				children: audio
					.bind("microphones")
					.as((apps) =>
						apps.map((app) => VolumeSlider({ stream: app, type: "speaker" }))
					),
			}),
			Section({
				label: "Application Output",
				children: audio
					.bind("apps")
					.as((apps) =>
						apps.map((app) => VolumeSlider({ stream: app, type: "speaker" }))
					),
			}),
			Section({
				label: "Application Input",
				children: audio
					.bind("recorders")
					.as((apps) =>
						apps.map((app) => VolumeSlider({ stream: app, type: "microphone" }))
					),
			}),
		],
	});

export const AudioIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(audio.speaker, (self) => {
		self.icon = getAudioIcon(
			"speaker",
			Math.round(audio.speaker.volume * 100),
			audio.speaker.is_muted
		);
	});
