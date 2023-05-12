import React, { useState } from "react";
import Link from "next/link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton, Divider } from "@mui/material";
import BarList from "./BarList";
import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currPage, setCurrPage] = useState("");
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="flex">
      <AppBar
        open={open}
        position="fixed"
        style={{
          backgroundColor: "#f3f4f6",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              color: "#000000",
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/" passHref>
            <a className="flex items-center">
              <img
                src="https://www.hanaloop.com/images/logo.png"
                className="h-6 mr-2"
                alt="logo"
              />
              <Typography
                component="div"
                style={{
                  color: "#374151",
                  fontFamily:
                    "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
                  fontWeight: "700",
                  fontSize: "1.125rem",
                }}
              >
                HanaLoop
              </Typography>
            </a>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer open={open} variant="permanent">
        <DrawerHeader>
          <IconButton onClick={toggleDrawer} aria-label="close drawer">
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <BarList />
        <Divider />
      </Drawer>
      <Container
        disableGutters
        maxWidth="xl"
        sx={{
          mt: 4,
          pr: 4,
          pl: 8,
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          backgroundColor: "#f3f4f6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </Container>
    </div>
  );
}
