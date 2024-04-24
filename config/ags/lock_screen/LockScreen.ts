import { Clock } from "common/Clock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Lock from "gi://GtkSessionLock?version=0.1";

const lock = Lock.prepare_lock();
let locked = false;

const LockScreenWindow = () =>
	new Gtk.Window({
		name: "lock-screen",
		child: Widget.Box({
			class_name: "LockScreen",
			vertical: true,
			expand: true,
			visible: true,
			child: Widget.Box({
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
			}),
		}),
	});

const createLockScreenWindow = (monitor: Gdk.Monitor) => {
	const win = LockScreenWindow();
	lock.new_surface(win as any, monitor);
	win.show();
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
	locked = false;
	lock.unlock_and_destroy();
};

export const lockScreen = () => {
	if (locked) return;
	lock.lock_lock();
};

lock.connect("locked", onLocked);
lock.connect("finished", onFinished);
Object.assign(globalThis, { lockScreen });
