import Gtk from "gi://Gtk?version=3.0";

export const ClipboardIndicator = () => (
	<icon class="Indicator" icon="clipboard" />
);

export const ClipboardPage = () => (
	<box
		$type="named"
		name="clipboard_page"
		class="Page"
		orientation={Gtk.Orientation.VERTICAL}
	>
		<box class="PageHeader">
			<label class="Label" label="Clipboard" />
		</box>
	</box>
);
