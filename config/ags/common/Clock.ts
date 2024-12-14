import GLib from "gi://GLib";
import { Variable } from "astal";

const TIME_FORMAT = "%H:%M:%S";
const DATE_FORMAT = "%Y-%m-%d";

const clock = Variable(GLib.DateTime.new_now_local(), {
	poll: [1000, () => GLib.DateTime.new_now_local()],
});
const time = Variable.derive([clock], (c) => c.format(TIME_FORMAT) || "");
const date = Variable.derive([clock], (c) => c.format(DATE_FORMAT) || "");

export const Clock = () =>
	Widget.Box({
		class_name: "Clock",
		child: Widget.Box({
			hpack: "center",
			expand: true,
			vertical: true,
			children: [
				Widget.Label({ class_name: "Time" }).hook(
					time,
					(self) => (self.label = time.value)
				),
				Widget.Label({ class_name: "Date" }).hook(
					date,
					(self) => (self.label = date.value)
				),
			],
		}),
	});
