import GObject from "types/@girs/gobject-2.0/gobject-2.0";
import { Widget as GeneralWidget } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { LabelProps } from "types/widgets/label";

interface OverviewToggleProps {
	label: LabelProps["label"];
	indicator: GeneralWidget;
	connection: [GObject.Object, () => boolean];
	on_clicked: () => void;
	on_expand_clicked: () => void;
}

export const OverviewToggle = ({
	label,
	indicator: icon,
	connection: [service, condition],
	on_clicked,
	on_expand_clicked,
}: OverviewToggleProps) =>
	Widget.EventBox({
		class_name: "OverviewToggle",
		child: Widget.Box({
			children: [
				Widget.Button({
					class_name: "Button",
					on_clicked,
					hexpand: true,
					child: Widget.Box({
						hpack: "start",
						children: [
							icon,
							Widget.Label({
								label,
							}),
						],
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
		}),
		setup: (self) =>
			self.hook(service, () => {
				self.toggleClassName("Active", condition());
			}),
	});
