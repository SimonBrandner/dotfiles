import { exec, execAsync, monitorFile } from "astal";

const screen = exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");

class BrightnessService {
	#screen = 0;
	#screenMax = Number(exec("brightnessctl max"));

	get screen() {
		return this.#screen;
	}

	set screen(percent) {
		if (percent < 0) percent = 0;
		if (percent > 1) percent = 1;

		execAsync(`brightnessctl set ${percent * 100}% -q`);
	}

	constructor() {
		const brightness = `/sys/class/backlight/${screen}/brightness`;
		monitorFile(brightness, () => this.onChange());

		this.onChange();
	}

	private onChange() {
		this.#screen = Number(exec("brightnessctl get")) / this.#screenMax;
		this.changed("screen");
	}
}

export default new BrightnessService();
