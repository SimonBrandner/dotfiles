import { Align } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { TrayItem } from "types/service/systemtray";
import { Widget } from "astal/gtk3";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

const SysTrayItem = (item: TrayItem) =>
	Widget.Button({
		onPrimaryClick: (_, event) => item.activate(event),
		onSecondaryClick: (_, event) => item.openMenu(event),
		child: Widget.Icon({ class_name: "Icon" }).hook(item, (self) => {
			self.icon = item.icon;
		}),
	}).hook(item, (self) => {
		self.tooltip_markup = item.tooltip_markup;
	});

export const SystemTray = () =>
	Widget.Box({
		class_name: "Tray",
		spacing: 4,
	}).hook(systemtray, (self) => {
		self.children = systemtray.items.map(SysTrayItem);
	});
