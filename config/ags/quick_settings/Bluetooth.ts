import { Variable, bind } from "astal";
import { Widget } from "astal/gtk3";
import Bluetooth from "gi://AstalBluetooth";

import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "./QuickSettings";
import { PageHeader } from "./common/PageHeader";

const bluetooth = Bluetooth.get_default();

interface BluetoothOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}
export const BluetoothOverviewToggle = ({
	current_page_name,
}: BluetoothOverviewToggleProps) =>
	OverviewToggle({
		label: "Bluetooth",
		connection: [bluetooth, () => bluetooth.enabled],
		indicator: BluetoothIndicator(),
		on_clicked: () => {
			bluetooth.toggle();
		},
		on_expand_clicked: () => {
			current_page_name.set("bluetooth");
		},
	});

const Device = (device: Bluetooth.BluetoothDevice) =>
	new Widget.Button({
		class_name: "Device",
		attribute: { device },
		child: new Widget.Box({
			children: [
				new Widget.Icon({
					class_name: "Icon",
					icon: device.iconName,
				}),
				new Widget.Label({
					label: device.name,
				}),
				new Widget.Box({ hexpand: true }),
				new Widget.Icon({
					class_name: "Icon",
					icon: "dialog-ok",
					visible: false,
				}).hook(device, (self) => {
					self.visible = device.connected || device.connecting;
				}),
			],
		}),
		on_clicked: () => {
			if (device.connecting) return;
			device.setConnection(!device.connected);
		},
	}).hook(device, (self) => {
		self.toggleClassName("Active", device.connected || device.connecting);
	});

export const BluetoothPage = () => {
	const pageHeader = PageHeader({
		label: "Bluetooth",
		connection: [bluetooth, () => bluetooth.enabled],
		on_click: (active) => {
			bluetooth.enabled = active;
		},
	});
	const deviceList = new Widget.Scrollable({
		hscroll: "never",
		expand: true,
		child: new Widget.Box({
			vertical: true,
			children: bluetooth.devices.map((device: Bluetooth.BluetoothDevice) =>
				Device(device)
			),
		})
			.hook(bluetooth, "device-added", (self, address) => {
				const device = bluetooth.getDevice(address);
				if (!device) return;
				self.children = [...self.children, Device(device)];
			})
			.hook(bluetooth, "device-removed", (self, address) => {
				self.children
					.find((d) => d.attribute.device.address === address)
					?.destroy();
			}),
	});

	return new Widget.Box({
		name: "bluetooth_page",
		class_names: ["Page", "BluetoothPage"],
		vertical: true,
		children: [pageHeader, deviceList],
	});
};

export const BluetoothIndicator = () =>
	new Widget.Icon({
		class_name: "Indicator",
		icon: bind(bluetooth, "enabled").as((enabled: boolean) =>
			enabled ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic"
		),
	});
