import { Align } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { TrayItem } from "types/service/systemtray";

const systemtray = await Service.import("systemtray");

const SysTrayItem = (item: TrayItem) =>
	Widget.Button({
		child: Widget.Icon({ class_name: "Icon" }).bind("icon", item, "icon"),
		tooltipMarkup: item.bind("tooltip_markup"),
		onPrimaryClick: (_, event) => item.activate(event),
		onSecondaryClick: (_, event) => item.openMenu(event),
	});

export const SystemTray = Widget.Box({
	valign: Align.CENTER,
	class_name: "Tray",
	spacing: 4,
	children: systemtray.bind("items").as((i) => i.map(SysTrayItem)),
});
