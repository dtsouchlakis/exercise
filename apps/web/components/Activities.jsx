import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CopyToClipboard from "../components/CopyToClipboard";
//TODO: Handle overflowing of table

export default function ActivitiesComponent({ activities }) {
  console.log(activities);
  return (
    <TableContainer className="px-5">
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="table of activities"
      >
        <TableHead>
          <TableRow sx={{ fontWeight: "bold" }}>
            <TableCell>Date</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">CO2 Emissions</TableCell>
            <TableCell align="left">CH4 Emissions</TableCell>
            <TableCell align="left">N2O Emissions</TableCell>
            <TableCell align="left">Copy UUID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {activity.activityDate}
              </TableCell>
              <TableCell align="left">{activity.amount}</TableCell>
              <TableCell align="left">{activity.activityType}</TableCell>
              <TableCell align="left">
                {activity.emissions["CO2"].toLocaleString()}t
              </TableCell>
              <TableCell align="left">
                {activity.emissions["CH4"].toLocaleString()}t
              </TableCell>
              <TableCell align="left">
                {activity.emissions["N2O"].toLocaleString()}t
              </TableCell>
              <TableCell align="left">
                <CopyToClipboard input={activity.uuid} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
