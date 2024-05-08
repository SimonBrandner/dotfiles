import { Clock } from "common/Clock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Lock from "gi://GtkSessionLock?version=0.1";
import { getDisplay, getMonitorName, getMonitors, getWindowName } from "utils";

const SCREENSHOT_PATH = `/tmp/lockscreen-screenshot`;
const TRANSITION_TIME = 750;

const lock = Lock.prepare_lock();
let locked = false;
let lockScreenWindows: Array<Gtk.Window> = [];

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

const LockScreenWindow = (monitor: Gdk.Monitor) => {
	return new Gtk.Window({
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
					child: LockScreenForm(),
					setup: (self) => {
						takeBlurredScreenshot(monitor).then((screenshotPath) => {
							self.css = `background-image: url("${screenshotPath}");`;
						});
					},
				}),
			}).on("realize", (self) => Utils.idle(() => (self.reveal_child = true))),
		}),
	});
};

const takeBlurredScreenshot = async (monitor: Gdk.Monitor): Promise<string> => {
	const monitorName = getMonitorName(monitor);
	const screenshotPath = `${SCREENSHOT_PATH}-${monitorName}`;

	// We use PPM because it does not compress the image making grim much
	// faster. Also, scaling the image somewhat improves performance of blurring
	// the image
	await Utils.execAsync(
		`bash -c "grim -o ${monitorName} -t ppm - | convert - -encoding ppm -scale 10% -blur 0x01 -resize 1000% ${screenshotPath}"`,
	);
	return screenshotPath;
};

const createLockScreenWindow = (monitor: Gdk.Monitor) => {
	const window = LockScreenWindow(monitor);
	lockScreenWindows.push(window);
	lock.new_surface(window as any, monitor);
	window.show();
};

const onLocked = () => {
	locked = true;

	const display = getDisplay();
	const monitors = getMonitors();

	monitors.forEach((m) => createLockScreenWindow(m));
	display?.connect("monitor-added", (_, monitor) => {
		// This is an ugly hack necessary because Gdk is quicker at telling us
		// about the new monitor than the information traveling to us from Hyprland
		Utils.timeout(500, () => {
			createLockScreenWindow(monitor);
		});
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
	lockScreenWindows = [];
	Utils.timeout(TRANSITION_TIME, () => {
		lock.unlock_and_destroy();
		locked = false;
	});
};

export const lockScreen = () => {
	if (locked) return;
	lock.lock_lock();
};

lock.connect("locked", onLocked);
lock.connect("finished", onFinished);
Object.assign(globalThis, { lockScreen, unlockScreen });
