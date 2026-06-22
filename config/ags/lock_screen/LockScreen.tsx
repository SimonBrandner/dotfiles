import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { exec } from "ags/process";
import Gtk from "gi://Gtk?version=4.0";
import { Clock } from "../common/Clock";
import { getDisplay, getWallpaperPath, getWindowName } from "../utils";
import Gtk4SessionLock from "gi://Gtk4SessionLock";
import AstalAuth from "gi://AstalAuth?version=0.1";
import Gio from "gi://Gio?version=2.0";
import { createRoot, onCleanup } from "gnim";

export type CursorPosition = {
	x: number;
	y: number;
};

const SCREENSHOT_PATH = `/tmp/lockscreen-screenshot`;
const GRACE_PERIOD = 5000; // 5s

let lockAndTime: [Gtk4SessionLock.Instance, number] | undefined = undefined;

const getScreenshotPath = (monitor: Gdk.Monitor) => {
	return `${SCREENSHOT_PATH}-${monitor.connector}`;
};

const takeScreenshot = (monitor: Gdk.Monitor): string => {
	const screenshotPath = getScreenshotPath(monitor);
	exec(`bash -c "grim -o ${monitor.connector} -t png -l 0 ${screenshotPath}"`);
	return screenshotPath;
};

const createLockScreenWindow = (
	screenshotPath: string,
	monitor: Gdk.Monitor
): void => {
	app.add_window(
		createRoot((dispose) => {
			const window = LockScreenWindow(screenshotPath, monitor) as Gtk.Window;
			window.connect("destroy", dispose);
			showLockScreenWindow(window, monitor);
			return window;
		})
	);
};

const showLockScreenWindow = (window: Gtk.Window, monitor: Gdk.Monitor) => {
	if (lockAndTime === undefined) return;

	lockAndTime[0].assign_window_to_monitor(window, monitor);
	window.show();
};

const unlockIfInGracePeriod = () => {
	if (lockAndTime === undefined) return;
	if (lockAndTime[1] + GRACE_PERIOD < Date.now()) return;

	unlockScreen();
};

export const unlockScreen = () => {
	if (lockAndTime === undefined) return;

	lockAndTime[0].unlock();
	lockAndTime = undefined;
};

export const lockScreen = () => {
	if (lockAndTime !== undefined) return;

	const lock = Gtk4SessionLock.Instance.new();
	const time = Date.now();
	lockAndTime = [lock, time];
	lock.lock();
	app.monitors.forEach((monitor) => {
		const screenshotPath = takeScreenshot(monitor);
		createLockScreenWindow(screenshotPath, monitor);
	});

	getDisplay()
		.get_monitors()
		.connect(
			"items-changed",
			(
				self: Gio.ListModel,
				position: number,
				_removed: number,
				added: number
			) => {
				for (let i = position; i < position + added; i++) {
					const monitor = self.get_item(i) as Gdk.Monitor;
					if (!monitor) continue;
					createLockScreenWindow(getWallpaperPath(), monitor);
				}
			}
		);
};

const LockScreenForm = () => (
	<box
		class="LockScreenForm"
		hexpand
		vexpand
		orientation={Gtk.Orientation.VERTICAL}
		valign={Gtk.Align.CENTER}
		halign={Gtk.Align.CENTER}
	>
		<Clock />
		<entry
			class="Password"
			halign={Gtk.Align.CENTER}
			valign={Gtk.Align.END}
			xalign={0.5}
			visibility={false}
			onNotifyText={unlockIfInGracePeriod}
			onActivate={(self) => {
				self.sensitive = false;

				AstalAuth.Pam.authenticate(self.text ?? "", (_, task) => {
					try {
						AstalAuth.Pam.authenticate_finish(task);
						unlockScreen();
					} catch (e: any) {
						print(`Error: ${e.message}`);
						self.text = "";
						self.placeholder_text = e.message;
						self.sensitive = true;
					}
				});
			}}
			onRealize={(self) => self.grab_focus()}
		></entry>
	</box>
);

const LockScreenWindow = (screenshotPath: string, monitor: Gdk.Monitor) => {
	let lockedCursorPosition: CursorPosition | undefined = undefined;
	return (
		<Gtk.Window
			name={getWindowName("lockscreen", monitor)}
			$={(self) => onCleanup(() => self.destroy())}
		>
			<box hexpand vexpand visible>
				<Gtk.EventControllerKey onKeyPressed={unlockIfInGracePeriod} />
				<Gtk.EventControllerMotion
					onMotion={(_, x: number, y: number) => {
						if (lockedCursorPosition === undefined) {
							lockedCursorPosition = { x, y };
							return;
						}
						if (lockedCursorPosition.x === x && lockedCursorPosition.y === y) {
							return;
						}
						unlockIfInGracePeriod();
					}}
				/>
				<box
					class="LockScreen"
					orientation={Gtk.Orientation.VERTICAL}
					hexpand
					vexpand
				>
					<overlay hexpand vexpand>
						<Gtk.Picture
							class={"Background"}
							hexpand
							vexpand
							contentFit={Gtk.ContentFit.COVER}
							file={Gio.file_new_for_path(screenshotPath)}
						/>
						<LockScreenForm $type="overlay" />
					</overlay>
				</box>
			</box>
		</Gtk.Window>
	);
};
