import GObject from "types/@girs/gobject-2.0/gobject-2.0";
import { LabelProps } from "types/widgets/label";

interface OverviewToggleProps {
	label: LabelProps["label"];
	connection: [GObject.Object, () => boolean];
	on_clicked: () => void;
	on_expand_clicked: () => void;
}

export const OverviewToggle = ({
	label,
	connection: [service, condition],
	on_clicked,
	on_expand_clicked,
}: OverviewToggleProps) =>
	Widget.Box({
		class_name: "OverviewToggle",
		children: [
			Widget.Button({
				class_name: "Button",
				on_clicked,
				hexpand: true,
				child: Widget.Label({
					hpack: "start",
					label,
				}),
			}),
			Widget.Button({
				on_clicked: on_expand_clicked,
				class_name: "ExpandButton",
				hpack: "end",
				child: Widget.Icon({
					class_name: "Icon",
					icon: "pan-end-symbolic",
				}),
			}),
		],
		setup: (self) =>
			self.hook(service, () => {
				self.toggleClassName("Active", condition());
			}),
	});
