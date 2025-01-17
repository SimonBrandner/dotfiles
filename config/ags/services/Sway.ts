import GObject, { register, property } from "astal/gobject";
import { exec } from "astal/process";
import { interval } from "../../../../.local/share/ags";
import { deepEqual } from "../utils";

const REFRESH_RATE = 100;

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

			// This is an awful hack but it works
			interval(REFRESH_RATE, () => {
				const workspaces = JSON.parse(exec("swaymsg -r -t get_workspaces"));
				if (deepEqual(workspaces, this.#workspaces)) return;

				this.#workspaces = workspaces;
				this.notify("workspaces");
			});
		} catch {
			throw "Sway not running";
		}
	}
}
