import { createBinding, For } from "ags";
import { Astal, Gdk } from "ags/gtk3";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

const SystemTrayItem = ({ item }: { item: Tray.TrayItem }) => {
	const onClicked = (_self: Astal.Button, event: Gdk.Event) => {
		const [_button, pressed_button] = event.get_button();
		const [_coordinates, x, y] = event.get_root_coords();
		switch (pressed_button) {
			case 1:
				item.activate(x, y);
				break;
			case 3:
				item.secondary_activate(x, y);
				break;
		}
	};

	return (
		<button
			onButtonPressEvent={onClicked}
			tooltipMarkup={createBinding(item, "tooltipMarkup")}
		>
			<icon class="Icon" gicon={createBinding(item, "gicon")} />
		</button>
	);
};

export const SystemTray = () => {
	return (
		<box class="Tray" spacing={4}>
			<For each={createBinding(tray, "items")}>
				{(trayItem) => <SystemTrayItem item={trayItem} />}
			</For>
		</box>
	);
};
