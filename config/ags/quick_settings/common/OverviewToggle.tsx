import Gtk from "gi://Gtk?version=3.0";
import { Accessor, createBinding } from "gnim";

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
}: OverviewToggleProps) => (
	<eventbox
		class={
			active instanceof Accessor
				? active((active) =>
						active ? "OverviewToggle Active" : "OverviewToggle"
					)
				: "OverviewToggle"
		}
	>
		<box>
			<button class="Button" onClicked={on_clicked} hexpand={true}>
				<box halign={Gtk.Align.START}>
					{icon}
					<label label={label} ellipsize="end" />
				</box>
			</button>
			<button
				onClicked={on_expand_clicked}
				class="ExpandButton"
				halign={Gtk.Align.END}
			>
				<icon class="Icon" icon="pan-end-symbolic" />
			</button>
		</box>
	</eventbox>
);
