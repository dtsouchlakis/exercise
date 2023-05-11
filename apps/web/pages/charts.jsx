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
import { useState, useEffect } from "react";
export default function Chart() {
  const [activities, setActivities] = useState([]);
  const [data, setData] = useState([]);
  const theme = useTheme();
  function fetchData() {
    fetch(`http://localhost:9080/climatix/data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setActivities(data.activities);
      })
      .catch((error) => console.error(error));
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

  function setChartData() {
    const newData = activities.map((element) => ({
      name: element.activityDate,
      CO2: element.emissions["CO2"],
      CH4: element.emissions["CH4"],
      N2O: element.emissions["N2O"],
    }));
    setData(newData);
  }
  useEffect(() => {
    fetchData();
    setChartData();
  });
  return (
    <>
      <Grid container spacing={3} className="mt-10">
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
            <ResponsiveContainer>
              <LineChart
                data={data}
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
                    Mt
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
                    t
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
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper className="pt-4">
            <Activities activities={activities} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
