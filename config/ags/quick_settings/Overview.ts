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

export const OverviewPage = () =>
	Widget.Box({
		vertical: true,
		children: [DoNotDisturb(), ButtonGrid()],
	});

export const OverviewIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "open-menu",
	});
