import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Snack from "../components/Snackbar";
import RadioGroup from "@mui/material/RadioGroup";
import { useState, useRef, useEffect } from "react";
import ActivitiesComponent from "../components/Activities";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [dateInput, setDateInput] = useState(dayjs());
  const uuidInput = useRef(null);
  const [error, setError] = useState(null);
  const [select, setSelect] = useState("date");
  const [uuidError, setUuidError] = useState(null);
  const [dateInputError, setDateInputError] = useState(null);

  function retrieveActivities() {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    let location;
    let input;
    if (select === "date") {
      if (!dateInput) {
        setDateInputError("Please enter a valid date");
        return;
      }
      location = "date";
      input = dateInput.format("YYYY-MM-DD").toString();
    } else if (select === "uuid") {
      if (
        !uuidInput.current.value ||
        !uuidRegex.test(uuidInput.current.value)
      ) {
        setUuidError("Please enter a valid UUID");
        return;
      }
      location = "uuid";
      input = uuidInput.current.value;
    }

    fetch(
      `https://full-stack-exercise.onrender.com/climatix/activities/?${location}=${input}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      })
      .catch((error) => {
        console.error(error);
        setError("Server Error");
      });
  }

  useEffect(() => {
    fetch(`https://full-stack-exercise.onrender.com/climatix/info`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).catch((error) => {
      setError("Server Error");
    });
  });

  return (
    <>
      {error && <Snack error={error} />}
      <div className="w-full bg-white px-10  py-4 flex align-center border-solid border-2 border-cyan-700 p-9 rounded-t-md md:flex-col">
        <form className="flex flex-row items-center border-black border-1 border-solid ">
          <div className="flex sm:flex-col md:flex-row lg:flex-row xl:flex-row ">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label "
              defaultValue="date"
              name="radio-buttons-group"
              className="flex flex-row "
              onChange={(e) => setSelect(e.target.value)}
            >
              <FormControlLabel
                value="uuid"
                control={<Radio size="small" />}
                label="By uuid"
                aria-label="Radio button to search activities by uuid"
              />
              <FormControlLabel
                value="date"
                control={<Radio size="small" />}
                label="By date"
                aria-label="Radio button to search activities by date"
              />
            </RadioGroup>
            {select === "uuid" ? (
              <TextField
                id="activityType"
                label="Activity uuid"
                size="small"
                variant="outlined"
                aria-label="field to select activity uuid to filter by"
                inputRef={uuidInput}
                error={Boolean(uuidError)}
                helperText={uuidError ? uuidError : " "}
              />
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture
                  label="Date filter"
                  aria-label="field to select activity uuid to filter by"
                  inputFormat="YYYY-MM-DD"
                  defaultValue={dateInput}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "5px",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Activity type"
                      error={Boolean(dateInputError)}
                      helperText={
                        dateInputError ? dateInputError : "Enter a date"
                      }
                    />
                  )}
                  onChange={(newValue) => setDateInput(newValue)}
                />
              </LocalizationProvider>
            )}
            <Button onClick={retrieveActivities} color="primary">
              Retrieve
            </Button>
          </div>
        </form>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper className="  flex flex-col items-center py-4">
            <h3 className="mb-4">
              Retrieve your historical activities by filtering by {select}
            </h3>
            {activities.length !== 0 ? (
              <ActivitiesComponent activities={activities} />
            ) : (
              <p>No activities found</p>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
