import { createBinding, For } from "ags";
import { Gdk, Gtk } from "ags/gtk3";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

const SystemTrayItem = ({ item }: { item: Tray.TrayItem }) => {
	const onButtonPressEvent = (
		button: Gtk.MenuButton,
		eventButton: Gdk.EventButton
	) => {
		const event = eventButton as unknown as Gdk.Event;
		const [_1, x, y] = event.get_coords();
		const [_2, mouseButton] = event.get_button();

		if (mouseButton === 1) {
			item.activate(x, y);
		} else if (mouseButton === 3) {
			button.activate();
		}
		return true;
	};

	const onSetup = (button: Gtk.MenuButton) => {
		button.insert_action_group("dbusmenu", item.actionGroup);
		item.connect("notify::action-group", () => {
			button.insert_action_group("dbusmenu", item.actionGroup);
		});
	};

	return (
		<menubutton
			$={onSetup}
			tooltipMarkup={createBinding(item, "tooltipMarkup")}
			menuModel={item.menuModel}
			onButtonPressEvent={onButtonPressEvent}
			usePopover={false}
		>
			<icon class="Icon" gicon={createBinding(item, "gicon")} />
		</menubutton>
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
