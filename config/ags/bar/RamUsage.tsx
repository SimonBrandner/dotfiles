import { createPoll } from "ags/time";
import GTop from "gi://GTop?version=2.0";
import { formatSize } from "../utils";

const RAM_POLL_RATE = 3000;
const RAM_USAGE_HIGH_THRESHOLD = 0.8;

const memory = createPoll(new GTop.glibtop_mem(), RAM_POLL_RATE, () => {
	const memory = new GTop.glibtop_mem();
	GTop.glibtop_get_mem(memory);
	return memory;
});

export const RamUsage = () => {
	return (
		<box
			class={memory((m) =>
				m.user / m.total > RAM_USAGE_HIGH_THRESHOLD ? "Usage High" : "Usage"
			)}
			spacing={4}
		>
			<image iconName="ram" />
			<label
				label={memory(
					(memory) =>
						`${formatSize(memory.user, 2)}/${formatSize(memory.total, 2)}`
				)}
			/>
		</box>
	);
};
