import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snack from "../components/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useEffect, useState, useRef } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers/";
import { fetchCategories } from "../services/service";
import { sendActivity } from "../services/service";
export default function Web() {
  //We could use the energy content to allow the user to input liters of gasoline or
  //m3 of gas instead of TJ for ease of use. This could be also done in the backend,
  //but I wanted to keep it simple for now

  //Converting MJ/liter or MJ/m3 to TJ/liter and TJ/m3.
  const gasolineEnergyContentPerLiter = 34.2 / 1_000_000; //Not in use
  const lngEnergyContentPerLiter = 39.8 / 1_000_000; //Not in use
  const [dateInput, setDateInput] = useState(dayjs());
  const amountInput = useRef(null);
  const [typeInput, setTypeInput] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dateInputError, setDateInputError] = useState(null);
  const [amountInputError, setAmountInputError] = useState(null);
  const [typeInputError, setTypeInputError] = useState(null);
  const [lastUuid, setLastUuid] = useState(null);
  const [activityOptions, setActivityOptions] = useState([]);
  const [error, setError] = useState(null);

  //Fetch the categories to populate the activity type dropdown
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories();
      setActivityOptions(data);
    };
    fetchData().catch((err) => {
      setError("Unable to connect to server");
      console.log(err);
    });
  }, []);

  function flashSuccess() {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 7000);
  }

  function validateInputs() {
    const now = new Date();
    if (!dateInput) {
      setDateInputError("You must select a date");
    } else if (dateInput > now) {
      setDateInputError("Date is in the future");
    } else {
      setDateInputError(false);
    }
    if (!amountInput.current.value || amountInput.current.value < 0) {
      setAmountInputError("Amount is invalid");
    } else {
      setAmountInputError(false);
    }
    if (!typeInput) {
      setTypeInputError("Please select a type");
    } else {
      setTypeInputError(false);
    }
  }

  async function submitActivity() {
    validateInputs();
    if (
      !dateInputError &&
      dateInput &&
      !amountInputError &&
      amountInput?.current?.value &&
      typeInput &&
      !typeInputError
    ) {
      try {
        console.log(dateInput, amountInput.current.value, typeInput);
        let data = await sendActivity(
          dateInput.format("YYYY-MM-DD").toString(),
          amountInput.current.value,
          typeInput
        );
        console.log(data);
        setLastUuid(data.uuid);

        console.log(data);
        setLastUuid(data.uuid);
        flashSuccess();
      } catch (err) {
        console.log(err);
        setError("Unable to connect to server");
      }
    }
  }

  return (
    <>
      {error && <Snack error={error} />}
      <Grid container spacing={3}>
        <Grid item xs={9} sm={7} md={4} lg={3}>
          <Paper className="flex flex-col border-solid border-2 border-cyan-700 p-9 rounded-md px-12">
            <h2>Add Activity</h2>

            <TextField
              id="amount"
              label="Amount"
              variant="outlined"
              required
              aria-label="activity amount input"
              className="mt-5"
              inputRef={amountInput}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">TJ</InputAdornment>
                ),
              }}
              onChange={(e) => {
                setAmountInputError(false);
              }}
              error={Boolean(amountInputError)}
              helperText={amountInputError ? amountInputError : " "}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date for activity"
                aria-label="activity date calendar selector"
                onChange={(newValue) => {
                  setDateInput(newValue);
                  setDateInputError(false);
                }}
                disableFuture
                defaultValue={dayjs()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(dateInputError)}
                    helperText={dateInputError ? dateInputError : " "}
                  />
                )}
              />
            </LocalizationProvider>
            <Autocomplete
              id="activityType"
              disablePortal
              options={activityOptions}
              value={typeInput}
              className="mt-5"
              aria-label="activity type input"
              onInputChange={(e, newInputValue) => {
                setTypeInput(newInputValue);
                setTypeInputError(false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Activity type"
                  error={Boolean(typeInputError)}
                  helperText={typeInputError ? typeInputError : " "}
                />
              )}
            />
            <Button
              variant="outlined"
              onClick={submitActivity}
              className="mt-5"
              aria-label="submit new activity"
            >
              Submit
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className="px-10 pt-10 pb-20 rounded-md">
            <div
              className=" flex flex-col h-full"
              aria-label="use instructions for adding activities"
            >
              <div className="flex flex-col lg:text-md md:text-base sm:text-xs">
                <h3 className="font-semibold mb-5 ">
                  Add your activity on the left to calculate and save your
                  incured emissions.
                </h3>
                <ol className="list-decimal">
                  <li>Enter the amount incured</li>
                  <li>Enter the date of the emission</li>
                  <li>Enter the activity type</li>
                  <li>Submit your activity</li>
                </ol>
                {success ? (
                  <p className="text-lime-500">
                    Successfuly added activity with uuid: <br></br> {lastUuid}
                  </p>
                ) : (
                  <p>
                    <br></br>
                    <br></br>
                  </p>
                )}
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
