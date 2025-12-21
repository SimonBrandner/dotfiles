import Gtk from "gi://Gtk?version=3.0";
import { createPoll } from "ags/time";

const TIME_FORMAT = "%H:%M:%S";
const DATE_FORMAT = "%Y-%m-%d";

const get_time_date = (format: string) => `date +"${format}"`;

export const Clock = () => {
	const time = createPoll("NO TIME", 1000, get_time_date(TIME_FORMAT));
	const date = createPoll("NO DATE", 1000, get_time_date(DATE_FORMAT));

	return (
		<box class="Clock">
			<box
				halign={Gtk.Align.CENTER}
				expand={true}
				orientation={Gtk.Orientation.VERTICAL}
			>
				<label class="Time" label={time}></label>
				<label class="Date" label={date}></label>
			</box>
		</box>
	);
};
