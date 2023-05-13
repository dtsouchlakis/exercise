import Link from "next/link";
import Sidebar from "./Sidebar";
import { useState } from "react";
import {
  styled,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { IconButton, Divider } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
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
const mdTheme = createTheme();

export default function Dashboard({ children }) {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <StyledEngineProvider injectFirst>
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
            <Link href="/" passHref className="flex items-center">
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
          <Sidebar />
          <Divider />
        </Drawer>
        <Container
          disableGutters
          maxWidth="xl"
          sx={{
            pt: 12,
            px: 4,
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
    </StyledEngineProvider>
  );
}
