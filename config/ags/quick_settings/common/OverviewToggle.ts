import { Widget } from "astal/gtk3";
import { bind, Binding } from "astal";

interface OverviewToggleProps {
	label;
	indicator;
	active;
	on_clicked?: () => void;
	on_expand_clicked: () => void;
}

export const OverviewToggle = ({
	label,
	indicator: icon,
	active,
	on_clicked,
	on_expand_clicked,
}: OverviewToggleProps) =>
	new Widget.EventBox({
		class_name:
			active instanceof Binding
				? bind(active).as((active) =>
						active ? "OverviewToggle Active" : "OverviewToggle"
					)
				: "OverviewToggle",
		child: new Widget.Box({
			children: [
				new Widget.Button({
					class_name: "Button",
					on_clicked,
					hexpand: true,
					child: new Widget.Box({
						hpack: "start",
						children: [
							icon,
							new Widget.Label({
								label: label,
								truncate: "end",
							}),
						],
					}),
				}),
				new Widget.Button({
					on_clicked: on_expand_clicked,
					class_name: "ExpandButton",
					hpack: "end",
					child: new Widget.Icon({
						class_name: "Icon",
						icon: "pan-end-symbolic",
					}),
				}),
			],
		}),
	});
