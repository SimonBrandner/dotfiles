import { Widget } from "astal/gtk3";
import { bind } from "astal";

interface OverviewToggleProps {
	label;
	indicator;
	connection: [any, string];
	on_clicked: () => void;
	on_expand_clicked: () => void;
}

export const OverviewToggle = ({
	label,
	indicator: icon,
	connection: [service, property],
	on_clicked,
	on_expand_clicked,
}: OverviewToggleProps) =>
	new Widget.EventBox({
		class_name: bind(service, property).as((active) =>
			active ? "OverviewToggle Active" : "OverviewToggle"
		),
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
