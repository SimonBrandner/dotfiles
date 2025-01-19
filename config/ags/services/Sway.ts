import GObject, { register, property } from "astal/gobject";
import { exec, execAsync } from "astal/process";

export type Workspace = {
	name: string;
	focused: boolean;
};

@register({ GTypeName: "Sway" })
export default class Sway extends GObject.Object {
	static instance: Sway;
	static get_default() {
		if (!this.instance) this.instance = new Sway();
		return this.instance;
	}

	#workspaces: Array<Workspace> = [];
	@property(Object)
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
