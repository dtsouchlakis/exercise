import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Snack from "../components/Snackbar";
import RadioGroup from "@mui/material/RadioGroup";
import { useState, useRef, useEffect } from "react";
import ActivitiesTable from "../components/ActivitiesTable";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fetchActivityHistory } from "../services/service";
import { checkServer } from "../services/service";
export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [dateInput, setDateInput] = useState(dayjs());
  const uuidInput = useRef(null);
  const [error, setError] = useState(null);
  const [select, setSelect] = useState("date");
  const [uuidError, setUuidError] = useState(null);
  const [dateInputError, setDateInputError] = useState(null);

  async function retrieveActivities() {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    let filter;
    let input;
    if (select === "date") {
      if (!dateInput) {
        setDateInputError("Please enter a valid date");
        return;
      } else {
        setDateInputError(null);
      }
      filter = "date";
      input = dateInput.format("YYYY-MM-DD").toString();
    } else if (select === "uuid") {
      if (
        !uuidInput.current.value ||
        !uuidRegex.test(uuidInput.current.value)
      ) {
        setUuidError("Please enter a valid UUID");
        return;
      } else {
        setUuidError(null);
      }
      filter = "uuid";
      input = uuidInput.current.value;
    }
    try {
      const res = await fetchActivityHistory(filter, input);
      setActivities(res);
    } catch (err) {
      setError("Unable to connect to server");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkServer();
      } catch (err) {
        setError("Unable to connect to server");
      }
    };
    fetchData().catch((err) => {
      setError("Unable to connect to server");
    });
  }, []);

  return (
    <>
      {error && <Snack error={error} />}
      <div className="w-full bg-white px-10  py-4 flex align-center border-solid border-2 border-cyan-700 p-9 rounded-t-md md:flex-row lg:flex-row xl:flex-row sm:flex-col ">
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
              helperText={uuidError ? uuidError : ""}
              FormHelperTextProps={{
                style: {
                  position: "absolute",
                  bottom: -18,
                  left: -10,
                },
              }}
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
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper className="  flex flex-col items-center py-4">
            <h3 className="mb-4">
              Retrieve your historical activities by filtering by {select}
            </h3>
            {activities.length !== 0 ? (
              <ActivitiesTable activities={activities} />
            ) : (
              <p>No activities found</p>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
