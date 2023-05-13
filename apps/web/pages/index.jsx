import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Snack from "../components/Snackbar";
import { Grid, Typography } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import EmissionDashboard from "../components/EmissionsDashboard";

export default function Chart() {
  const [savings, setSavings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    function loadSavings() {
      fetch("http://127.0.0.1:9080/climatix/savings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setSavings(data);
        })
        .catch((error) => {
          console.error(error);
          setError("Server Error");
        });
    }
    loadSavings();
  });

  const trees = useMemo(() => {
    if (!savings?.emissionReduced) {
      return 0;
    } else {
      return Math.floor(Math.abs(savings.emissionReduced) / 40);
    }
  }, [savings]);

  const progress = useMemo(() => {
    if (!savings?.emissionReduced || !savings?.totalEmissions) {
      return 0;
    } else {
      return Math.floor(
        (Math.abs(savings.emissionReduced) / savings.totalEmissions) * 100
      );
    }
  }, [savings]);

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
            }}
          >
            <Typography component="h4" variant="h6" color="primary">
              Welcome to the Emissions Dashboard!
            </Typography>
            <p>
              Take control of your environmental impact and join us in making a
              positive change for our planet. This dashboard empowers you to
              calculate and track your greenhouse gas emissions, enabling you to
              make informed decisions and contribute to a sustainable future.
              Monitor Your Emissions, Make a Difference! Explore the features
              and tools designed to help you understand and reduce your carbon
              footprint. From activity tracking to emission reduction
              strategies, we provide you with the insights and resources you
              need to make a meaningful impact. Together, we can create a
              greener world! Start exploring now and see the difference you can
              make.
            </p>
          </Paper>
        </Grid>
        {!error ? (
          <EmissionDashboard
            savings={savings}
            progress={progress}
            trees={trees}
          />
        ) : (
          ""
        )}
      </Grid>
    </>
  );
}
