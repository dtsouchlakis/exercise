import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import CopyToClipboard from "./CopyToClipboard";
import TableContainer from "@mui/material/TableContainer";

export default function ActivitiesTable({ activities }) {
  return (
    <TableContainer className="px-5">
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="table of retrieved activities"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              Amount
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              Type
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              CO2 Emissions
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              CH4 Emissions
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              N2O Emissions
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              Copy UUID
            </TableCell>
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
                {activity.emissions["CO2"].toLocaleString()}kg
              </TableCell>
              <TableCell align="left">
                {activity.emissions["CH4"].toLocaleString()}kg
              </TableCell>
              <TableCell align="left">
                {activity.emissions["N2O"].toLocaleString()}kg
              </TableCell>
              <TableCell align="left">
                <CopyToClipboard input={activity.uuid} />
              </TableCell>
            </TableRow>
          ))}
          {activities.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No activities found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
