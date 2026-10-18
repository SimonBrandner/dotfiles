import { createPoll } from "ags/time";
import GTop from "gi://GTop?version=2.0";
import Sensors from "../services/Sensors";
import { createBinding, createComputed, With } from "gnim";

const CPU_POLL_RATE = 3000;
const CPU_TEMPERATURE_HIGH_THRESHOLD = 80;
const CPU_USAGE_HIGH_THRESHOLD = 0.8;

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

const cpuUsage = (
	previous: GTop.glibtop_cpu,
	current: GTop.glibtop_cpu
): number => {
	const previousUsed = previous.total - previous.idle;
	const currentUsed = current.total - current.idle;

	const usedDifference = currentUsed - previousUsed;
	const totalDifference = current.total - previous.total;

	return totalDifference > 0 ? usedDifference / totalDifference : 0;
};

export const CpuUsage = () => {
	return (
		<box
			class={createComputed(() => {
				const { previous, current } = cpu();
				const usage = cpuUsage(previous, current);
				const temperature = createBinding(sensors, "cpu")();
				const high =
					usage >= CPU_USAGE_HIGH_THRESHOLD ||
					(temperature !== undefined &&
						temperature >= CPU_TEMPERATURE_HIGH_THRESHOLD);
				return high ? "Usage High" : "Usage";
			})}
			spacing={4}
		>
			<image iconName="chip" />
			<label
				label={cpu(
					({ previous, current }) =>
						`${Math.round(cpuUsage(previous, current) * 100)}%`
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
