import Gdk from "gi://Gdk?version=3.0";
import { createState } from "ags";

import { Clock } from "../common/Clock";
import { getWindowName } from "../utils";
import app from "ags/gtk3/app";

export const BarClock = (monitor: Gdk.Monitor) => {
	const calendarWindowName = getWindowName("calendar", monitor);
	const [calenderShown, setCalenderShown] = createState(false);

	const onClicked = () => {
		setCalenderShown(!calenderShown());
		app.get_window(calendarWindowName)?.set_visible(calenderShown());
	};

	return (
		<button
			class={calenderShown((v) => "BarClock" + (v ? " Active" : ""))}
			onClicked={onClicked}
		>
			<Clock />
		</button>
	);
};
