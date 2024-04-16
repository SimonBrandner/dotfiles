import { BluetoothOverviewToggle } from "./Bluetooth";
import { WifiOverviewToggle } from "./Networks";
import { DoNotDisturb } from "./Notifications";

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
