import GObject, { register, getter } from "ags/gobject";
import { execAsync } from "ags/process";

export type SwayWorkspace = {
	name: string;
	focused: boolean;
};

@register()
export default class Sway extends GObject.Object {
	static instance: Sway;
	static get_default() {
		if (!this.instance) this.instance = new Sway();
		return this.instance;
	}

	#running: Boolean = false;
	@getter(Boolean)
	get running() {
		return this.#running;
	}

	#workspaces: Array<SwayWorkspace> = [];
	@getter(Object)
	get workspaces() {
		return this.#workspaces;
	}

	public async focusWorkspace(name: string): Promise<void> {
		await execAsync(`swaymsg workspace ${name}`);
	}

	private async watchLoop(): Promise<void> {
		try {
			while (true) {
				this.#workspaces = JSON.parse(
					await execAsync("swaymsg -r -t get_workspaces")
				);
				this.#running = true;
				this.notify("workspaces");
				await execAsync("swaymsg -qt subscribe '[ \"workspace\" ]'");
			}
		} catch (error) {
			printerr(`Sway service failed: ${error}`);
			this.#running = false;
		}
	}

	constructor() {
		super();
		this.watchLoop();
	}
}
