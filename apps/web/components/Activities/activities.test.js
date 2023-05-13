import Activities from ".";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

test("Activities load appropriately", async () => {
  const mockActivities = [
    {
      uuid: "1",
      amount: 1,
      activityDate: "2023-01-01",
      activityType: "lng",
      emissions: { CO2: 1, CH4: 1, N2O: 1 },
    },
    {
      uuid: "2",
      amount: 2,
      activityDate: "2023-02-02",
      activityType: "lng",
      emissions: { CO2: 2, CH4: 2, N2O: 2 },
    },
    {
      uuid: "3",
      amount: 3,
      activityDate: "2023-03-03",
      activityType: "lng",
      emissions: { CO2: 3, CH4: 3, N2O: 3 },
    },
  ];

  render(<Activities activities={mockActivities} />);
});
