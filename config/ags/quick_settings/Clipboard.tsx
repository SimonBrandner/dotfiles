import Gtk from "gi://Gtk?version=4.0";
import { SCROLL_HEIGHT } from "./QuickSettings";
import { createBinding, For } from "gnim";
import Clipboard, {
	ClipboardEntry,
	ClipboardTextEntry,
} from "../services/Clipboard";
import Pango from "gi://Pango?version=1.0";

const clipboard = Clipboard.get_default();

export const ClipboardIndicator = () => (
	<Gtk.Image class="Indicator" iconName="clipboard" />
);

type ClipboardPageTextEntryProps = {
	content: ClipboardTextEntry;
};

const ClipboardPageTextEntry = ({
	content: { text },
}: ClipboardPageTextEntryProps) => (
	<Gtk.Inscription
		wrapMode={Pango.WrapMode.WORD}
		textOverflow={Gtk.InscriptionOverflow.ELLIPSIZE_END}
		xalign={0}
		text={text}
	/>
);

type ClipboardPageEntryProps = {
	entry: ClipboardEntry;
};

const ClipboardPageEntry = ({ entry }: ClipboardPageEntryProps) => {
	let content;
	if (entry.content.kind === "text") {
		content = <ClipboardPageTextEntry content={entry.content} />;
	} else {
		throw "Unknown clipboard entry kind";
	}

	return (
		<button
			onClicked={() => clipboard.copy(entry.id)}
			class="ClipboardPageEntry"
		>
			{content}
		</button>
	);
};

export const ClipboardPage = () => (
	<box
		$type="named"
		name="clipboard_page"
		class="Page ClipboardPage"
		orientation={Gtk.Orientation.VERTICAL}
	>
		<box class="PageHeader">
			<label class="Label" label="Clipboard" />
		</box>
		<scrolledwindow
			propagateNaturalHeight
			maxContentHeight={SCROLL_HEIGHT}
			vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
			hscrollbarPolicy={Gtk.PolicyType.NEVER}
		>
			<box orientation={Gtk.Orientation.VERTICAL}>
				<For each={createBinding(clipboard, "entries")}>
					{(entry: ClipboardEntry) => <ClipboardPageEntry entry={entry} />}
				</For>
			</box>
		</scrolledwindow>
	</box>
);
