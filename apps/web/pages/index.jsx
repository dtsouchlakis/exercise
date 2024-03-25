import Paper from "@mui/material/Paper";
import Snack from "../components/Snackbar";
import { Grid, Typography } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import EmissionDashboard from "../components/EmissionsDashboard";
import { fetchSavings } from "../services/service";
export default function Chart() {
  const [savings, setSavings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavings = async () => {
      try {
        const res = await fetchSavings();
        setSavings(res);
      } catch (err) {
        setError("Unable to connect to server");
      }
    };
    loadSavings();
  }, []);

  //Calculate equivalent of trees plant from the emission reductions. Assumption of 1 tonne of CO2 equivalent per 40 trees. First convert kg to tonnes then divide by number of trees per tonne
  const trees = useMemo(() => {
    if (!savings?.emissionReduced) {
      return 0;
    } else {
      return Math.floor(Math.abs(savings.emissionReduced) / 1000 / 40);
    }
  }, [savings]);

  //A potential improvement here would have been to receive a positive number from the backend instead of doing abs for every calculation
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
            <Typography
              component="h4"
              variant="h6"
              color="primary"
              aria-label="Emissions Dashboard intro"
            >
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
