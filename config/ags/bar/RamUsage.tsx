import { createPoll } from "ags/time";
import GTop from "gi://GTop?version=2.0";
import { logarithm } from "../utils";

const MEMORY_UNITS = ["B", "KB", "MB", "GB", "TB"];
const RAM_POLL_RATE = 3000;

const memory = createPoll(new GTop.glibtop_mem(), RAM_POLL_RATE, () => {
	const memory = new GTop.glibtop_mem();
	GTop.glibtop_get_mem(memory);
	return memory;
});

export function formatSize(bytes: number) {
	if (bytes === 0) return "0B";

	const i = Math.floor(logarithm(1000, bytes));
	const size = (bytes / Math.pow(1000, i)).toFixed(2);

	return `${size}${MEMORY_UNITS[i]}`;
}

export const RamUsage = () => {
	return (
		<box class="Usage" spacing={4}>
			<image iconName="ram" />
			<label
				label={memory(
					(memory) => `${formatSize(memory.user)}/${formatSize(memory.total)}`
				)}
			/>
		</box>
	);
};
