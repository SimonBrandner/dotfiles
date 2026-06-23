import { monitorFile } from "ags/file";
import GObject, { register, getter } from "ags/gobject";
import { exec, execAsync } from "ags/process";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";

const CLIPHIST_DATABASE: string = `${GLib.get_user_cache_dir()}/cliphist/db`;

export type ClipboardTextEntry = {
	kind: "text";
	text: string;
};

export type ClipboardEntry = {
	id: number;
	content: ClipboardTextEntry;
};

@register()
export default class Clipboard extends GObject.Object {
	static instance: Clipboard;
	static get_default() {
		if (!this.instance) this.instance = new Clipboard();
		return this.instance;
	}

	#entries: Array<ClipboardEntry> = [];
	@getter(Object)
	get entries() {
		return this.#entries;
	}

	private cliphistEntryToClipboardEntry(cliphistEntry: string): ClipboardEntry {
		const [id, ...contentParts] = cliphistEntry.split("\t");
		return {
			id: parseInt(id),
			content: {
				kind: "text",
				text: contentParts.join(" "),
			},
		};
	}

	private updateList(): void {
		this.#entries = [];

		try {
			const output = exec("cliphist list");
			const outputLines = output.split("\n");
			this.#entries = outputLines.map(this.cliphistEntryToClipboardEntry);
			this.notify("entries");
		} catch (e) {
			this.#entries = [];
			printerr(`cliphist threw an error: ${e}`);
		}
	}

	public async copy(id: number): Promise<void> {
		try {
			const decoded = await execAsync(`cliphist decode ${id}`);
			await execAsync(`wl-copy ${decoded}`);
		} catch (e) {
			printerr(`Failed to copy clipboard entry: ${e}`);
		}
	}

	constructor() {
		super();
		this.updateList();
		monitorFile(
			CLIPHIST_DATABASE,
			(_filePath: string, _event: Gio.FileMonitorEvent) => this.updateList()
		);
	}
}
