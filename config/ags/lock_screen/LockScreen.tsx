import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { exec } from "ags/process";
import Gtk from "gi://Gtk?version=4.0";
import { Clock } from "../common/Clock";
import { getWallpaperPath, getWindowName } from "../utils";
import Gtk4SessionLock from "gi://Gtk4SessionLock";
import AstalAuth from "gi://AstalAuth?version=0.1";
import Gio from "gi://Gio?version=2.0";
import { createRoot, onCleanup } from "gnim";
import { idle } from "ags/time";

export type CursorPosition = {
	x: number;
	y: number;
};

const SCREENSHOT_PATH = `/tmp/lockscreen-screenshot`;
const GRACE_PERIOD = 5000; // 5s
const TRANSITION_DURATION = 1000; // 1s

const monitorScreenshots: Map<Gdk.Monitor, string> = new Map();

let lockedTime: number | undefined = undefined;
let sessionLockInstance: Gtk4SessionLock.Instance =
	Gtk4SessionLock.Instance.new();

const onLockLocked = (): void => {
	print("Screen locked");
};

const onLockUnlocked = (): void => {
	lockedTime = undefined;
	monitorScreenshots.clear();
	print("Screen unlocked");
};

const onLockFailed = (): void => {
	printerr("Locking failed");
};

const onLockMonitor = (
	_: Gtk4SessionLock.Instance,
	monitor: Gdk.Monitor
): void => {
	const imagePath = monitorScreenshots.get(monitor) ?? getWallpaperPath();
	createLockScreenWindow(imagePath, monitor);
	print(`Monitor ${monitor.connector} added to lock with image ${imagePath}`);
};

const getScreenshotPath = (monitor: Gdk.Monitor): string => {
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
	sessionLockInstance.assign_window_to_monitor(window, monitor);
	window.show();
};

const unlockIfInGracePeriod = () => {
	if (!lockedTime) return;
	if (lockedTime + GRACE_PERIOD < Date.now()) return;

	unlockScreen();
};

export const unlockScreen = () => {
	sessionLockInstance.unlock();
};

export const lockScreen = () => {
	if (sessionLockInstance.is_locked()) return;

	lockedTime = Date.now();
	app.monitors.forEach((monitor) => {
		monitorScreenshots.set(monitor, takeScreenshot(monitor));
	});
	sessionLockInstance.lock();
};

const LockScreenForm = () => {
	let entryReference: Gtk.Entry | null = null;

	const onActivate = (self: Gtk.Entry): void => {
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
				self.grab_focus();
			}
		});
	};

	const onKeyPressed = (_: Gtk.EventControllerKey, keyValue: number): void => {
		if (keyValue === Gdk.KEY_Escape && entryReference !== null) {
			entryReference.text = "";
		}
	};

	return (
		<box
			class="LockScreenForm"
			hexpand
			vexpand
			orientation={Gtk.Orientation.VERTICAL}
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.FILL}
		>
			<Clock />
			<entry
				hexpand
				class="Password"
				halign={Gtk.Align.FILL}
				valign={Gtk.Align.END}
				xalign={0.5}
				visibility={false}
				onNotifyText={unlockIfInGracePeriod}
				onActivate={onActivate}
				onRealize={(self) => self.grab_focus()}
				$={(self) => (entryReference = self)}
			>
				<Gtk.EventControllerKey onKeyPressed={onKeyPressed} />
			</entry>
		</box>
	);
};

const LockScreenWindow = (screenshotPath: string, monitor: Gdk.Monitor) => {
	let lockedCursorPosition: CursorPosition | undefined = undefined;

	const onMotion = (
		_: Gtk.EventControllerMotion,
		x: number,
		y: number
	): void => {
		if (lockedCursorPosition === undefined) {
			lockedCursorPosition = { x, y };
			return;
		}
		if (lockedCursorPosition.x === x && lockedCursorPosition.y === y) {
			return;
		}

		// This is a hack to let GTK handle the motion gracefully
		setTimeout(() => {
			unlockIfInGracePeriod();
		});
	};

	const onRealize = (self: Gtk.Revealer): void => {
		idle(() => {
			self.revealChild = true;
		});
	};

	return (
		<Gtk.Window
			name={getWindowName("lockscreen", monitor)}
			$={(self) => onCleanup(() => self.destroy())}
		>
			<box hexpand vexpand visible>
				<Gtk.EventControllerKey onKeyPressed={unlockIfInGracePeriod} />
				<Gtk.EventControllerMotion onMotion={onMotion} />
				<box
					class="LockScreen"
					orientation={Gtk.Orientation.VERTICAL}
					hexpand
					vexpand
				>
					<overlay hexpand vexpand>
						<Gtk.Picture
							hexpand
							vexpand
							contentFit={Gtk.ContentFit.COVER}
							file={Gio.file_new_for_path(screenshotPath)}
						/>
						<Gtk.Revealer
							$type="overlay"
							hexpand
							vexpand
							transitionType={Gtk.RevealerTransitionType.CROSSFADE}
							transitionDuration={TRANSITION_DURATION}
							onRealize={onRealize}
						>
							<overlay hexpand vexpand>
								<Gtk.Picture
									class={"Blurred"}
									hexpand
									vexpand
									contentFit={Gtk.ContentFit.COVER}
									file={Gio.file_new_for_path(getWallpaperPath())}
								/>
								<LockScreenForm $type="overlay" />
							</overlay>
						</Gtk.Revealer>
					</overlay>
				</box>
			</box>
		</Gtk.Window>
	);
};

sessionLockInstance.connect("locked", onLockLocked);
sessionLockInstance.connect("unlocked", onLockUnlocked);
sessionLockInstance.connect("failed", onLockFailed);
sessionLockInstance.connect("monitor", onLockMonitor);
if (sessionLockInstance.is_locked()) onLockLocked();
