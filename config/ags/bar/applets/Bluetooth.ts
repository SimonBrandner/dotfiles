import { OverviewToggle } from "bar/applets/common/OverviewToggle";

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
