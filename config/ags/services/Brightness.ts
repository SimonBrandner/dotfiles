const screen = Utils.exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");

class BrightnessService extends Service {
	static {
		Service.register(
			this,
			{
				screen: ["float"],
			},
			{
				screen: ["float", "rw"],
			},
		);
	}

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

		const brightness = `/sys/class/backlight/${screen}/brightness`;
		Utils.monitorFile(brightness, () => this.onChange());

		this.onChange();
	}

	private onChange() {
		this.#screen = Number(Utils.exec("brightnessctl get")) / this.#screenMax;
		this.changed("screen");
	}
}

export default new BrightnessService();
