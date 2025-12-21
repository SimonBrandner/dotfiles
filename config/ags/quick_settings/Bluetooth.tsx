import { createBinding, createComputed, For } from "ags";
import GObject from "ags/gobject";
import Gtk from "gi://Gtk?version=3.0";
import Bluetooth from "gi://AstalBluetooth";

import { OverviewToggle } from "./common/OverviewToggle";
import { set_QUICK_SETTINGS_PAGE } from "./QuickSettings";

const bluetooth = Bluetooth.get_default();

export const BluetoothOverviewToggle = () => (
	<OverviewToggle
		label="Bluetooth"
		active={createBinding(bluetooth, "isPowered")}
		indicator={BluetoothIndicator()}
		on_clicked={() => {
			bluetooth.toggle();
		}}
		on_expand_clicked={() => {
			set_QUICK_SETTINGS_PAGE("bluetooth");
		}}
	/>
);

const Device = (device: Bluetooth.Device) => (
	<button
		class={createComputed(() =>
			createBinding(device, "connected")() ||
			createBinding(device, "connecting")()
				? "Device Active"
				: "Device"
		)}
		onClicked={() =>
			device.connecting || device.connected
				? device.disconnect_device(() => {})
				: device.connect_device(() => {})
		}
	>
		<box>
			<icon class="Icon" icon={device.icon} />
			<label label={device.name} />
			<box hexpand />
			<icon
				class="Icon"
				icon="dialog-ok"
				visible={createBinding(device, "connected")}
			/>
		</box>
	</button>
);

export const BluetoothPage = () => {
	const pageHeader = (
		<box class="PageHeader">
			<label class="Label" label="Bluetooth" />
			<box hexpand={true}></box>
			<box>
				<switch
					class={createBinding(bluetooth, "isPowered").as((active) =>
						active ? "active" : ""
					)}
					active={createBinding(bluetooth, "isPowered")}
					onStateSet={(_, active) =>
						bluetooth.isPowered != active && bluetooth.toggle()
					}
					$={(self) => {
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

	const deviceList = (
		<scrollable expand={true} visible={createBinding(bluetooth, "isPowered")}>
			<box orientation={Gtk.Orientation.VERTICAL}>
				<For each={createBinding(bluetooth, "devices")}>
					{(device: Bluetooth.Device) => Device(device)}
				</For>
			</box>
		</scrollable>
	);

	bluetooth.connect("device-added", (device: Bluetooth.BluetoothDevice) => {
		if (!device) return;
		deviceList.children = [...deviceList.children, Device(device)];
	});
	bluetooth.connect("device-removed", (device: Bluetooth.BluetoothDevice) => {
		// TODO
	});

	return (
		<box
			$type="named"
			name="bluetooth_page"
			class="Page BluetoothPage"
			orientation={Gtk.Orientation.VERTICAL}
		>
			{pageHeader}
			{deviceList}
		</box>
	);
};

export const BluetoothIndicator = () => {
	return (
		<icon
			class="Indicator"
			icon={createBinding(
				bluetooth,
				"isPowered"
			)((isPowered: boolean) =>
				isPowered ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic"
			)}
		/>
	);
};
