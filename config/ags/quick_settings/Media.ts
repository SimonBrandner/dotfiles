const mpris = await Service.import("mpris");

export const MediaIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "media-playback-start-symbolic",
	});
export const MediaPage = () => Widget.Box({ class_name: "Page" });
