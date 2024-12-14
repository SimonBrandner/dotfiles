import GLib from "gi://GLib";
import { Widget } from "astal/gtk3";
import { Variable } from "astal";

const TIME_FORMAT = "%H:%M:%S";
const DATE_FORMAT = "%Y-%m-%d";

const time = Variable("").poll(1000, () =>
	GLib.DateTime.new_now_local().format(TIME_FORMAT)
);
const date = Variable("").poll(1000, () =>
	GLib.DateTime.new_now_local().format(DATE_FORMAT)
);

export const Clock = () =>
	new Widget.Box({
		class_name: "Clock",
		child: new Widget.Box({
			hpack: "center",
			expand: true,
			vertical: true,
			children: [
				new Widget.Label({ class_name: "Time" }).hook(
					time,
					(self) => (self.label = time.get())
				),
				new Widget.Label({ class_name: "Date" }).hook(
					date,
					(self) => (self.label = date.get())
				),
			],
		}),
	});
