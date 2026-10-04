import GObject, { register, getter } from "ags/gobject";
import { execAsync, Process, subprocess } from "ags/process";
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

type NiriWindowLayout = {
	pos_in_scrolling_layout: [number, number] | null;
	tile_size: [number, number];
	window_size: [number, number];
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
	layout: NiriWindowLayout;
};

export type NiriOutput = {
	name: string;
	make: string;
	model: string;
	serial: string;
	physical_size: [number, number];
	modes: Array<{
		width: number;
		height: number;
		refresh_rate: number;
		is_preferred: boolean;
	}>;
};

type NiriEvent = Partial<{
	WorkspacesChanged: {
		workspaces: Array<NiriWorkspace>;
	};
	WorkspaceUrgencyChanged: {
		id: number;
		urgent: boolean;
	};
	WorkspaceActivated: {
		id: number;
		focused: boolean;
	};
	WorkspaceActiveWindowChanged: {
		workspace_id: number;
		active_window_id: number | undefined;
	};
	WindowsChanged: {
		windows: Array<NiriWindow>;
	};
	WindowOpenedOrChanged: {
		window: NiriWindow;
	};
	WindowClosed: {
		id: number;
	};
	WindowFocusChanged: {
		id: number | undefined;
	};
	WindowFocusTimestampChanged: {
		id: number;
	};
	WindowUrgencyChanged: {
		id: number;
		urgent: boolean;
	};
	WindowLayoutsChanged: {
		changes: Array<[number, NiriWindowLayout]>;
	};
}>;

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

	#focusedOutput: NiriOutput | null = null;
	@getter(Object)
	get focusedOutput() {
		return this.#focusedOutput;
	}

	public async focusWorkspaceByName(name: string): Promise<void> {
		const idx = this.#workspaces.find((w) => w.name === name)?.idx;
		if (idx !== undefined) {
			await this.focusWorkspaceByIdx(idx);
		}
	}

	public async focusWorkspaceByIdx(idx: number): Promise<void> {
		await execAsync(`niri msg action focus-workspace "${idx}"`);
	}

	public async focusWindow(windowId: number): Promise<void> {
		await execAsync(`niri msg action focus-window --id ${windowId}`);
	}

	private async updateWorkspaces(): Promise<void> {
		const newWorkspaces: Array<NiriWorkspace> = JSON.parse(
			await execAsync("niri msg --json workspaces")
		);
		if (!deepEqual(this.#workspaces, newWorkspaces)) {
			this.#workspaces = newWorkspaces;
			this.notify("workspaces");
		}
	}

	private async updateWindows(): Promise<void> {
		const newWindows: Array<NiriWindow> = JSON.parse(
			await execAsync("niri msg --json windows")
		);
		if (!deepEqual(this.#windows, newWindows)) {
			this.#windows = newWindows;
			this.notify("windows");
		}
	}

	private async updateFocusedOutput(): Promise<void> {
		const focusedOutput: NiriOutput = JSON.parse(
			await execAsync("niri msg --json focused-output")
		);
		if (!deepEqual(this.#focusedOutput, focusedOutput)) {
			this.#focusedOutput = focusedOutput;
			this.notify("focused-output");
		}
	}

	private onEvent(event: NiriEvent) {
		for (const k in event) {
			const key = k as keyof NiriEvent;
			switch (key) {
				case "WorkspacesChanged":
				case "WorkspaceUrgencyChanged":
				case "WorkspaceActivated":
				case "WorkspaceActiveWindowChanged": {
					this.updateWorkspaces();
					break;
				}
				case "WindowsChanged":
				case "WindowOpenedOrChanged":
				case "WindowClosed":
				case "WindowFocusChanged":
				case "WindowFocusTimestampChanged":
				case "WindowUrgencyChanged":
				case "WindowLayoutsChanged": {
					this.updateWindows();
					break;
				}
			}
		}
		this.updateFocusedOutput();
	}

	constructor() {
		super();

		try {
			this.updateWorkspaces();
			this.updateWindows();
			this.updateFocusedOutput();

			subprocess(
				"niri msg --json event-stream",
				(output: string) => {
					this.onEvent(JSON.parse(output));
				},
				(error: string) => {
					printerr(`Niri services gave an error: ${error}`);
				}
			).connect(
				"exit",
				(_process: Process, code: number, signaled: boolean) => {
					printerr(
						`Niri service exited with code=${code} and signaled=${signaled}`
					);
					this.#running = false;
				}
			);
			this.#running = true;
		} catch (error) {
			this.#running = false;
			printerr(`Niri service failed: ${error}`);
		}
	}
}
