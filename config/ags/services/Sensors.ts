import GObject, { register, getter } from "ags/gobject";
import { execAsync } from "ags/process";
import { sleep } from "../utils";

const SENSORS_POLL_RATE = 3000;

@register()
export default class Sensors extends GObject.Object {
	static instance: Sensors;
	static get_default() {
		if (!this.instance) this.instance = new Sensors();
		return this.instance;
	}

	#cpu: number | undefined = undefined;
	@getter(Number)
	get cpu() {
		return this.#cpu;
	}

	private parseCpu(data: any): void {
		const keys = Object.keys(data);

		const amdKey = keys.find(
			(k) => k.startsWith("k10temp") || k.startsWith("zenpower")
		);
		const intelKey = keys.find((k) => k.startsWith("coretemp"));

		let candidates = [];
		if (amdKey) {
			candidates.push(data[amdKey]?.["Tctl"]?.["temp1_input"]);
		}
		if (intelKey) {
			candidates.push(
				data[intelKey]?.["Package id 0"]?.["temp1_input"],
				data[intelKey]?.["Core 0"]?.["temp2_input"]
			);
		}

		const cpu = candidates.find((v) => v !== undefined);
		if (this.#cpu != cpu) {
			this.#cpu = cpu;
			this.notify("cpu");
		}
	}

	private parseData(data: any): void {
		this.parseCpu(data);
	}

	private async watchLoop(): Promise<void> {
		try {
			while (true) {
				this.parseData(JSON.parse(await execAsync("sensors -j")));
				await sleep(SENSORS_POLL_RATE);
			}
		} catch (error) {
			printerr(`Sensors service failed: ${error}`);
			this.#cpu = undefined;
			this.notify("cpu");
		}
	}

	constructor() {
		super();
		this.watchLoop();
	}
}
