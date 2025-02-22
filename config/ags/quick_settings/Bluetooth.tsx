import { bind, Variable, GObject } from "astal";
import { Widget } from "astal/gtk3";
import Bluetooth from "gi://AstalBluetooth";

import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "./QuickSettings";

const bluetooth = Bluetooth.get_default();

interface BluetoothOverviewToggleProps {
	current_page_name: Variable<SectionName>;
}
export const BluetoothOverviewToggle = ({
	current_page_name,
}: BluetoothOverviewToggleProps) =>
	OverviewToggle({
		label: "Bluetooth",
		active: bind(bluetooth, "isPowered"),
		indicator: BluetoothIndicator(),
		on_clicked: () => {
			bluetooth.toggle();
		},
		on_expand_clicked: () => {
			current_page_name.set("bluetooth");
		},
	});

const Device = (device: Bluetooth.Device) =>
	new Widget.Button({
		class_name: bind(
			Variable.derive(
				[bind(device, "connected"), bind(device, "connected")],
				(connected, connecting) =>
					connected || connecting ? "Device Active" : "Device"
			)
		),
		attribute: { device },
		child: new Widget.Box({
			children: [
				new Widget.Icon({
					class_name: "Icon",
					icon: device.icon,
				}),
				new Widget.Label({
					label: device.name,
				}),
				new Widget.Box({ hexpand: true }),
				new Widget.Icon({
					class_name: "Icon",
					icon: "dialog-ok",
					visible: bind(device, "connected"),
				}),
			],
		}),
		onClickRelease: () =>
			device.connecting || device.connected
				? device.disconnect_device(() => {})
				: device.connect_device(() => {}),
	});

export const BluetoothPage = () => {
	const pageHeader = (
		<box className="PageHeader">
			<label className="Label" label="Bluetooth" />
			<box hexpand={true}></box>
			<box>
				<switch
					className={bind(bluetooth, "isPowered").as((active) =>
						active ? "active" : ""
					)}
					active={bind(bluetooth, "isPowered")}
					onStateSet={(_, active) =>
						bluetooth.isPowered != active && bluetooth.toggle()
					}
					setup={(self) => {
						bluetooth.bind_property(
							"isPowered",
							self,
							"active",
							GObject.BindingFlags.BIDIRECTIONAL |
								GObject.BindingFlags.SYNC_CREATE
						);
					}}
				></switch>
			</box>
		</box>
	);
	const deviceList = new Widget.Scrollable({
		hscroll: "never",
		expand: true,
		visible: bind(bluetooth, "isPowered"),
		child: new Widget.Box({
			vertical: true,
			children: bluetooth.devices.map((device: Bluetooth.BluetoothDevice) =>
				Device(device)
			),
		})
			.hook(
				bluetooth,
				"device-added",
				(self, device: Bluetooth.BluetoothDevice) => {
					if (!device) return;
					self.children = [...self.children, Device(device)];
				}
			)
			.hook(
				bluetooth,
				"device-removed",
				(self, device: Bluetooth.BluetoothDevice) => {
					self.children
						.find(
							(d: Bluetooth.BluetoothDevice) => d.attribute.device === device
						)
						?.destroy();
				}
			),
	});

	return new Widget.Box({
		name: "bluetooth_page",
		class_name: "Page BluetoothPage",
		vertical: true,
		children: [pageHeader, deviceList],
	});
};

export const BluetoothIndicator = () =>
	new Widget.Icon({
		class_name: "Indicator",
		icon: bind(bluetooth, "is-powered").as((isPowered: boolean) =>
			isPowered ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic"
		),
	});
