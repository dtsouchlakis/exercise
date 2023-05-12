import React, { useEffect, useState, useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers/";
import dayjs from "dayjs";
import { TextField, Button, Autocomplete } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

// const testData = [
//   { amount: 10, activityDate: "2023-05-11", activityType: "gasoline" },
//   { amount: 45, activityDate: "2023-05-12", activityType: "lng" },
//   { amount: 23, activityDate: "2023-05-13", activityType: "lng" },
//   { amount: 97, activityDate: "2023-05-14", activityType: "lng" },
//   { amount: 57, activityDate: "2023-05-15", activityType: "lng" },
//   { amount: 81, activityDate: "2023-05-16", activityType: "lng" },
//   { amount: 32, activityDate: "2023-05-17", activityType: "lng" },
//   { amount: 66, activityDate: "2023-05-18", activityType: "lng" },
//   { amount: 88, activityDate: "2023-05-19", activityType: "lng" },
//   { amount: 5, activityDate: "2023-05-20", activityType: "lng" },
//   { amount: 76, activityDate: "2023-05-21", activityType: "gasoline" },
//   { amount: 42, activityDate: "2023-05-22", activityType: "lng" },
//   { amount: 17, activityDate: "2023-05-23", activityType: "gasoline" },
//   { amount: 61, activityDate: "2023-05-24", activityType: "lng" },
//   { amount: 89, activityDate: "2023-05-25", activityType: "lng" },
//   { amount: 49, activityDate: "2023-05-26", activityType: "lng" },
//   { amount: 73, activityDate: "2023-05-27", activityType: "lng" },
//   { amount: 28, activityDate: "2023-05-28", activityType: "lng" },
//   { amount: 94, activityDate: "2023-05-29", activityType: "lng" },
//   { amount: 12, activityDate: "2023-05-30", activityType: "lng" },
// ];

//TODO: Add no history, no emissions on tables and charts
//TODO: Add server errors on other screens
//TODO: Fix logo font
// function loadTestData() {
//   testData.forEach((element) => {
//     fetch("http://localhost:9080/climatix/activities", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         amount: parseInt(element.amount),
//         activityDate: element.activityDate,
//         activityType: element.activityType,
//         emissions: { CO2: 0, CH4: 0, N2O: 0 },
//       }),
//     });
//   });
// }
// loadTestData();
export default function Web() {
  const [serverInfo, setServerInfo] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:9080/climatix/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activity options");
        }
        const data = await response.json();
        setActivityOptions(data);
        console.log(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Server Error");
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("http://localhost:9080/climatix/");
  //     setServerInfo(await response.json());
  //   };
  //   fetchData();
  // }, []);
  function flashConfirm() {
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
    if (!amountInput.current.value) {
      setAmountInputError("Amount is invalid");
    } else {
      setAmountInputError(false);
    }
    if (!typeInput) {
      setTypeInputError("Please select an activity type");
    } else {
      setTypeInputError(false);
    }
  }
  function submitActivity() {
    validateInputs();
    if (
      !dateInputError &&
      dateInput &&
      !amountInputError &&
      amountInput?.current?.value &&
      typeInput &&
      !typeInputError
    ) {
      fetch("http://localhost:9080/climatix/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseInt(amountInput.current.value),
          activityDate: dateInput.format("YYYY-MM-DD").toString(),
          activityType: typeInput,
          emissions: { CO2: 0, CH4: 0, N2O: 0 },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          flashConfirm();
          setLastUuid(data.uuid);
        })
        .catch((error) => {
          console.error(error);
          setError("Server Error");
        });
    }
  }
  return (
    <>
      {/* <h1 className="text-3xl text-lime-800 mt-10 text-left">Climatix App</h1> */}
      <Grid container spacing={3} className="mt-14">
        <Grid item xs={3}>
          <Paper className="flex flex-col  items-center rounded-md">
            <form className="flex flex-col border-solid border-2 border-cyan-700 p-9 rounded-md px-12 max-w-sm">
              <h2>Add Activity</h2>

              <TextField
                id="amount"
                label="Amount"
                variant="outlined"
                required
                className="mt-5"
                inputRef={amountInput}
                type="number"
                onChange={(e) => {
                  setAmountInputError(false);
                }}
                error={Boolean(amountInputError)}
                helperText={amountInputError ? amountInputError : " "}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select date for activity"
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
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className="px-10 pt-10 pb-20 rounded-md">
            <div className=" flex flex-col h-full">
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
                {error ? <p className="text-red-500 text-2xl">{error}</p> : " "}
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
