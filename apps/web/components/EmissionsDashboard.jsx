import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Forest from "../components/Forest";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
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

export default function EmissionDashboard({ savings, progress, trees }) {
  if (savings.emissionReduced >= 0) {
    return (
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
            className="mb-4"
          >
            Getting Started
          </Typography>
          <p>
            You&apos;re on the right track towards reducing emissions keep
            adding your activities to achieve your sustainability goals. Click{" "}
            <Link href="/" className="underline text-blue-600">
              here
            </Link>{" "}
            to start adding your activities.
          </p>
        </Paper>
      </Grid>
    );
  } else {
    return (
      <>
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
              aria-label="Emission reduction impact in kg"
            >
              Impact
            </Typography>

            <p>
              You have reduced your emissions by{" "}
              {Math.abs(savings.emissionReduced).toLocaleString()}Kg
            </p>
            <LinearProgressWithLabel
              value={progress}
              aria-label="Emission reduction percentage"
            />
            <p aria-label="Emission reduction percentage to net zero">
              {100 - progress}% left to net zero
            </p>
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
            <Forest />
          </Paper>
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <Paper sx={{ py: 4, px: 6 }}>
            <Typography
              component="h4"
              variant="h6"
              color="primary"
              className="mb-4"
              aria-label="Emission reduction impact in tonnes"
            >
              CO2 reduction
            </Typography>
            <p>
              <strong>{-savings.emissionReduced / 1000} </strong> tonnes less
              CO2 in the atmosphere
            </p>
          </Paper>
        </Grid>
      </>
    );
  }
}
