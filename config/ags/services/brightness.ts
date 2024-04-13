// Taken from https://raw.githubusercontent.com/Aylur/dotfiles/main/ags/service/brightness.ts

//const get = (args: string) => Number(Utils.exec(`brightnessctl ${args}`));
//const screen = await Utils.execAsync(
//	`bash -c ls -w1 /sys/class/backlight | head -1`,
//);
//const keyboard = await Utils.execAsync(
//	`bash -c ls -w1 /sys/class/leds | head -1`,
//);

//class Brightness extends Service {
//	static {
//		Service.register(
//			this,
//			{},
//			{
//				screen: ["float", "rw"],
//				keyboard: ["int", "rw"],
//			},
//		);
//	}

//#keyboardMax = get(`--device ${keyboard} max`);
//#keyboard = get(`--device ${keyboard} get`);
//#screenMax = get("max");
//#screen = get("get") / get("max");

//get keyboard() {
//	//return this.#keyboard;
//}
//get screen() {
//	return this.#screen;
//}

//set keyboard(value) {
//if (value < 0 || value > this.#keyboardMax) return;

//Utils.execAsync(`brightnessctl -d ${keyboard} s ${value} -q`).then(() => {
//	this.#keyboard = value;
//	this.changed("kbd");
//});
//}

//set screen(percent) {
//	if (percent < 0) percent = 0;
//
//	if (percent > 1) percent = 1;
//
//	//Utils.execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(
//	//	() => {
//	//		this.#screen = percent;
//	//		this.changed("screen");
//	//	},
//	//);
//}

//	constructor() {
//		super();

//const screenPath = `/sys/class/backlight/${screen}/brightness`;
//const keyboardPath = `/sys/class/leds/${keyboard}/brightness`;
//
//Utils.monitorFile(screenPath, async (f) => {
//	const v = await Utils.readFileAsync(f);
//	this.#screen = Number(v) / this.#screenMax;
//	this.changed("screen");
//});
//
//Utils.monitorFile(keyboardPath, async (f) => {
//	const v = await Utils.readFileAsync(f);
//	this.#keyboard = Number(v) / this.#keyboardMax;
//	this.changed("keyboard");
//});
//	}
//}
//
//export default new Brightness();

class BrightnessService extends Service {
	static {
		Service.register(
			this,
			{
				// 'name-of-signal': [type as a string from GObject.TYPE_<type>],
				screen: ["float"],
			},
			{
				// 'kebab-cased-name': [type as a string from GObject.TYPE_<type>, 'r' | 'w' | 'rw']
				// 'r' means readable
				// 'w' means writable
				// guess what 'rw' means
				screen: ["float", "rw"],
			},
		);
	}

	// this Service assumes only one device with backlight
	#interface = Utils.exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");

	#screen = 0;
	#screenMax = Number(Utils.exec("brightnessctl max"));

	get screen() {
		return this.#screen;
	}

	set screen(percent) {
		if (percent < 0) percent = 0;

		if (percent > 1) percent = 1;

		Utils.execAsync(`brightnessctl set ${percent * 100}% -q`);
	}

	constructor() {
		super();

		const brightness = `/sys/class/backlight/${this.#interface}/brightness`;
		Utils.monitorFile(brightness, () => this.onChange());

		this.onChange();
	}

	private onChange() {
		this.#screen = Number(Utils.exec("brightnessctl get")) / this.#screenMax;

		// signals have to be explicitly emitted
		this.emit("changed"); // emits "changed"
		this.notify("screen"); // emits "notify::screen-value"

		// or use Service.changed(propName: string) which does the above two
		// this.changed('screen-value');

		// emit screen-changed with the percent as a parameter
		this.emit("screen", this.#screen);
	}
}

export default new BrightnessService();
