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

export const getBatteryIcon = (
	percentage: number,
	charging: boolean,
	charged: boolean,
): string => {
	const roundedPercentage = Math.round(percentage / 10) * 10;
	return charging || charged
		? `battery-${roundedPercentage}-charging`
		: `battery-${roundedPercentage}`;
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
