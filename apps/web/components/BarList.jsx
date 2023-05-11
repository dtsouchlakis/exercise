import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";
import { BarChart, PlaylistAdd, Restore, Dashboard } from "@mui/icons-material";
import Link from "next/link";
export default function BarList() {
  const data = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      to: "/",
    },
    {
      label: "Add activity",
      icon: <PlaylistAdd />,
      to: "/",
    },
    {
      label: "Activity history",
      icon: <Restore />,
      to: "/activities",
    },
    {
      label: "Reports",
      icon: <BarChart />,
      to: "/charts",
    },
  ];
  const listItems = data.map((item, index) => (
    <Link href={item.to} key={index} passHref>
      <ListItemButton>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </Link>
  ));

  return <List>{listItems}</List>;
}
