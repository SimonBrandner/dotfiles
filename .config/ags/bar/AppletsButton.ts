export const AppletsButton = Widget.Button({
	class_name: "AppletButton",
	on_clicked: () => {
		App.toggleWindow("applets");
	},
	label: "Applets",
});
