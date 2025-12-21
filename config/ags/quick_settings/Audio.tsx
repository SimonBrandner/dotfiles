import { createBinding, createComputed, For } from "ags";
import Gtk from "gi://Gtk?version=3.0";
import Wp from "gi://AstalWp";

import { AudioDeviceType, getAudioIcon } from "./../utils";
import Pango from "gi://Pango?version=1.0";

const audio = Wp.get_default().audio;

interface VolumeSliderProps {
	endpoint: Wp.Endpoint;
	type: AudioDeviceType;
}

export const VolumeSlider = ({ endpoint, type }: VolumeSliderProps) => (
	<box class="VolumeSlider">
		<icon
			class="Icon"
			icon={createComputed(() =>
				getAudioIcon(
					type,
					createBinding(endpoint, "volume")() * 100,
					createBinding(endpoint, "mute")()
				)
			)}
		/>
		<slider
			class="Slider"
			hexpand={true}
			drawValue={false}
			onDragged={({ value }) => (endpoint.volume = value)}
			value={createBinding(endpoint, "volume")}
		/>
		<label
			class="PercentageLabel"
			label={createBinding(
				endpoint,
				"volume"
			)((volume) => `${Math.round(volume * 100)}%`)}
		/>
	</box>
);

const StreamEntry = ({ endpoint: stream, type }: VolumeSliderProps) => (
	<box class="StreamEntry" orientation={Gtk.Orientation.VERTICAL}>
		<label
			label={stream.description}
			xalign={0}
			ellipsize={Pango.EllipsizeMode.END}
		/>
		<VolumeSlider endpoint={stream} type={type} />
	</box>
);

const DeviceStreamEntry = ({ endpoint: stream, type }: VolumeSliderProps) => (
	<eventbox
		class={createBinding(stream, "is_default").as((isDefault) =>
			isDefault ? "DeviceStreamEntry Active" : "DeviceStreamEntry"
		)}
		onButtonPressEvent={() => {
			stream.set_is_default(true);
		}}
	>
		<StreamEntry endpoint={stream} type={type} />
	</eventbox>
);

interface SectionProps {
	label: string;
	children?: any;
}

const Section = ({ label, children }: SectionProps) => (
	<box orientation={Gtk.Orientation.VERTICAL} class="Section">
		<label xalign={0} class="SectionHeader" label={label} />
		<box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
			{children}
		</box>
	</box>
);

export const AudioPage = () => (
	<box
		$type="named"
		name="audio_page"
		class="Page AudioPage"
		orientation={Gtk.Orientation.VERTICAL}
	>
		<box class="PageHeader">
			<label class="Label" label="Audio" />
		</box>
		<Section label="Outputs">
			<box orientation={Gtk.Orientation.VERTICAL}>
				<For each={createBinding(audio, "speakers")}>
					{(speaker: Wp.Endpoint) => (
						<DeviceStreamEntry endpoint={speaker} type="speaker" />
					)}
				</For>
			</box>
		</Section>
		<Section label="Inputs">
			<box orientation={Gtk.Orientation.VERTICAL}>
				<For each={createBinding(audio, "microphones")}>
					{(microphone: Wp.Endpoint) => (
						<DeviceStreamEntry endpoint={microphone} type="microphone" />
					)}
				</For>
			</box>
		</Section>
		<Section label="Applications">
			<box orientation={Gtk.Orientation.VERTICAL}>
				<For each={createBinding(audio, "streams")}>
					{(application: Wp.Stream) => (
						<DeviceStreamEntry endpoint={application} type="speaker" />
					)}
				</For>
			</box>
		</Section>
	</box>
);

export const AudioIndicator = () => (
	<icon
		class="Indicator"
		icon={createComputed(() => {
			const volume = createBinding(audio.get_default_speaker(), "volume");
			const muted = createBinding(audio.get_default_speaker(), "mute");

			return getAudioIcon("speaker", Math.round(volume() * 100), muted());
		})}
	/>
);
