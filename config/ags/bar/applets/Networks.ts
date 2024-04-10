const { wifi } = await Service.import("network");

export const Networks = () =>
	Widget.Box({
		vertical: true,
		setup: (self) =>
			self.hook(
				wifi,
				() =>
					(self.children = wifi.access_points.map((accessPoint) =>
						Widget.Box({
							child: Widget.Label({
								label: accessPoint.ssid,
							}),
						}),
					)),
			),
	});
