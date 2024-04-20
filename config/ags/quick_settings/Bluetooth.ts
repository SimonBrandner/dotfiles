import { Variable } from "types/variable";
import { OverviewToggle } from "./common/OverviewToggle";
import { SectionName } from "quick_settings/QuickSettings";

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
		on_clicked: () => {
			bluetooth.toggle();
		},
		on_expand_clicked: () => {
			current_page_name.value = "bluetooth";
		},
	});

export const BluetoothPage = () =>
	Widget.Box({
		class_name: "Page",
	});

export const BluetoothIndicator = () =>
	Widget.Icon({ class_name: "Indicator" }).hook(bluetooth, (self) => {
		self.icon = bluetooth.enabled
			? "bluetooth-active-symbolic"
			: "bluetooth-disabled-symbolic";
	});
