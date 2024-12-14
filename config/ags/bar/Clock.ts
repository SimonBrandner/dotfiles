import { Widget, App, Gdk } from "astal/gtk3";
import { Variable } from "astal";

import { Clock } from "../common/Clock";
import { getWindowName } from "../utils";

export const BarClock = (monitor: Gdk.Monitor) => {
	const calendarWindowName = getWindowName("calendar", monitor);
	const calenderShown = Variable(false);

	return new Widget.Button({
		class_name: "BarClock",
		child: Clock(),
		on_clicked: () => {
			calenderShown.set(!calenderShown.get());
		},
	})
		.hook(App, "window-toggled", (_, name: string, visible: boolean) => {
			if (name !== calendarWindowName) return;
			calenderShown.set(visible);
		})
		.hook(calenderShown, (self) => {
			self.toggleClassName("Active", calenderShown.get());
			App.get_window(calendarWindowName).set_visible(calenderShown.get());
		});
};
