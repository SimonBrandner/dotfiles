import { createBinding, createComputed, For } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import Bluetooth from "gi://AstalBluetooth";

import { OverviewToggle } from "./common/OverviewToggle";
import { SCROLL_HEIGHT, set_QUICK_SETTINGS_PAGE } from "./QuickSettings";
import { execAsync } from "ags/process";
import { HEADER_BUTTONS_SPACING } from "../bar/QuickSettings";

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
			<Gtk.Image class="Icon" iconName={device.icon} />
			<label label={device.name} />
			<box hexpand />
			<Gtk.Image
				class="Icon"
				iconName="dialog-ok"
				visible={createBinding(device, "connected")}
			/>
		</box>
	</button>
);

export const BluetoothPage = () => {
	const pageHeader = (
		<box class="PageHeader" spacing={HEADER_BUTTONS_SPACING}>
			<label class="Label" label="Bluetooth" />
			<box hexpand />
			<button
				class="IconButton"
				onClicked={() => execAsync("alacritty -t bluetuith -e bluetuith")}
			>
				<Gtk.Image class="Icon" iconName="emblem-system-symbolic" />
			</button>
			<switch
				class={createBinding(bluetooth, "isPowered").as((active) =>
					active ? "active" : ""
				)}
				active={createBinding(bluetooth, "isPowered")}
				onStateSet={(_, active) =>
					bluetooth.isPowered != active && bluetooth.toggle()
				}
			/>
		</box>
	);

	const deviceList = (
		<scrolledwindow
			propagateNaturalHeight
			maxContentHeight={SCROLL_HEIGHT}
			vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
			hscrollbarPolicy={Gtk.PolicyType.NEVER}
			visible={createBinding(bluetooth, "isPowered")}
		>
			<box orientation={Gtk.Orientation.VERTICAL}>
				<For each={createBinding(bluetooth, "devices")}>
					{(device: Bluetooth.Device) => Device(device)}
				</For>
			</box>
		</scrolledwindow>
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
		<Gtk.Image
			class="Indicator"
			iconName={createBinding(
				bluetooth,
				"isPowered"
			)((isPowered: boolean) =>
				isPowered ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic"
			)}
		/>
	);
};
