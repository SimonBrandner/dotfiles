import { Accessor, createBinding, createComputed } from "gnim";

import Niri from "./Niri";
import Sway from "./Sway";
import { exec } from "ags/process";
import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";

export type Workspace = {
	name: string;
	focused: boolean;
};

export type Output = {
	name: string;
};

const sway = Sway.get_default();
const niri = Niri.get_default();

export const getWorkspaces = (): Accessor<Array<Workspace> | null> =>
	createComputed(() => {
		if (createBinding(sway, "running")()) {
			return createBinding(sway, "workspaces")().map((w) => ({
				name: w.name,
				focused: w.focused,
			}));
		}
		if (createBinding(niri, "running")()) {
			return createBinding(niri, "workspaces")().map((w) => ({
				name: w.name ?? "?",
				focused: w.is_focused,
			}));
		}
		return null;
	});

export const getFocusedOutputName = (): Accessor<Output | null> =>
	createComputed(() => {
		if (createBinding(sway, "running")()) {
			// TODO: Focused output for sway
			return null;
		}
		if (createBinding(niri, "running")()) {
			const o = createBinding(niri, "focusedOutput")();
			if (o === null) return null;
			return {
				name: o.name,
			};
		}
		return null;
	});

export const getFocusedOutput = (): Accessor<Gdk.Monitor | null> =>
	createComputed(() => {
		const focusedOutput = getFocusedOutputName()();
		if (focusedOutput === null) return null;
		return app.monitors.find((m) => m.connector === focusedOutput.name) ?? null;
	});

export const focusWorkspace = (name: string) => {
	if (sway.running) {
		sway.focusWorkspace(name);
	}
	if (niri.running) {
		niri.focusWorkspaceByName(name);
	}

	printerr(
		"Cannot focus workspace because we do not know what window manager is running"
	);
};

export const logOut = () => {
	if (sway.running) {
		exec("swaymsg exit");
		return;
	}
	if (niri.running) {
		exec("niri msg action quit --skip-confirmation");
		return;
	}
	printerr(
		"Cannot log out because we do not know what window manager is running"
	);
};
