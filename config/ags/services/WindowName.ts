export type WindowType =
	| "app_launcher"
	| "bar"
	| "progress_popup"
	| "notifications"
	| "lockscreen"
	| "desktop"
	| "quick_settings";

const PREFIX = "ags";

export const getWindowName = (
	windowType: WindowType,
	monitor?: number,
): string => {
	const windowName = `${PREFIX}:${windowType}`;
	return monitor !== null || monitor !== undefined
		? `${windowName}:${monitor}`
		: windowName;
};
