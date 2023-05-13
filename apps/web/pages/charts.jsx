import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Activities from "../components/Activities";
import { useState, useEffect, useMemo } from "react";
export default function Chart() {
  const [activities, setActivities] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetch(`http://127.0.0.1:9080/climatix/data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setActivities(data.activities);
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching data");
      });
  }
  function formatYAxisTick(value) {
    if (Math.abs(value) >= 1000000000) {
      return `${value / 1000000000} `;
    } else if (Math.abs(value) >= 1000000) {
      return `${value / 1000000} `;
    } else if (Math.abs(value) >= 1000) {
      return `${value / 1000} `;
    } else {
      return `${value} `;
    }
  }
  //TODO: simplify this
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
                      Kt
                    </Label>
                  </YAxis>
                  <YAxis yAxisId="right" orientation="right">
                    <Label
                      angle={270}
                      position="right"
                      style={{
                        textAnchor: "middle",
                        fill: theme.palette.text.primary,
                        ...theme.typography.body1,
                      }}
                    >
                      Kg
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
            ) : error ? (
              <div className="text-red-600 font-bold">{error}</div>
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
