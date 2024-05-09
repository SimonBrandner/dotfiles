import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
const hyprland = await Service.import("hyprland");

export type WindowType =
	| "app_launcher"
	| "bar"
	| "progress_popup"
	| "notifications"
	| "lockscreen"
	| "desktop"
	| "quick_settings";

const WINDOW_NAME_PREFIX = "ags";
const WALLPAPER_PATH = "$XDG_PICTURES_DIR/Wallpapers/Abstract/0013.jpg";

export type AudioDeviceType = "speaker" | "microphone";

export const getAudioIcon = (
	type: AudioDeviceType,
	volume: number,
	muted: boolean | null | undefined,
): string => {
	if (type === "speaker") {
		if (muted) return "audio-volume-muted-symbolic";
		else if (volume > 100) return "audio-volume-overamplified-symbolic";
		else if (volume > 66) return "audio-volume-high-symbolic";
		else if (volume > 33) return "audio-volume-medium-symbolic";
		else return "audio-volume-low-symbolic";
	} else {
		if (muted) return "microphone-sensitivity-muted";
		else if (volume > 100) return "microphone-sensitivity-low";
		else if (volume > 66) return "microphone-sensitivity-medium";
		else if (volume > 33) return "microphone-sensitivity-high";
		else return "microphone-sensitivity";
	}
};

export const deepEqual = (obj1: any, obj2: any): boolean => {
	if (obj1 === obj2) {
		return true;
	}
	if (
		typeof obj1 !== "object" ||
		typeof obj2 !== "object" ||
		obj1 == null ||
		obj2 == null
	) {
		return false;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
};

export const getDisplay = () => {
	const display = Gdk.Display.get_default();
	if (!display) {
		throw "No display!";
	}
	return display;
};

export const getMonitors = (): Array<Gdk.Monitor> => {
	const display = getDisplay();
	let monitors = [];

	for (
		let monitorNumber = 0;
		monitorNumber < (display.get_n_monitors() || 1);
		monitorNumber++
	) {
		const monitor = display.get_monitor(monitorNumber);
		if (!monitor) continue;

		monitors.push(monitor);
	}

	return monitors;
};

export const getMonitorName = (searchedMonitor: Gdk.Monitor): string => {
	const errorString = "No monitor found";

	for (const [index, monitor] of getMonitors().entries()) {
		if (monitor === searchedMonitor) {
			const monitor = hyprland.getMonitor(index);
			if (!monitor) throw errorString;
			return monitor.name;
		}
	}

	return errorString;
};

export const getWindowName = (
	windowType: WindowType,
	monitor?: Gdk.Monitor,
): string => {
	const windowName = `${WINDOW_NAME_PREFIX}:${windowType}`;
	return monitor ? `${windowName}:${getMonitorName(monitor)}` : windowName;
};

export const doesFileExist = (path: string): boolean => {
	let failed = false;
	Utils.exec(`ls ${path}`, undefined, () => (failed = true));
	return !failed;
};

// This is a bit of hack, so that we can use the XDG_PICTURES_DIR env variable
export const getWallpaperPath = (): string => {
	return Utils.exec(`zsh -c "ls ${WALLPAPER_PATH}"`);
};
