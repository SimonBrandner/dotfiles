import { createBinding } from "ags";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export const BatteryIndicator = () => {
	return (
		<box visible={createBinding(battery, "isPresent")}>
			<box>
				<icon
					class="Indicator"
					icon={createBinding(battery, "batteryIconName")}
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
