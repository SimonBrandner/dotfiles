import { createPoll } from "ags/time";
import GTop from "gi://GTop?version=2.0";
import { formatSize } from "../utils";

const DISK_POLL_RATE = 5000;
const DISK_USAGE_HIGH_THRESHOLD = 0.8;

const disk = createPoll({ used: 0, total: 0 }, DISK_POLL_RATE, () => {
	const fsusage = new GTop.glibtop_fsusage();
	GTop.glibtop_get_fsusage(fsusage, "/");

	const total = fsusage.blocks * fsusage.block_size;
	const available = fsusage.bavail * fsusage.block_size;
	const used = total - available;

	return { total, used };
});

export const DiskUsage = () => {
	return (
		<box
			class={disk(({ used, total }) =>
				used / total > DISK_USAGE_HIGH_THRESHOLD ? "Usage High" : "Usage"
			)}
			spacing={4}
		>
			<image iconName="disk" />
			<label
				label={disk(
					({ used, total }) => `${formatSize(used)}/${formatSize(total)}`
				)}
			/>
		</box>
	);
};
