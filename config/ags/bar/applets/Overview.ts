import { BluetoothOverviewToggle } from "bar/applets/Bluetooth";
import { WifiOverviewToggle } from "bar/applets/Networks";

const notifications = await Service.import("notifications");

const DoNotDisturb = () =>
	Widget.Button({
		on_clicked: () => {
			notifications.dnd = !notifications.dnd;
		},
	}).hook(notifications, (self) => {
		self.label = notifications.dnd ? "Do disturb" : "Do not disturb";
	});

export const ButtonGrid = () =>
	Widget.Box({
		hexpand: true,
		vertical: true,
		children: [
			Widget.Box({
				hexpand: true,
				children: [
					BluetoothOverviewToggle({
						on_expand_clicked: () => {},
					}),
					WifiOverviewToggle({
						on_expand_clicked: () => {},
					}),
				],
			}),
		],
	});

export const Overview = () =>
	Widget.Box({
		vertical: true,
		children: [DoNotDisturb(), ButtonGrid()],
	});
