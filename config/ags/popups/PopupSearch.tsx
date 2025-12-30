import { Accessor, createComputed, createEffect, createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import app from "ags/gtk3/app";
import GObject from "gnim/gobject";

const MAX_VISIBLE_TILES = 8;

const PopupSearchTile = ({
	visible,
	focused,
	children,
}: {
	focused: Accessor<boolean>;
	visible: Accessor<boolean>;
	children: GObject.Object;
}) => (
	<box
		class={focused((v) => "PopupSearchTile" + (v ? " Focused" : ""))}
		visible={visible}
	>
		{children}
	</box>
);

export const PopupSearch = ({
	monitor,
	windowName,
	onActivate,
	getFilteredIndices,
	onReset,
	children,
}: {
	monitor: Gdk.Monitor;
	windowName: string;
	onActivate: (index: number) => void;
	getFilteredIndices: (filterText: string) => Array<number>;
	onReset: () => void;
	children: Array<GObject.Object>;
}) => {
	let [filterText, setFilterText] = createState("");
	let [selectedTileIndex, setSelectedTileIndex] = createState(0);
	let [firstVisibleTileIndex, setFirstVisibleTileIndex] = createState(0);

	let visibleTiles = createComputed(() =>
		getFilteredIndices(filterText()).slice(
			firstVisibleTileIndex(),
			firstVisibleTileIndex() + MAX_VISIBLE_TILES
		)
	);
	let focusedTile = createComputed(
		() => getFilteredIndices(filterText())[selectedTileIndex()]
	);

	createEffect(() => {
		const sel = selectedTileIndex();
		const win = firstVisibleTileIndex();

		if (sel < win) {
			setFirstVisibleTileIndex(sel);
		} else if (sel >= win + MAX_VISIBLE_TILES) {
			setFirstVisibleTileIndex(sel - MAX_VISIBLE_TILES + 1);
		}
	});

	const moveSelection = (delta: 1 | -1) => {
		const newSelectionOffset = selectedTileIndex() + delta;
		if (
			newSelectionOffset >= 0 &&
			newSelectionOffset <= getFilteredIndices(filterText()).length - 1
		) {
			setSelectedTileIndex(newSelectionOffset);
		}
	};

	const reset = () => {
		onReset();

		input.grab_focus();
		input.text = "";

		setFilterText("");
		setSelectedTileIndex(0);
		setFirstVisibleTileIndex(0);
	};

	let input: Gtk.Entry;
	return (
		<window
			gdkmonitor={monitor}
			application={app}
			name={windowName}
			class="PopupSearch"
			visible={false}
			keymode={Astal.Keymode.EXCLUSIVE}
			anchor={Astal.WindowAnchor.TOP}
			margin_top={200}
			$={(self) => {
				self.connect("notify::visible", reset);
			}}
			onKeyPressEvent={(_, event) => {
				const keyValue = (event as any).get_keyval()[1];
				if (keyValue === Gdk.KEY_Escape) {
					app.get_window(windowName)?.set_visible(false);
					reset();
				}
				if (keyValue === Gdk.KEY_Up) {
					moveSelection(-1);
					return Gdk.EVENT_STOP;
				}
				if (keyValue === Gdk.KEY_Down) {
					moveSelection(+1);
					return Gdk.EVENT_STOP;
				}
			}}
		>
			<box orientation={Gtk.Orientation.VERTICAL} class="PopupSearchContent">
				<entry
					class="Input"
					hexpand={true}
					primary_icon_name="search-symbolic"
					$={(self) => {
						input = self;
						self.connect("notify::text", () => {
							setFirstVisibleTileIndex(0);
							setSelectedTileIndex(0);
							setFilterText(self.get_text());
						});
					}}
					onActivate={() => {
						onActivate(focusedTile());

						app.get_window(windowName)?.set_visible(false);
						reset();
					}}
				></entry>
				<box orientation={Gtk.Orientation.VERTICAL}>
					{children.map((child, index) => (
						<PopupSearchTile
							visible={visibleTiles((v) => v.includes(index))}
							focused={focusedTile((f) => f === index)}
						>
							{child}
						</PopupSearchTile>
					))}
				</box>
			</box>
		</window>
	);
};
