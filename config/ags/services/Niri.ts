import GObject, { register, getter } from "ags/gobject";
import { exec, subprocess } from "ags/process";
import { deepEqual } from "../utils";

export type NiriWorkspace = {
	id: number;
	idx: number;
	name: string;
	output: string;
	is_active: boolean;
	is_focused: boolean;
	is_urgent: boolean;
	active_window_id: number;
};

@register()
export default class Niri extends GObject.Object {
	static instance: Niri;
	static get_default() {
		if (!this.instance) this.instance = new Niri();
		return this.instance;
	}

	#running: Boolean = false;
	@getter(Boolean)
	get running() {
		return this.#running;
	}

	#workspaces: Array<NiriWorkspace> = [];
	@getter(Object)
	get workspaces() {
		return this.#workspaces;
	}

	private updateWorkspaces() {
		const newWorkspaces: Array<NiriWorkspace> = JSON.parse(
			exec("niri msg --json workspaces")
		);
		if (!deepEqual(this.workspaces, newWorkspaces)) {
			print("Updated workspaces");
			this.#workspaces = newWorkspaces;
			this.notify("workspaces");
		}
	}

	private onEvent() {
		this.updateWorkspaces();
	}

	constructor() {
		super();

		try {
			this.updateWorkspaces();
			const process = subprocess("niri msg --json event-stream");
			process.connect("stdout", (_, event) => {
				this.onEvent();
			});
			process.connect("stderr", (_, error) => {
				printerr(`Niri services gave an error: ${error}`);
			});
			process.connect("exit", () => {
				this.#running = false;
			});
			this.#running = true;
		} catch (error) {
			this.#running = false;
			printerr(`Niri service failed: ${error}`);
		}
	}
}
