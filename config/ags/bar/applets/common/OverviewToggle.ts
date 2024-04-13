import GObject from "types/@girs/gobject-2.0/gobject-2.0";

interface OverviewToggleProps {
	label: string;
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
	Widget.Button({
		class_name: "OverviewToggle",
		hexpand: false,
		vexpand: false,
		child: Widget.Box({
			children: [
				Widget.Label({
					label,
				}),
				Widget.Button({
					on_clicked: on_expand_clicked,
				}),
			],
		}),
		on_clicked,
		setup: (self) =>
			self.hook(service, () => {
				self.toggleClassName("Active", condition());
			}),
	});
