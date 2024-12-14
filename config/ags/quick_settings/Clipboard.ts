import { Widget } from "astal/gtk3";

export const ClipboardIndicator = () =>
	new Widget.Icon({
		class_name: "Indicator",
		icon: "clipboard",
	});

export const ClipboardPage = () =>
	new Widget.Box({
		name: "clipboard_page",
		class_name: "Page",
		vertical: true,
		children: [
			new Widget.Box({
				class_name: "PageHeader",
				child: new Widget.Label({ class_name: "Label", label: "Clipboard" }),
			}),
		],
	});
