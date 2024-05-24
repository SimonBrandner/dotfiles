import GLib from "gi://GLib";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { getWindowName } from "utils";

const TIME_FORMAT = "%H:%M:%S";
const DATE_FORMAT = "%Y-%m-%d";

const clock = Variable(GLib.DateTime.new_now_local(), {
	poll: [1000, () => GLib.DateTime.new_now_local()],
});
const time = Utils.derive([clock], (c) => c.format(TIME_FORMAT) || "");
const date = Utils.derive([clock], (c) => c.format(DATE_FORMAT) || "");

export const Clock = (monitor: Gdk.Monitor) => {
	const calendarWindowName = getWindowName("calendar", monitor);
	const calenderShown = Variable(false);

	return Widget.Button({
		class_name: "Clock",
		child: Widget.Box({
			vertical: true,
			children: [
				Widget.Label({ class_name: "Time" }).hook(
					time,
					(self) => (self.label = time.value),
				),
				Widget.Label({ class_name: "Date" }).hook(
					date,
					(self) => (self.label = date.value),
				),
			],
		}),
		on_clicked: () => {
			calenderShown.value = !calenderShown.value;
		},
	})
		.hook(
			App,
			(self, name: string, visible: boolean) => {
				if (name !== calendarWindowName) return;
				calenderShown.value = visible;
			},
			"window-toggled",
		)
		.hook(calenderShown, (self) => {
			self.toggleClassName("Active", calenderShown.value);
			calenderShown.value
				? App.openWindow(calendarWindowName)
				: App.closeWindow(calendarWindowName);
		});
};
