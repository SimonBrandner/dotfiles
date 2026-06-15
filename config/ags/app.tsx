import app from "ags/gtk4/app";
import { Gdk } from "ags/gtk4";
import { AppLauncher } from "./popups/AppLauncher";
import { Bar } from "./bar/Bar";
import { Calendar } from "./calendar/Calendar";
import { Desktop } from "./desktop/Desktop";
import { NotificationsPopup } from "./popups/NotificationsPopup";
import { QuickSettings } from "./quick_settings/QuickSettings";
import { getPrimaryMonitorName } from "./utils";
import style from "./style.scss";
import { ProgressPopup } from "./popups/ProgressPopup";
import { createBinding, For, This } from "gnim";
import { lockScreen, unlockScreen } from "./lock_screen/LockScreen";

const createWindowsForPrimaryMonitor = () => {
	const monitors = app.get_monitors();
	const primaryMonitor =
		monitors.find(
			(monitor: Gdk.Monitor) => monitor.connector === getPrimaryMonitorName()
		) ?? monitors[0];

	NotificationsPopup(primaryMonitor);
	AppLauncher(primaryMonitor);
	ProgressPopup(primaryMonitor);
};

app.start({
	css: style,
	iconTheme: "Papirus",
	requestHandler(agrv: Array<string>, res: (response: string) => void) {
		const [command, ..._rest] = agrv;
		switch (command) {
			case "lock": {
				lockScreen();
				res("ok");
				break;
			}
			case "unlock": {
				unlockScreen();
				res("ok");
				break;
			}
		}
		res("Unknown command");
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
