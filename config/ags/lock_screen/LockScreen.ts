import { Clock } from "common/Clock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Lock from "gi://GtkSessionLock?version=0.1";
import {
	CursorPosition,
	getCursorPosition,
	getDisplay,
	getMonitorName,
	getMonitors,
	getPrimaryMonitor,
	getWallpaperPath,
	getWindowName,
} from "utils";

const SCREENSHOT_PATH = `/tmp/lockscreen-screenshot`;
const TRANSITION_TIME = 1000; // 1s
const UNLOCK_WITHOUT_PASSWORD_INTERVAL = 5000; // 5s

let lockedCursorPosition: CursorPosition | undefined = undefined;
let lockedTime: number | undefined = undefined;
let lockedMonitorsAndWindows = new Set<{
	monitor: Gdk.Monitor;
	window: Gtk.Window;
}>();

const getScreenshotPath = (monitor: Gdk.Monitor) => {
	return `${SCREENSHOT_PATH}-${getMonitorName(monitor)}`;
};

const takeBlurredScreenshot = async (monitor: Gdk.Monitor): Promise<string> => {
	const monitorName = getMonitorName(monitor);
	const screenshotPath = getScreenshotPath(monitor);

	// We use PPM because it does not compress the image making grim much
	// faster. Also, scaling the image somewhat improves performance of blurring
	// the image
	await Utils.execAsync(
		`bash -c "grim -o ${monitorName} -t ppm - | convert - -encoding ppm -scale 5% -blur 0x01 -resize 2000% PPM:${screenshotPath}"`
	);
	return screenshotPath;
};

const showLockScreenWindow = (window: Gtk.Window, monitor: Gdk.Monitor) => {
	lock.new_surface(window as any, monitor);
	window.show();
};

const onFinished = () => {
	lock.destroy();
};

const unlockScreenIfInUnlockWithoutPasswordInterval = () => {
	if (!lockedTime) return;
	if (lockedTime + UNLOCK_WITHOUT_PASSWORD_INTERVAL < Date.now()) return;

	unlockScreen();
};

const unlockScreen = () => {
	lockedTime = undefined;
	lockedCursorPosition = undefined;

	for (const { window } of lockedMonitorsAndWindows) {
		// @ts-ignore
		window.child.child.reveal_child = false;
	}
	Utils.timeout(TRANSITION_TIME, () => {
		lock.unlock_and_destroy();
	});
	lockedMonitorsAndWindows.clear();
};

export const lockScreen = async () => {
	// Some monitors are already locked, do nothing
	if (lockedMonitorsAndWindows.size !== 0) return;

	// We try to do everything we can, before actually locking the screen to
	// avoid having the screen flash red
	await Promise.all(
		getMonitors().map(async (monitor) => {
			const screenshotPath = await takeBlurredScreenshot(monitor);
			const window = LockScreenWindow(
				screenshotPath,
				monitor === getPrimaryMonitor()
			);
			lockedMonitorsAndWindows.add({ monitor, window });
		})
	);
	lock.lock_lock();

	lockedTime = Date.now();
	lockedCursorPosition = getCursorPosition();

	lockedMonitorsAndWindows.forEach(({ window, monitor }) =>
		showLockScreenWindow(window, monitor)
	);

	getDisplay()?.connect("monitor-added", (_, monitor) => {
		// We cannot take a screenshot of a locked screen, so we use the
		// wallpaper
		// We also assume that this won't be the primary monitor since it's just
		// been connected
		const window = LockScreenWindow(getWallpaperPath(), false);
		lockedMonitorsAndWindows.add({ window, monitor });
		showLockScreenWindow(window, monitor);
	});
};

const LockScreenForm = () =>
	Widget.Box({
		class_name: "LockScreenContent",
		expand: true,
		vertical: true,
		vpack: "center",
		hpack: "center",
		children: [
			Clock(),
			Widget.Entry({
				class_name: "Password",
				hpack: "center",
				vpack: "end",
				xalign: 0.5,
				visibility: false,
				placeholder_text: "Password",
				on_accept: (self) => {
					self.sensitive = false;

					Utils.authenticate(self.text ?? "")
						.then(unlockScreen)
						.catch((e) => {
							self.text = "";
							self.placeholder_text = e.message;
							self.sensitive = true;
						});
				},
			}).on("realize", (self) => self.grab_focus()),
		],
	});

const LockScreenWindow = (screenshotPath: string, showForm: boolean) =>
	new Gtk.Window({
		name: getWindowName("lockscreen"),
		child: Widget.EventBox({
			onHover: () => {
				const currentCursorPosition = getCursorPosition();
				if (!lockedCursorPosition) return;
				if (
					lockedCursorPosition.x === currentCursorPosition?.x &&
					lockedCursorPosition.y === currentCursorPosition?.y
				) {
					return;
				}

				unlockScreenIfInUnlockWithoutPasswordInterval();
			},
			expand: true,
			visible: true,
			child: Widget.Revealer({
				visible: true,
				reveal_child: false,
				transition: "crossfade",
				transition_duration: TRANSITION_TIME,
				child: Widget.Box({
					class_name: "LockScreen",
					vertical: true,
					expand: true,
					visible: true,
					child: Widget.Box({
						visible: showForm,
						child: LockScreenForm(),
					}),
					css: `background-image: url("${screenshotPath}");`,
				}),
			}).on("realize", (self) => Utils.idle(() => (self.reveal_child = true))),
		}).on("key-press-event", unlockScreenIfInUnlockWithoutPasswordInterval),
	});

const lock = Lock.prepare_lock();

lock.connect("finished", onFinished);
Object.assign(globalThis, { lockScreen, unlockScreen });
