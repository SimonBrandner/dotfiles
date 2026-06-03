import GObject, { register, getter } from "ags/gobject";
import { exec, subprocess } from "ags/process";
import { deepEqual } from "../utils";

export type NiriWorkspace = {
	id: number;
	idx: number;
	name: string | null;
	output: string;
	is_active: boolean;
	is_focused: boolean;
	is_urgent: boolean;
	active_window_id: number | null;
};

export type NiriWindow = {
	id: number;
	title: string;
	app_id: string;
	pid: number;
	is_focused: boolean;
	is_floating: boolean;
	is_urgent: boolean;
	workspace_id: number;
	layout: {
		pos_in_scrolling_layout: [number, number] | null;
		tile_size: [number, number];
		window_size: [number, number];
	};
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

	#windows: Array<NiriWindow> = [];
	@getter(Object)
	get windows() {
		return this.#windows;
	}

	public focusWindow(windowId: number): void {
		exec(`niri msg action focus-window --id ${windowId}`);
	}

	private updateWorkspaces() {
		const newWorkspaces: Array<NiriWorkspace> = JSON.parse(
			exec("niri msg --json workspaces")
		);
		if (!deepEqual(this.#workspaces, newWorkspaces)) {
			this.#workspaces = newWorkspaces;
			this.notify("workspaces");
		}
	}

	private updateWindows() {
		const newWindows: Array<NiriWindow> = JSON.parse(
			exec("niri msg --json windows")
		);
		if (!deepEqual(this.#windows, newWindows)) {
			this.#windows = newWindows;
			this.notify("windows");
		}
	}

	private onEvent() {
		this.updateWorkspaces();
		this.updateWindows();
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
