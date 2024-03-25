import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Emission } from "../models/Emission";
import { fetchCoordinates } from "../services/service";
import Snack from "../components/Snackbar";

//leaflet does not work with server side rendering, so we use dynamic importing
const Map = dynamic(() => import("../components/EmissionMap"), {
  ssr: false,
});

const emission: Emission[] = [
  {
    region: "Seoul",
    emission: 250,
  },
  {
    region: "Busan",
    emission: 304,
  },
  {
    region: "Gwangju",
    emission: 163,
  },
];

export default function Maps(): JSX.Element {
  const [topEmissionsData, setTopEmissionsData] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchAllCoordinates(): Promise<void> {
      const updatedEmissions = [];

      for (const item of emission) {
        try {
          // Simulate a delay before fetching coordinates to avoid limits in
          // Geocoding apis. A couple of options here. We could implement caching, bulk
          // fetching, etc. So fetching each one separately might not be the best approach
          // but we'll do it for the sake of simplicity here.

          // uncomment for waiting 1 second before fetching
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          const coords = await fetchCoordinates(item.region);
          updatedEmissions.push({
            ...item,
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        } catch (err) {
          setError("An error occurred while fetching coordinates.");
        }
      }
      //Sort based on emission value
      const sortedEmissions = [...updatedEmissions].sort(
        (a, b) => b.emission - a.emission
      );

      setTopEmissionsData(sortedEmissions.slice(0, 5)); // Set the top 5 emissions, can change amount
      setLoading(false);
    }

    fetchAllCoordinates();
  }, []);

  const topEmissions = topEmissionsData.map((item, index) => (
    <li key={index}>
      {item.region}: {item.emission} tCO2eq
    </li>
  ));

  if (loading) {
    // Show a message when loading
    return <div>Loading...</div>;
  }

  return (
    <>
      {error && <Snack error={error} />}
      <Grid container spacing={2} className="h-full">
        <Grid item xs={12} sm={12} md={12} className="h-full">
          {topEmissionsData.length > 0 ? (
            <>
              <Paper className="p-6 rounded-b-none">
                <h3 className="font-bold mb-4">Emissions by Geography</h3>
                <span>Top {emission.length} emissions:</span>
                <ol className="list-decimal pl-6">{topEmissions}</ol>
              </Paper>
              <Paper className="rounded-t-lg h-[71%] mt-[-8px]">
                <Map emission={topEmissionsData} />
              </Paper>
            </>
          ) : (
            <>
              <Paper className="p-6 rounded-b-none">
                <p>No emission data available</p>
              </Paper>
              <Paper className="rounded-t-lg h-[71%] mt-[-8px]">
                <Map emission={[]} />
              </Paper>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
