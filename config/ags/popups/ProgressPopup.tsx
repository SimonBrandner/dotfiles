import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import Wp from "gi://AstalWp";
import Gtk from "gi://Gtk?version=4.0";

import Brightness from "../services/Brightness";
import { deepEqual, getAudioIcon, getWindowName } from "../utils";
import { createState, onCleanup } from "gnim";

const audio = Wp.get_default().audio;
const brightness = Brightness.get_default();

const DELAY = 2500;

type InfoType = "audio-speaker" | "brightness-screen";
interface Info {
	iconName: string;
	percentage: number;
}

const getInfo = (type: InfoType): Info => {
	switch (type) {
		case "audio-speaker":
			const volume = Math.round(audio.get_default_speaker().volume * 100);
			return {
				iconName: getAudioIcon(
					"speaker",
					volume,
					audio.get_default_speaker().mute
				),
				percentage: volume,
			};

		case "brightness-screen":
			const screenBrightness = Math.round(brightness.screen * 100);
			return {
				iconName: "display-brightness-symbolic",
				percentage: screenBrightness,
			};

		default:
			throw "Bad arguments supplied";
	}
};

export const ProgressPopup = (monitor: Gdk.Monitor) => {
	const [progressIcon, setProgressIcon] = createState<string>("");
	const [progressLabel, setProgressLabel] = createState<string>("");
	const [progressValue, setProgressValue] = createState<number>(0);
	const [progressVisible, setProgressVisible] = createState<boolean>(false);

	let count = 0;
	const show = (info: Info) => {
		const { iconName, percentage } = info;
		setProgressIcon(iconName);
		setProgressLabel(`${percentage.toString()}%`);
		setProgressValue(percentage / 100);
		setProgressVisible(true);

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

	audio
		.get_default_speaker()
		.connect("notify::volume", () => update("audio-speaker"));
	audio
		.get_default_speaker()
		.connect("notify::mute", () => update("audio-speaker"));
	brightness.connect("notify::screen", () => update("brightness-screen"));

	return (
		<window
			gdkmonitor={monitor}
			visible={progressVisible}
			application={app}
			name={getWindowName("progress_popup")}
			anchor={Astal.WindowAnchor.LEFT}
			$={(self) => onCleanup(() => self.destroy())}
		>
			<box
				orientation={Gtk.Orientation.VERTICAL}
				class={progressValue((v) =>
					v <= 1 ? "ProgressPopup" : "ProgressPopup Warning"
				)}
			>
				<levelbar
					class="Progress"
					value={progressValue((v) => Math.min(v, 1))}
					orientation={Gtk.Orientation.VERTICAL}
					inverted
					vexpand
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
