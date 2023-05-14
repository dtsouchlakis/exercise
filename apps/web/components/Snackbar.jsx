import Snackbar from "@mui/material/Snackbar";

export default function Snack({ error }) {
  return (
    <Snackbar
      open={error}
      message={error}
      sx={{ opacity: 0.8 }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      ContentProps={{
        className: "bg-red-100 border-red-400 text-red-700",
      }}
      autoHideDuration={6000}
      aria-label={error}
    />
  );
}
