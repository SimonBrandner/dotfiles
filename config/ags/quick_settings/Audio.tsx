import { createBinding, createComputed, For } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import Wp from "gi://AstalWp";

import { AudioDeviceType, getAudioIcon } from "./../utils";
import Pango from "gi://Pango?version=1.0";
import { Astal } from "ags/gtk4";
import { SCROLL_HEIGHT } from "./QuickSettings";

const audio = Wp.get_default().audio;

interface VolumeSliderProps {
	endpoint: Wp.Endpoint;
	type: AudioDeviceType;
}

export const VolumeSlider = ({ endpoint, type }: VolumeSliderProps) => (
	<box class="VolumeSlider">
		<Gtk.Image
			class="Icon"
			iconName={createComputed(() =>
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
			onChangeValue={(
				_source: Astal.Slider,
				_scrollType: Gtk.ScrollType,
				value: number
			) => {
				endpoint.volume = value;
				return true;
			}}
			value={createBinding(endpoint, "volume")((v) => (isNaN(v) ? 0 : v))}
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

const StreamEntry = ({ endpoint, type }: VolumeSliderProps) => (
	<box class="StreamEntry" orientation={Gtk.Orientation.VERTICAL}>
		<label
			label={endpoint.description ?? undefined}
			xalign={0}
			ellipsize={Pango.EllipsizeMode.END}
		/>
		<VolumeSlider endpoint={endpoint} type={type} />
	</box>
);

const DeviceStreamEntry = ({ endpoint, type }: VolumeSliderProps) => (
	<box
		class={createBinding(
			endpoint,
			"isDefault"
		)((isDefault: boolean) =>
			isDefault ? "DeviceStreamEntry Active" : "DeviceStreamEntry"
		)}
	>
		<Gtk.GestureClick
			onPressed={() => {
				endpoint.set_is_default(true);
			}}
		/>
		<StreamEntry endpoint={endpoint} type={type} />
	</box>
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
		<scrolledwindow
			maxContentHeight={SCROLL_HEIGHT}
			propagateNaturalHeight
			vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
			hscrollbarPolicy={Gtk.PolicyType.NEVER}
		>
			<box orientation={Gtk.Orientation.VERTICAL}>
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
								<StreamEntry endpoint={application} type="speaker" />
							)}
						</For>
					</box>
				</Section>
			</box>
		</scrolledwindow>
	</box>
);

export const AudioIndicator = () => (
	<Gtk.Image
		class="Indicator"
		iconName={createComputed(() => {
			const volume = createBinding(audio.get_default_speaker(), "volume");
			const muted = createBinding(audio.get_default_speaker(), "mute");

			return getAudioIcon("speaker", Math.round(volume() * 100), muted());
		})}
	/>
);
