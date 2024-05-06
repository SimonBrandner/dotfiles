export const ClipboardIndicator = () =>
	Widget.Icon({
		class_name: "Indicator",
		icon: "clipboard",
	});

export const ClipboardPage = () =>
	Widget.Box({
		class_name: "Page",
		vertical: true,
		children: [
			Widget.Box({
				class_name: "PageHeader",
				child: Widget.Label({ class_name: "Label", label: "Clipboard" }),
			}),
		],
	});
