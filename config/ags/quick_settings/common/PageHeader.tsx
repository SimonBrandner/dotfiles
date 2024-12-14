import { bind } from "astal";

interface PageHeader {
	label: string;
	connection: [any, string, (value: boolean) => void];
}

export const PageHeader = ({
	label,
	connection: [service, property, setProperty],
}: PageHeader) => {
	return (
		<box className={"PageHeader"}>
			<label className="Label" label={label} />
			<box hexpand={true}></box>
			<box>
				<switch
					onStateSet={(_, state) => setProperty(state)}
					active={bind(service, property)}
					className={bind(service, property).as((active) =>
						active ? "active" : ""
					)}
				></switch>
			</box>
		</box>
	);
};
