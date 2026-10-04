import Gtk from "gi://Gtk?version=4.0";
import { createPoll } from "ags/time";
import GLib from "gi://GLib?version=2.0";

const TIME_FORMAT = "%H:%M:%S";
const DATE_FORMAT = "%Y-%m-%d";
const ERROR_STRING = "NO TIME";

const get_time_date = (format: string) =>
	GLib.DateTime.new_now_local().format(format) ?? ERROR_STRING;

export const Clock = () => {
	const time = createPoll(ERROR_STRING, 1000, () => get_time_date(TIME_FORMAT));
	const date = createPoll(ERROR_STRING, 1000, () => get_time_date(DATE_FORMAT));

	return (
		<box
			class="Clock"
			hexpand
			halign={Gtk.Align.CENTER}
			orientation={Gtk.Orientation.VERTICAL}
		>
			<label class="Time" label={time}></label>
			<label class="Date" label={date}></label>
		</box>
	);
};
