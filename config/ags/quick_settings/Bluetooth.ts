import { OverviewToggle } from "./common/OverviewToggle";

const bluetooth = await Service.import("bluetooth");

interface BluetoothOverviewToggleProps {
	on_expand_clicked: () => void;
}
export const BluetoothOverviewToggle = ({
	on_expand_clicked,
}: BluetoothOverviewToggleProps) =>
	OverviewToggle({
		label: "Bluetooth",
		connection: [bluetooth, () => bluetooth.enabled],
		on_clicked: () => {
			bluetooth.toggle();
		},
		on_expand_clicked,
	});

export const BluetoothPage = () => Widget.Box({});

export const BluetoothIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(bluetooth, (self) => {
		self.icon = bluetooth.enabled
			? "bluetooth-active-symbolic"
			: "bluetooth-disabled-symbolic";
	});
