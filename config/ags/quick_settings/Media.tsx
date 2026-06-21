import { Player } from "./common/Player";
import Mpris from "gi://AstalMpris";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding, With } from "ags";
import { SCROLL_HEIGHT } from "./QuickSettings";

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
				maxContentHeight={SCROLL_HEIGHT}
				vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
				hscrollbarPolicy={Gtk.PolicyType.NEVER}
			>
				<With value={createBinding(mpris, "players")}>
					{(players: Array<Mpris.Player>) => (
						<box orientation={Gtk.Orientation.VERTICAL}>
							{players.map((p) => Player(p, false))}
						</box>
					)}
				</With>
			</scrolledwindow>
		</box>
	</box>
);
