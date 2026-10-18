import { createPoll } from "ags/time";
import GTop from "gi://GTop?version=2.0";
import Sensors from "../services/Sensors";
import { createBinding, With } from "gnim";

const CPU_POLL_RATE = 3000;

const sensors = Sensors.get_default();

const cpu = createPoll(
	{ previous: new GTop.glibtop_cpu(), current: new GTop.glibtop_cpu() },
	CPU_POLL_RATE,
	({ current: previous }) => {
		const current = new GTop.glibtop_cpu();
		GTop.glibtop_get_cpu(current);
		return { previous, current };
	}
);

const formatCpuUsage = (
	previous: GTop.glibtop_cpu,
	current: GTop.glibtop_cpu
): string => {
	const previousUsed = previous.total - previous.idle;
	const currentUsed = current.total - current.idle;

	const usedDifference = currentUsed - previousUsed;
	const totalDifference = current.total - previous.total;

	const percentage =
		totalDifference > 0
			? Math.round((usedDifference / totalDifference) * 100)
			: 0;

	return `${percentage}%`;
};

export const CpuUsage = () => {
	return (
		<box class="Usage" spacing={4}>
			<image iconName="chip" />
			<label
				label={cpu(({ previous, current }) =>
					formatCpuUsage(previous, current)
				)}
			/>
			<With value={createBinding(sensors, "cpu")}>
				{(t: number | undefined) =>
					t !== undefined && <label label={`${Math.round(t)}°C`} />
				}
			</With>
		</box>
	);
};
