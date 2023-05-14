import Paper from "@mui/material/Paper";
import Snack from "../components/Snackbar";
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
import Activities from "../components/Activities";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState, useEffect, useMemo } from "react";

export default function Chart() {
  const [activities, setActivities] = useState([]);
  const [labelLeft, setLabelLeft] = useState("");
  const [labelRight, setLabelRight] = useState("");
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  // Sorts the given activities array by their activityDate property.
  function sortActivitiesByDate(activities) {
    activities.sort(
      (a, b) => Date.parse(a.activityDate) - Date.parse(b.activityDate)
    );
  }
  function fetchData() {
    fetch(`https://full-stack-exercise.onrender.com/climatix/data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        let newActivities = [...data.activities];
        sortActivitiesByDate(newActivities);
        setActivities(newActivities);
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching data");
      });
  }

  // Formats the given value and updates the left y-axis label state variable accordingly.
  function formatYAxisTick(value) {
    if (Math.abs(value) >= 1000000000) {
      setLabelLeft("Mtonnes");
      return `${value / 1000000000} `;
    } else if (Math.abs(value) >= 1000000) {
      setLabelLeft("Ktonnes");
      return `${value / 1000000} `;
    } else if (Math.abs(value) >= 1000) {
      setLabelLeft("tonnes");
      return `${value / 1000} `;
    } else {
      setLabelLeft("kg");
      return `${value} `;
    }
  }

  // Formats the given value and updates the right y-axis label state variable accordingly.
  function formatYAxis2Tick(value) {
    if (Math.abs(value) >= 1000000000) {
      setLabelRight("Mtonnes");
      return `${value / 1000000000} `;
    } else if (Math.abs(value) >= 1000000) {
      setLabelRight("Ktonnes");
      return `${value / 1000000} `;
    } else if (Math.abs(value) >= 1000) {
      setLabelRight("tonnes");
      return `${value / 1000} `;
    } else {
      setLabelRight("kg");
      return `${value} `;
    }
  }

  //Prepare the data for the chart. The chart has 2 Y-axis because of the difference in order of magnitute of CO2 in
  //comparison to the other gasses.
  const chartData = useMemo(() => {
    return activities.map((element) => ({
      name: element.activityDate,
      CO2: element.emissions["CO2"],
      CH4: element.emissions["CH4"],
      N2O: element.emissions["N2O"],
    }));
  }, [activities]);

  return (
    <>
      {error && <Snack error={error} />}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
              aria-label="Yearly emissions chart"
            >
              Emissions
            </Typography>
            {activities.length ? (
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    style={theme.typography.body2}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke={theme.palette.text.secondary}
                    tickFormatter={formatYAxisTick}
                  >
                    <Label
                      angle={270}
                      position="left"
                      style={{
                        textAnchor: "middle",
                        fill: theme.palette.text.primary,
                        ...theme.typography.body1,
                      }}
                    >
                      {labelLeft}
                    </Label>
                  </YAxis>
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={formatYAxis2Tick}
                  >
                    <Label
                      angle={270}
                      position="right"
                      style={{
                        textAnchor: "middle",
                        fill: theme.palette.text.primary,
                        ...theme.typography.body1,
                      }}
                    >
                      {labelRight}
                    </Label>
                  </YAxis>

                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    yAxisId={"left"}
                    dataKey="CO2"
                    stroke={theme.palette.primary.main}
                    activeDot={{
                      stroke: theme.palette.primary.main,
                      strokeWidth: 2,
                      fill: "#fff",
                      r: 5,
                    }}
                  />
                  <Line
                    isAnimationActive={false}
                    yAxisId={"right"}
                    type="monotone"
                    dataKey="CH4"
                    stroke={theme.palette.secondary.main}
                    dot={false}
                  />
                  <Line
                    isAnimationActive={false}
                    yAxisId={"right"}
                    type="monotone"
                    dataKey="N2O"
                    stroke={theme.palette.success.main}
                    dot={false}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div>No data available</div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper className="pt-4 mb-12">
            <Activities activities={activities} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
