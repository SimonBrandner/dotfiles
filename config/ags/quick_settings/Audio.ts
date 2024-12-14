import { Binding } from "types/service";
import { Stream } from "types/service/audio";
import { Widget } from "astal/gtk3";
import { bind } from "astal";
import Wp from "gi://AstalWp";

import { AudioDeviceType, getAudioIcon } from "./../utils";

const audio = Wp.get_default().audio;

interface VolumeSliderProps {
	stream: Stream;
	type: AudioDeviceType;
}

export const VolumeSlider = ({ stream, type }: VolumeSliderProps) =>
	new Widget.Box({
		class_name: "VolumeSlider",
		children: [
			new Widget.Icon({ class_name: "Icon" }).hook(stream, (self) => {
				self.icon = lookUpIcon(stream.name ?? "")
					? stream.name ?? ""
					: getAudioIcon(type, stream.volume * 100, stream.is_muted);
			}),
			new Widget.Slider({
				class_name: "Slider",
				hexpand: true,
				drawValue: false,
				onDragged: ({ value }) => (stream.volume = value),
			}).hook(stream, (self) => {
				self.value = stream.volume;
			}),
			new Widget.Label({ class_name: "PercentageLabel" }).hook(
				stream,
				(self) => {
					self.label = `${Math.round(stream.volume * 100)}%`;
				}
			),
		],
	});

const StreamEntry = ({ stream, type }: VolumeSliderProps) =>
	new Widget.Box({
		class_name: "StreamEntry",
		vertical: true,
		children: [
			Widget.Label({ label: stream.description, xalign: 0, truncate: "end" }),
			VolumeSlider({ stream, type }),
		],
	});

const DeviceStreamEntry = ({ stream, type }: VolumeSliderProps) =>
	new Widget.EventBox({
		class_name: "DeviceStreamEntry",
		child: StreamEntry({ stream, type }),
		on_primary_click: () => {
			audio[type] = stream;
		},
	}).hook(audio, (self) => {
		self.toggleClassName("Active", audio[type].stream === stream.stream);
	});

interface SectionProps {
	label: string;
	children?: Binding<
		typeof audio,
		"speakers" | "microphones" | "apps" | "recorders",
		Array<ReturnType<typeof StreamEntry | typeof DeviceStreamEntry>>
	>;
}

const Section = ({ label, children }: SectionProps) =>
	new Widget.Box({
		vertical: true,
		class_name: "Section",
		children: [
			new Widget.Label({
				xalign: 0,
				class_name: "SectionHeader",
				label,
			}),
			new Widget.Box({
				vertical: true,
				spacing: 4,
				children,
			}),
		],
	});

export const AudioPage = () =>
	new Widget.Box({
		class_names: ["Page", "AudioPage"],
		vertical: true,
		children: [
			new Widget.Box({
				class_name: "PageHeader",
				child: new Widget.Label({ class_name: "Label", label: "Audio" }),
			}),
			Section({
				label: "Outputs",
				children: audio
					.bind("speakers")
					.as((apps) =>
						apps.map((app) =>
							DeviceStreamEntry({ stream: app, type: "speaker" })
						)
					),
			}),
			Section({
				label: "Inputs",
				children: audio
					.bind("microphones")
					.as((apps) =>
						apps.map((app) =>
							DeviceStreamEntry({ stream: app, type: "speaker" })
						)
					),
			}),
			Section({
				label: "Applications",
				children: audio
					.bind("apps")
					.as((apps) =>
						apps.map((app) => StreamEntry({ stream: app, type: "speaker" }))
					),
			}),
			// This somehow produces a bunch of useless things
			//Section({
			//	label: "Application Input",
			//	children: audio
			//		.bind("recorders")
			//		.as((apps) =>
			//			apps.map((app) => VolumeSlider({ stream: app, type: "microphone" }))
			//		),
			//}),
		],
	});

export const AudioIndicator = () =>
	new Widget.Icon({ class_name: "Indicator" }).hook(audio.speaker, (self) => {
		self.icon = getAudioIcon(
			"speaker",
			Math.round(audio.speaker.volume * 100),
			audio.speaker.is_muted
		);
	});
