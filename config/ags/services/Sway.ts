import GObject, { register, getter } from "ags/gobject";
import { exec, execAsync } from "ags/process";

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

	public focusWorkspace(name: string): void {
		exec(`swaymsg workspace ${name}`);
	}

	constructor() {
		super();

		try {
			const watchLoop = () => {
				this.#workspaces = JSON.parse(exec("swaymsg -r -t get_workspaces"));
				this.#running = true;
				this.notify("workspaces");
				execAsync("swaymsg -qt subscribe '[ \"workspace\" ]'").then(() => {
					watchLoop();
				});
			};
			watchLoop();
		} catch (error) {
			printerr(`Sway service failed: ${error}`);
			this.#running = false;
		}
	}
}
