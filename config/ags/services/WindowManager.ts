import { Accessor, createBinding, createComputed } from "gnim";

import Niri from "./Niri";
import Sway from "./Sway";
import { exec } from "ags/process";

export type Workspace = {
	name: string;
	focused: boolean;
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
