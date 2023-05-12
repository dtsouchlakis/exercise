import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import { useEffect, useState, useRef } from "react";
import ActivitiesComponent from "../components/Activities";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [dateInput, setDateInput] = useState(dayjs());
  const uuidInput = useRef(null);
  const [error, setError] = useState(null);
  const [select, setSelect] = useState("date");
  const [uuidError, setUuidError] = useState(null);
  const [dateInputError, setDateInputError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const response = await fetch('http://localhost:9080/climatix/activities');
  //     // setServerInfo(await response.json());
  //   };
  //   fetchData();
  // }, []);

  function retrieveActivities() {
    let location;
    let input;
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (select === "date") {
      if (!dateInput) {
        // check if dateInput is null before proceeding
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

    fetch(`http://localhost:9080/climatix/activities/?${location}=${input}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(input, location);

        console.log(data);
        setActivities(data);
        setError(data.length === 0); // set error state based on whether there was data or not
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <div className="w-full bg-white px-10 mt-10 py-2 mt-14 rounded-t-lg">
        <form className="flex flex-row items-center">
          {/* <h2>Retrieve activities</h2> */}
          <div className="flex h-10">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="date"
              name="radio-buttons-group"
              className="flex flex-row "
              onChange={(e) => setSelect(e.target.value)}
            >
              <FormControlLabel
                value="uuid"
                control={<Radio size="small" />}
                label="By uuid"
              />
              <FormControlLabel
                value="date"
                control={<Radio size="small" />}
                label="By date"
              />
            </RadioGroup>
            {select === "uuid" ? (
              <TextField
                id="activityType"
                label="Activity uuid"
                size="small"
                variant="outlined"
                inputRef={uuidInput}
                error={Boolean(uuidError)}
                helperText={uuidError ? uuidError : " "}
              />
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker //TODO:Need to reselect date for the date filter to be correctly submitted
                  disableFuture
                  label="Date filter"
                  value={setDateInput}
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
          </div>
          <Button onClick={retrieveActivities} color="primary">
            Retrieve
          </Button>
        </form>
      </div>
      <Grid container spacing={3}>
        {/* <h1 className="text-3xl text-lime-800 mb-12">
          Climatix App: Activities
        </h1> */}
        <Grid item xs={12} sm={6} md={4} lg={12}>
          <Paper className="  flex flex-col items-center py-4">
            <h3 className="mb-4">
              Retrieve your historical activities by filtering by {select}
            </h3>
            {error && <p>No activities found</p>}
            {activities.length !== 0 ? (
              <ActivitiesComponent activities={activities} />
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
