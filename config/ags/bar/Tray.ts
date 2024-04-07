import { TrayItem } from "types/service/systemtray";

const systemtray = await Service.import("systemtray");

const SysTrayItem = (item: TrayItem) =>
	Widget.Button({
		vexpand: true,
		hexpand: true,
		child: Widget.Icon().bind("icon", item, "icon"),
		tooltipMarkup: item.bind("tooltip_markup"),
		onPrimaryClick: (_, event) => item.activate(event),
		onSecondaryClick: (_, event) => item.openMenu(event),
	});

export const SystemTray = Widget.Box({
	vexpand: true,
	hexpand: true,
	children: systemtray.bind("items").as((i) => i.map(SysTrayItem)),
});
