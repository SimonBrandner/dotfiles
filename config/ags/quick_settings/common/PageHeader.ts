import { Widget } from "astal/gtk3";
import GObject from "types/@girs/gobject-2.0/gobject-2.0";

interface PageHeader {
	label: string;
	connection: [GObject.Object, () => boolean];
	on_click: (active: boolean) => void;
}

export const PageHeader = ({
	on_click,
	label,
	connection: [service, condition],
}: PageHeader) =>
	new Widget.Box({
		class_name: "PageHeader",
		children: [
			new Widget.Label({
				class_name: "Label",
				label,
			}),
			new Widget.Box({ hexpand: true }),
			new Widget.Box({
				child: new Widget.Switch()
					.on("notify::active", (self) => on_click(self.active))
					.hook(service, (self) => {
						self.active = condition();
						self.toggleClassName("active", condition());
					}),
			}),
		],
	});
