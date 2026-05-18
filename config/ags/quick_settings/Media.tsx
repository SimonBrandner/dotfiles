import { Player } from "./common/Player";
import Mpris from "gi://AstalMpris";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding, With } from "ags";

const mpris = Mpris.get_default();

export const MediaIndicator = () => (
	<Gtk.Image class="Indicator" iconName="media-playback-start-symbolic" />
);

export const MediaPage = () => (
	<box
		$type="named"
		name="media_page"
		class="Page"
		orientation={Gtk.Orientation.VERTICAL}
	>
		<box class="PageHeader">
			<label class="Label" label="Media" />
		</box>
		<box class="MediaPage" orientation={Gtk.Orientation.VERTICAL}>
			<scrolledwindow
				propagateNaturalHeight
				propagateNaturalWidth
				vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
				hscrollbarPolicy={Gtk.PolicyType.NEVER}
			>
				<With value={createBinding(mpris, "players")}>
					{(players: Array<Mpris.Player>) => (
						<box orientation={Gtk.Orientation.VERTICAL}>
							{players.map((p) => Player(p))}
						</box>
					)}
				</With>
			</scrolledwindow>
		</box>
	</box>
);
