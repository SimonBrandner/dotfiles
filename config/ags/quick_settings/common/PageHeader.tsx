import { bind, GObject } from "astal";

interface PageHeader {
	label: string;
	service: GObject;
	property: string;
	toggle?: (active: boolean) => void;
}

export const PageHeader = ({
	label,
	service,
	property,
	toggle: setProperty,
}: PageHeader) => {
	return (
		<box className={"PageHeader"}>
			<label className="Label" label={label} />
			<box hexpand={true}></box>
			<box>
				<switch
					className={bind(service, property).as((active) =>
						active ? "active" : ""
					)}
					active={bind(service, property)}
					onStateSet={(_, active) => setProperty && setProperty(active)}
					setup={(self) => {
						service.bind_property(
							property,
							self,
							"active",
							GObject.BindingFlags.BIDIRECTIONAL |
								GObject.BindingFlags.SYNC_CREATE
						);
					}}
				></switch>
			</box>
		</box>
	);
};
