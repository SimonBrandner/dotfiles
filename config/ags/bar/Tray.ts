import { bind } from "astal";
import { Gdk, Widget } from "astal/gtk3";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

const SystemTrayItem = (item: Tray.TrayItem) =>
	new Widget.Button({
		onClickRelease: (self, event) => {
			switch (event.button) {
				case 1:
					item.activate(self, event);
					break;
				case 3:
					item
						.create_menu()
						?.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null);
					break;
			}
		},
		child: new Widget.Icon({ class_name: "Icon", gIcon: bind(item, "gicon") }),
		tooltipMarkup: bind(item, "tooltipMarkup"),
	});
export const SystemTray = () =>
	new Widget.Box({
		class_name: "Tray",
		spacing: 4,
	}).hook(tray, "notify::items", (self) => {
		self.set_children(
			tray.get_items().map((item: Tray.TrayItem) => SystemTrayItem(item))
		);
	});
