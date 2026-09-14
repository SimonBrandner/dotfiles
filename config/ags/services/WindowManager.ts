import { Accessor, createBinding, createComputed } from "gnim";

import Niri from "./Niri";
import Sway from "./Sway";
import { exec } from "ags/process";
import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";

export type Workspace = {
	label: string;
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
			return createBinding(sway, "workspaces")()
				.sort((a, b) => (a.name > b.name ? 1 : -1))
				.map((w) => ({
					name: w.name,
					label: w.name,
					focused: w.focused,
				}));
		}
		if (createBinding(niri, "running")()) {
			const workspaceLabels = [
				{
					name: "social",
					label: "󰇮",
				},
				{
					name: "web",
					label: "",
				},
				{
					name: "code",
					label: "󰅩",
				},
				{
					name: "other",
					label: "",
				},
			];

			const workspaces = createBinding(niri, "workspaces")();
			return workspaceLabels.map(
				({ name, label }) =>
					({
						label: label,
						name: name,
						focused: workspaces.find((w) => w.name === name)?.is_focused,
					}) as Workspace
			);
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

export const focusWorkspace = async (name: string) => {
	if (sway.running) {
		await sway.focusWorkspace(name);
		return;
	}
	if (niri.running) {
		await niri.focusWorkspaceByName(name);
		return;
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
