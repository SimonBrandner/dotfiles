import { Variable } from "types/variable";
import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "quick_settings/QuickSettings";
import { PageHeader } from "quick_settings/common/PageHeader";

const bluetooth = await Service.import("bluetooth");

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
			current_page_name.value = "bluetooth";
		},
	});

export const BluetoothPage = () => {
	const pageHeader = PageHeader({
		label: "Bluetooth",
		connection: [bluetooth, () => bluetooth.enabled],
		on_click: (active) => {
			bluetooth.enabled = active;
		},
	});
	const deviceList = Widget.Box({
		vertical: true,
	}).hook(bluetooth, (self) => {
		self.children = bluetooth.devices.map((device) =>
			Widget.Button({
				class_name: "Device",
				child: Widget.Box({
					children: [
						Widget.Icon({
							class_name: "Icon",
							icon: device.icon_name,
						}),
						Widget.Label({
							label: device.name,
						}),
						Widget.Box({ hexpand: true }),
						Widget.Icon({
							class_name: "Icon",
							icon: "dialog-ok",
							visible: false,
						}).hook(device, (self) => {
							self.visible = device.connected;
						}),
					],
				}),
				on_clicked: () => {
					if (device.connecting) return;
					device.setConnection(!device.connected);
				},
			}),
		);
	});

	return Widget.Box({
		class_name: "Page",
		vertical: true,
		children: [pageHeader, deviceList],
	});
};

export const BluetoothIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(bluetooth, (self) => {
		self.icon = bluetooth.enabled
			? "bluetooth-active-symbolic"
			: "bluetooth-disabled-symbolic";
	});
