import GObject, { register, getter } from "ags/gobject";
import { exec, execAsync } from "ags/process";

export type Workspace = {
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

	#workspaces: Array<Workspace> = [];
	@getter(Object)
	get workspaces() {
		return this.#workspaces;
	}

	constructor() {
		super();

		try {
			exec("swaymsg --version");

			const watchLoop = () => {
				this.#workspaces = JSON.parse(exec("swaymsg -r -t get_workspaces"));
				this.notify("workspaces");
				execAsync("swaymsg -qt subscribe '[ \"workspace\" ]'").then(() => {
					watchLoop();
				});
			};
			watchLoop();
		} catch (error) {
			throw "Sway service error: " + error;
		}
	}
}
