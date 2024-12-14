import { Variable, bind } from "astal";
import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";

import { AudioDeviceType, getAudioIcon } from "./../utils";

const audio = Wp.get_default().audio;

interface VolumeSliderProps {
	stream: Wp.Stream;
	type: AudioDeviceType;
}

export const VolumeSlider = ({ stream, type }: VolumeSliderProps) =>
	new Widget.Box({
		class_name: "VolumeSlider",
		children: [
			new Widget.Icon({
				class_name: "Icon",
				icon: bind(
					Variable.derive(
						[
							bind(stream, "name"),
							bind(stream, "volume"),
							bind(stream, "mute"),
						],
						(name, volume, is_muted) =>
							Widget.Icon.lookup_icon(name ?? "")
								? name ?? ""
								: getAudioIcon(type, volume * 100, is_muted)
					)
				),
			}),
			new Widget.Slider({
				class_name: "Slider",
				hexpand: true,
				drawValue: false,
				onDragged: ({ value }) => (stream.volume = value),
				value: bind(stream, "volume"),
			}),
			new Widget.Label({
				class_name: "PercentageLabel",
				label: bind(stream, "volume").as(
					(volume) => `${Math.round(volume * 100)}%`
				),
			}),
		],
	});

const StreamEntry = ({ stream, type }: VolumeSliderProps) =>
	new Widget.Box({
		class_name: "StreamEntry",
		vertical: true,
		children: [
			new Widget.Label({
				label: stream.description,
				xalign: 0,
				truncate: "end",
			}),
			VolumeSlider({ stream, type }),
		],
	});

const DeviceStreamEntry = ({ stream, type }: VolumeSliderProps) =>
	new Widget.EventBox({
		class_name: bind(audio, `default-${type}`).as((endpoint) =>
			endpoint.stream === stream.stream
				? "DeviceStreamEntry Active"
				: "DeviceStreamEntry"
		),
		child: StreamEntry({ stream, type }),
		onClickRelease: () => {
			audio[type] = stream;
		},
	});

interface SectionProps {
	label: string;
	child?;
}

const Section = ({ label, child }: SectionProps) =>
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
				child,
			}),
		],
	});

export const AudioPage = () =>
	new Widget.Box({
		name: "audio_page",
		class_name: "Page AudioPage",
		vertical: true,
		children: [
			new Widget.Box({
				class_name: "PageHeader",
				child: new Widget.Label({ class_name: "Label", label: "Audio" }),
			}),
			Section({
				label: "Outputs",
				child: bind(audio, "speakers").as(
					(speakers) =>
						new Widget.Box({
							children: speakers.map((speaker) =>
								DeviceStreamEntry({ stream: speaker, type: "speaker" })
							),
						})
				),
			}),
			Section({
				label: "Inputs",
				child: bind(audio, "microphones").as(
					(inputs) =>
						new Widget.Box({
							children: inputs.map((microphone) =>
								DeviceStreamEntry({ stream: microphone, type: "speaker" })
							),
						})
				),
			}),
			Section({
				label: "Applications",
				child: bind(audio, "streams").as(
					(streams) =>
						new Widget.Box({
							children: streams.map((stream) =>
								StreamEntry({ stream: stream, type: "speaker" })
							),
						})
				),
			}),
			// This somehow produces a bunch of useless things
			//Section({
			//	label: "Application Input",
			//	children: audio
			//		.bind("recorders")
			//		.as((apps) =>
			//			apps.map((app) => VolumeSlider({ stream: app, type: "microphone" }))
			//"microphone" }))
			//		),
			//}),
		],
	});

export const AudioIndicator = () =>
	new Widget.Icon({
		class_name: "Indicator",
		icon: bind(
			Variable.derive(
				[
					bind(audio.get_default_speaker(), "volume"),
					bind(audio.get_default_speaker(), "mute"),
				],
				(volume, muted) =>
					getAudioIcon("speaker", Math.round(volume * 100), muted)
			)
		),
	});
