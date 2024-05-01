import Gdk from "types/@girs/gdk-3.0/gdk-3.0";

export type WindowType =
	| "app_launcher"
	| "bar"
	| "progress_popup"
	| "notifications"
	| "lockscreen"
	| "desktop"
	| "quick_settings";

const WINDOW_NAME_PREFIX = "ags";

export const getAudioIcon = (
	volume: number,
	muted: boolean | null | undefined,
): string => {
	if (muted) return "audio-volume-muted-symbolic";
	else if (volume > 100) return "audio-volume-overamplified-symbolic";
	else if (volume > 66) return "audio-volume-high-symbolic";
	else if (volume > 33) return "audio-volume-medium-symbolic";
	else return "audio-volume-low-symbolic";
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

const getMonitorName = (searchedMonitor: Gdk.Monitor): string => {
	for (const [index, monitor] of getMonitors().entries()) {
		if (monitor === searchedMonitor) {
			return `${index}`;
		}
	}

	return "0";
};

export const getWindowName = (
	windowType: WindowType,
	monitor?: Gdk.Monitor,
): string => {
	const windowName = `${WINDOW_NAME_PREFIX}:${windowType}`;
	return monitor ? `${windowName}:${getMonitorName(monitor)}` : windowName;
};
