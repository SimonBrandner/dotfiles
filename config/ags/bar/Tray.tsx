import { createBinding, For, onCleanup } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

const SystemTrayItem = ({ item }: { item: Tray.TrayItem }) => {
	let popoverMenu: Gtk.PopoverMenu | null = null;
	const onButtonPressEvent = (
		source: Gtk.GestureClick,
		_: number,
		x: number,
		y: number
	) => {
		const mouseButton = source.get_current_button();
		if (mouseButton === Gdk.BUTTON_PRIMARY) {
			item.activate(x, y);
		} else if (mouseButton === Gdk.BUTTON_SECONDARY) {
			if (popoverMenu?.visible) {
				popoverMenu?.popdown();
			} else {
				popoverMenu?.popup();
			}
		} else if (mouseButton == Gdk.BUTTON_MIDDLE) {
			item.secondary_activate(x, y);
		}
	};

	const onSetup = (self: Gtk.PopoverMenu) => {
		popoverMenu = self;

		self.insert_action_group("dbusmenu", item.actionGroup);
		item.connect("notify::action-group", () => {
			self.insert_action_group("dbusmenu", item.actionGroup);
		});

		const connections = [
			item.connect("notify::action-group", (item) => {
				self.insert_action_group("dbusmenu", item.actionGroup);
			}),

			item.connect("notify::menu-model", (item) => {
				self.set_menu_model(item.menuModel);
			}),
		];
		onCleanup(() => connections.map((id) => item.disconnect(id)));
	};

	return (
		<box>
			<Gtk.GestureClick
				onPressed={() => item.about_to_show()}
				onReleased={onButtonPressEvent}
				button={0}
			/>
			<Gtk.Image class="Icon" gicon={createBinding(item, "gicon")} />
			<Gtk.PopoverMenu menuModel={item.menuModel} $={onSetup} />
		</box>
	);
};

export const SystemTray = () => {
	return (
		<box class="Tray" spacing={4}>
			<For each={createBinding(tray, "items")}>
				{(trayItem: Tray.TrayItem) => <SystemTrayItem item={trayItem} />}
			</For>
		</box>
	);
};
