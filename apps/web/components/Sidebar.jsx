import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";
import Link from "next/link";
import { BarChart, PlaylistAdd, Restore, Dashboard } from "@mui/icons-material";

export default function Sidebar() {
  const data = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      to: "/",
    },
    {
      label: "Add activity",
      icon: <PlaylistAdd />,
      to: "/activityAdd",
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
    <Link
      href={item.to}
      key={index}
      passHref
      aria-label={"link to " + item.label}
    >
      <ListItemButton>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </Link>
  ));

  return <List>{listItems}</List>;
}
