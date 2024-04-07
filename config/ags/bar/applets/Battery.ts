const battery = await Service.import("battery");

export const BatteryIndicator = Widget.Label({
	label: battery.bind("percent").as((p) => `${p.toString()}%`),
});
