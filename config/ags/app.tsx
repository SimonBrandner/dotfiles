import app from "ags/gtk3/app";
import { Gdk } from "ags/gtk3";
import { AppLauncher } from "./popups/AppLauncher";
import { Bar } from "./bar/Bar";
import { Calendar } from "./calendar/Calendar";
import { Desktop } from "./desktop/Desktop";
import { NotificationsPopup } from "./popups/NotificationsPopup";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { getMonitorName, getPrimaryMonitorName } from "./utils";
import style from "./style.scss";
import { ProgressPopup } from "./popups/ProgressPopup";
import { createBinding, For, This } from "gnim";

const createWindowsForPrimaryMonitor = () => {
	const monitors = app.get_monitors();
	const primaryMonitor =
		monitors.find(
			(monitor: Gdk.Monitor) =>
				getMonitorName(monitor) === getPrimaryMonitorName()
		) ?? monitors[0];

	NotificationsPopup(primaryMonitor);
	AppLauncher(primaryMonitor);
	ProgressPopup(primaryMonitor);
};

app.start({
	css: style,
	iconTheme: "Papirus",
	requestHandler(_, res) {
		res("ok");
	},
	main() {
		createWindowsForPrimaryMonitor();

		return (
			<For each={createBinding(app, "monitors")}>
				{(monitor: Gdk.Monitor) => (
					<This this={app}>
						<QuickSettings monitor={monitor} />
						<Bar monitor={monitor} />
						<Desktop monitor={monitor} />
						<Calendar monitor={monitor} />
					</This>
				)}
			</For>
		);
	},
});
