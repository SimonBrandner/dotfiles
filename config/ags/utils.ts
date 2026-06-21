import { exec } from "ags/process";
import { Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

export type WindowType =
	| "app_launcher"
	| "bar"
	| "progress_popup"
	| "notifications"
	| "lockscreen"
	| "desktop"
	| "quick_settings"
	| "calendar";

const WINDOW_NAME_PREFIX = "ags";
const WALLPAPER_PATH =
	"$XDG_PICTURES_DIR/Wallpapers/LinuxDistros/NixOS/0002.png";

export type AudioDeviceType = "speaker" | "microphone";

export const getAudioIcon = (
	type: AudioDeviceType,
	volume: number,
	muted: boolean | null | undefined
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

export const getWindowName = (
	windowType: WindowType,
	monitor: Gdk.Monitor
): string => {
	return `${WINDOW_NAME_PREFIX}:${windowType}:${monitor.connector}`;
};

export const doesFileExist = (path: string): boolean => {
	try {
		exec(`ls ${path}`);
		return true;
	} catch {
		return false;
	}
};

// This is a bit of hack, so that we can use the XDG_PICTURES_DIR env variable
export const getWallpaperPath = (): string => {
	return exec(`zsh -c "ls ${WALLPAPER_PATH}"`);
};

/*
 * Brute-force the icon name
 */
export const getIcon = (iconNameCandidates: Array<string>): string => {
	const iconTheme = Gtk.IconTheme.get_for_display(getDisplay());
	const transformers = [
		(s: string) => s.toLowerCase(),
		(s: string) => s[0].toUpperCase() + s.slice(1),
		(s: string) => s.toUpperCase(),
	];

	return (
		iconNameCandidates
			.filter((i) => Boolean(i))
			.flatMap((i) => transformers.map((t) => t(i)))
			.find((i) => iconTheme.has_icon(i)) ?? "dialog-information-symbolic"
	);
};
