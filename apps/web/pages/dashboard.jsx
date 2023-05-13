import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import ForestIcon from "@mui/icons-material/Forest";
import { Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useState, useEffect, useMemo } from "react";
import Fade from "@mui/material/Fade";

export default function Chart() {
  const [savings, setSavings] = useState([]);
  const [error, setError] = useState(null);
  //   useEffect(() => {
  //     loadSavings();
  //   }, []);

  useEffect(() => {
    function loadSavings() {
      fetch("http://127.0.0.1:9080/climatix/savings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSavings(data);
        });
    }
    loadSavings();
    console.log(savings);
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
      console.log(savings.totalEmissions / savings.emissionReduced);
      return Math.floor(
        (Math.abs(savings.emissionReduced) / savings.totalEmissions) * 100
      );
    }
  }, [savings]);

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            className="h-3 rounded-lg my-4"
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
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
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              p: 2,
              pb: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              component="h4"
              variant="h6"
              color="primary"
              className="mb-4"
            >
              Impact
            </Typography>

            <p>
              You have reduced your emissions by{" "}
              {Math.abs(savings.emissionReduced).toLocaleString()}Kg
            </p>
            <LinearProgressWithLabel value={progress} />
            <p>{100 - progress}% left to net zero</p>
          </Paper>
        </Grid>

        <Grid item xs={4} md={4} lg={4}>
          <Paper
            sx={{
              p: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p className="text-2xl mb-8 text-center text-lime-700">
              You planted the equivalent of {trees} trees
            </p>
            <div className="flex flex-col w-40 border-b-2 border-red-700">
              <div className="flex flex-row justify-center -mb-8 text-lime-700 ">
                <Fade in={true} appeared={true} timeout={1000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={4000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={1000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={3000}>
                  <ForestIcon fontSize="large" />
                </Fade>
              </div>
              <div className="flex flex-row justify-center -mb-6 text-lime-600">
                <Fade in={true} appeared={true} timeout={1000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={4000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={2000}>
                  <ForestIcon fontSize="large" />
                </Fade>
              </div>
              <div className="flex flex-row justify-center text-lime-500">
                <Fade in={true} appeared={true} timeout={1000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={3000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={2000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={2000}>
                  <ForestIcon fontSize="large" />
                </Fade>
              </div>
              <div className="flex flex-row justify-center -mt-6 text-lime-400">
                <Fade in={true} appeared={true} timeout={1000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={3000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={1000}>
                  <ForestIcon fontSize="large" />
                </Fade>
                <Fade in={true} appeared={true} timeout={2000}>
                  <ForestIcon fontSize="large" />
                </Fade>
              </div>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <Paper sx={{ py: 4, px: 6 }}>
            <Typography
              component="h4"
              variant="h6"
              color="primary"
              className="mb-4"
            >
              CO2 reduction
            </Typography>
            <p>
              <strong>{-savings.emissionReduced / 1000} </strong> tonnes less
              CO2 in the atmosphere
            </p>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
