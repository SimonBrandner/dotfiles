import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import { Clock } from "common/Clock";
import { getWindowName } from "utils";

export const BarClock = (monitor: Gdk.Monitor) => {
	const calendarWindowName = getWindowName("calendar", monitor);
	const calenderShown = Variable(false);

	return Widget.Button({
		class_name: "BarClock",
		child: Clock(),
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
