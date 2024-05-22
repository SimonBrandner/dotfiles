import { Clock } from "common/Clock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Lock from "gi://GtkSessionLock?version=0.1";
import {
	getDisplay,
	getMonitorName,
	getMonitors,
	getPrimaryMonitor,
	getWallpaperPath,
	getWindowName,
} from "utils";

const SCREENSHOT_PATH = `/tmp/lockscreen-screenshot`;
const TRANSITION_TIME = 1000;

let lockScreenWindows = new Set<Gtk.Window>();
let lockedMonitors = new Set<Gdk.Monitor>();

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
		`bash -c "grim -o ${monitorName} -t ppm - | convert - -encoding ppm -scale 5% -blur 0x01 -resize 2000% PPM:${screenshotPath}"`,
	);
	return screenshotPath;
};

const createLockScreenWindow = (
	monitor: Gdk.Monitor,
	screenshotPath: string,
) => {
	const window = LockScreenWindow(
		screenshotPath,
		monitor === getPrimaryMonitor(),
	);
	lockScreenWindows.add(window);
	lock.new_surface(window as any, monitor);
	window.show();
};

const onLocked = () => {
	lockedMonitors.forEach((m) =>
		createLockScreenWindow(m, `${getScreenshotPath(m)}`),
	);

	getDisplay()?.connect("monitor-added", (_, monitor) => {
		lockedMonitors.add(monitor);
		// We cannot take a screenshot of a locked screen, so we use the
		// wallpaper
		createLockScreenWindow(monitor, getWallpaperPath());
	});
};

const onFinished = () => {
	lock.destroy();
};

const unlockScreen = () => {
	for (const window of lockScreenWindows) {
		// @ts-ignore
		window.child.child.reveal_child = false;
	}
	Utils.timeout(TRANSITION_TIME, () => {
		lock.unlock_and_destroy();
	});
	lockScreenWindows.clear();
	lockedMonitors.clear();
};

export const lockScreen = async () => {
	if (lockedMonitors.size !== 0) return;

	// We need to take screenshots before lock.lock_lock() to avoid a red
	// screen, if taking the screenshots took to long
	await Promise.all(
		getMonitors().map(async (monitor) => {
			lockedMonitors.add(monitor);
			await takeBlurredScreenshot(monitor);
		}),
	);
	lock.lock_lock();
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
			}).on("realize", (entry) => entry.grab_focus()),
		],
	});

const LockScreenWindow = (screenshotPath: string, showForm: boolean) =>
	new Gtk.Window({
		name: getWindowName("lockscreen"),
		child: Widget.Box({
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
		}),
	});

const lock = Lock.prepare_lock();

lock.connect("locked", onLocked);
lock.connect("finished", onFinished);
Object.assign(globalThis, { lockScreen, unlockScreen });
