import { createBinding } from "ags";
import Battery from "gi://AstalBattery";
import { Gtk } from "ags/gtk4";

const battery = Battery.get_default();

export const BatteryIndicator = () => {
	return (
		<box visible={createBinding(battery, "isPresent")}>
			<box>
				<Gtk.Image
					class="Indicator"
					iconName={createBinding(battery, "batteryIconName")}
				/>
				<label
					label={createBinding(battery, "percentage").as(
						(p) => `${Math.floor(p * 100)}%`
					)}
				/>
			</box>
		</box>
	);
};
