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
