import Gtk from "gi://Gtk?version=4.0";

export const ClipboardIndicator = () => (
	<Gtk.Image class="Indicator" iconName="clipboard" />
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
