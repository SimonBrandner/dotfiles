import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import Wp from "gi://AstalWp";
import Gtk from "gi://Gtk?version=4.0";
import AstalBrightness from "gi://AstalBrightness";
import { deepEqual, getAudioIcon, getWindowName, setupWindow } from "../utils";
import { createComputed, createEffect, createState } from "gnim";

const audio = Wp.get_default().audio;
const brightness = AstalBrightness.get_default();

const DELAY = 2500;

type InfoType = "audio-speaker" | "brightness-screen";
interface Info {
	iconName: string;
	percentage: number;
	disabled: boolean;
}

const getInfo = (type: InfoType): Info => {
	switch (type) {
		case "audio-speaker":
			const speaker =
				audio.speakers?.find((s) => s.isDefault) ?? audio.get_default_speaker();
			const volume = Math.round(speaker.volume * 100);
			return {
				iconName: getAudioIcon("speaker", volume, speaker.mute),
				percentage: volume,
				disabled: speaker.mute,
			};

		case "brightness-screen":
			const screenBrightness = Math.round(brightness.screen.brightness * 100);
			return {
				iconName: "display-brightness-symbolic",
				percentage: screenBrightness,
				disabled: false,
			};

		default:
			throw "Bad arguments supplied";
	}
};

type ProgressPopupProps = {
	monitor: Gdk.Monitor;
};

export const ProgressPopup = ({ monitor }: ProgressPopupProps) => {
	const [progressIcon, setProgressIcon] = createState<string>("");
	const [progressLabel, setProgressLabel] = createState<string>("");
	const [progressValue, setProgressValue] = createState<number>(0);
	const [progressVisible, setProgressVisible] = createState<boolean>(false);
	const [progressDisabled, setProgressDisabled] = createState<boolean>(false);

	let count = 0;
	const show = (info: Info) => {
		const { iconName, percentage, disabled } = info;
		setProgressIcon(iconName);
		setProgressLabel(`${percentage.toString()}%`);
		setProgressValue(percentage / 100);
		setProgressVisible(true);
		setProgressDisabled(disabled);

		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) setProgressVisible(false);
		});
	};

	const cache: Partial<Record<InfoType, Info | undefined>> = {};
	const update = (type: InfoType) => {
		const cachedInfo = cache[type];
		const info = getInfo(type);

		if (cachedInfo !== undefined && !deepEqual(cachedInfo, info)) {
			show(info);
		}

		cache[type] = info;
	};

	// Somehow tracking all speakers is the only thing that avoids breakage
	// when (un)connecting an HDMI output with a speaker
	let speakers: Array<[Wp.Endpoint, number, number]> = [];
	const onSpeakersChanged = () => {
		speakers.forEach(([speaker, volumeHandler, muteHandler]) => {
			speaker.disconnect(volumeHandler);
			speaker.disconnect(muteHandler);
		});

		const ifDefaultUpdate = (speaker: Wp.Endpoint) => {
			if (speaker.isDefault) {
				update("audio-speaker");
			}
		};
		speakers =
			audio.speakers?.map((speaker) => [
				speaker,
				speaker.connect("notify::volume", () => ifDefaultUpdate(speaker)),
				speaker.connect("notify::mute", () => ifDefaultUpdate(speaker)),
			]) ?? [];
	};
	onSpeakersChanged();

	audio.connect("notify::speakers", onSpeakersChanged);
	brightness.connect("brightness-changed", () => update("brightness-screen"));

	return (
		<window
			gdkmonitor={monitor}
			visible={progressVisible}
			application={app}
			name={getWindowName("progress_popup", monitor)}
			anchor={Astal.WindowAnchor.LEFT}
			$={setupWindow}
		>
			<box
				orientation={Gtk.Orientation.VERTICAL}
				class={createComputed(() => {
					let classNames = "ProgressPopup";
					if (progressValue() > 1) {
						classNames += " Warning";
					}
					if (progressDisabled()) {
						classNames += " Disabled";
					}
					return classNames;
				})}
			>
				<Gtk.Scale
					class="Progress"
					orientation={Gtk.Orientation.VERTICAL}
					inverted
					vexpand
					$={(self: Gtk.Range) => {
						self.set_range(0, 1);
						createEffect(() => {
							self.set_value(progressValue());
						});
					}}
				/>
				<Gtk.Image
					class="Icon"
					iconName={progressIcon}
					valign={Gtk.Align.CENTER}
					halign={Gtk.Align.CENTER}
				/>
				<label label={progressLabel} />
			</box>
		</window>
	);
};
