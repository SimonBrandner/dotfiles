import { Clock } from "common/Clock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Lock from "gi://GtkSessionLock?version=0.1";
import { getWindowName } from "utils";

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

const LockScreenWindow = (screenshotPath: string) => {
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
					css: `background-image: url("${screenshotPath}");`,
					vertical: true,
					expand: true,
					visible: true,
					child: LockScreenForm(),
				}),
			}).on("realize", (self) => Utils.idle(() => (self.reveal_child = true))),
		}),
	});
};

const takeBlurredScreenshot = (): string => {
	// We use PPM because it does not compress the image making grim much
	// faster. Also, scaling the image somewhat improves performance of blurring
	// the image
	Utils.exec(
		`bash -c "grim -t ppm - | convert - -encoding ppm -scale 10% -blur 0x01 -resize 1000% ${SCREENSHOT_PATH}"`,
	);
	return SCREENSHOT_PATH;
};

const createLockScreenWindow = (monitor: Gdk.Monitor) => {
	const screenshotPath = takeBlurredScreenshot();
	const window = LockScreenWindow(screenshotPath);
	lockScreenWindows.push(window);
	lock.new_surface(window as any, monitor);
	window.show();
};

const onLocked = () => {
	locked = true;
	const display = Gdk.Display.get_default();

	for (let m = 0; m < (display?.get_n_monitors() ?? 0); m++) {
		const monitor = display?.get_monitor(m);

		if (monitor) {
			createLockScreenWindow(monitor);
		}
	}
	display?.connect("monitor-added", (_, monitor) => {
		createLockScreenWindow(monitor);
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
