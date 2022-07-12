import React, { useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { Avatar, Box, Fab, SvgIconTypeMap, useMediaQuery } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { SearchBar } from "./searchBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  useTheme,
  alpha,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import DescriptionIcon from "@material-ui/icons/Description";
import HomeIcon from "@material-ui/icons/Home";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import GestureIcon from '@material-ui/icons/Gesture';
import anime from 'animejs';
import Logo from '../../public/logo.svg';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import Brightness3Icon from "@material-ui/icons/Brightness3";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { getCookie, useChangeTheme } from "./ThemeContext";



interface NavBarProps {
  children: React.ReactNode;
  window?: () => Window;
}

interface IDrawerMenu {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  path: string;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  sectionDesktop: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 25,
  },
  toolbar: theme.mixins.toolbar,
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  accountProfile: {
    borderRadius: ".29rem",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "1rem 1.5rem .6rem",
    position: "relative",
    flexDirection: "column",
    justifyItems: "center",
    textAlign: "center",
    height: "10rem",
    transition: "all .5s cubic-bezier(.685,.0473,.346,1)",
    backgroundColor: alpha("#0097A7", 0.15),
  },
  logo: {
    height: "2em",
    Width: "4em",
    marginRight: "300px",

  }
}));
export const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  const icon = !theme ? <Brightness7Icon /> : <Brightness3Icon />;

  const changeTheme = useChangeTheme();
  const [mode, setMode] = React.useState<string | null>(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const preferredMode = prefersDarkMode ? 'dark' : 'light';

  React.useEffect(() => {
    setMode(getCookie('paletteMode') || 'system');
  }, [setMode]);

  const handleChangeThemeMode = (checked: boolean) => {
    let paletteMode = 'system';
    paletteMode = checked ? 'dark' : 'light';
    if (paletteMode === null) {
      return;
    }

    setMode(paletteMode);

    if (paletteMode === 'system') {
      document.cookie = `paletteMode=;path=/;max-age=31536000`;
      changeTheme({ paletteMode: preferredMode });
    } else {
      document.cookie = `paletteMode=${paletteMode};path=/;max-age=31536000`;
      changeTheme({ paletteMode });
    }
  };


  useEffect(() => {
    const svgPath = document.querySelectorAll('polyline');

    const svgText = anime({
      targets: svgPath,
      loop: true,
      direction: 'alternate',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 700,
      delay: (el: any, i: any) => { return i * 500 }
    });
  }, []);

  const isMenuOpen = Boolean(anchorEl);
  let body = null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawerMenu: IDrawerMenu[] = [
    {
      label: "Home",
      icon: HomeIcon,
      path: "/"
    },
    {
      label: "News",
      icon: DescriptionIcon,
      path: "/news"
    },
    {
      label: "Stocks",
      icon: ShowChartIcon,
      path: "/stocks"
    },
    {
      label: "Draw",
      icon: GestureIcon,
      path: "/drawing"
    },
    {
      label: "Game",
      icon: SportsEsportsIcon,
      path: "/game",
    },
    {
      label: "3D Space",
      icon: SportsEsportsIcon,
      path: "/3dSpace",
    },
  ];

  const sentenceCase = (name: string | undefined) => {
    if (typeof name === "string") {
      return name[0].toUpperCase() + name.substr(1).toLowerCase();
    }
    return undefined;
  };

  const menuId = "primary-search-account-menu";
  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={async () => {
              handleMenuClose();
              router.push("/login");
            }}
          >
            Login
          </MenuItem>
          <MenuItem
            onClick={async () => {
              handleMenuClose();
              router.push("/register");
            }}
          >
            Register
          </MenuItem>
        </Menu>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={async () => {
            handleMenuClose();
            router.push("/create-post");
          }}
        >
          Create Post
        </MenuItem>
        <MenuItem
          onClick={async () => {
            handleMenuClose();
            await logout();
            await apolloClient.resetStore();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <svg id="Weldit" className={classes.logo} height="40px" width="147px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455.72 147">
              <g id="Weldit_-_Mask" data-name="Weldit - Mask">
                <g id="Mask-w">
                  <polyline points="15.5 25.5 13.5 45.5 10.5 63.5 10.5 77.5 10.57 95.82 14.5 117.5 20.5 129.5 29.5 133.5 43.4 128.82 51.5 116.5 59.5 103.5 66.34 88.02 72.69 73.32 75.5 59.5 79.5 43.5 83.5 29.5 85.75 20.5 83.5 59.5 81.87 78.8 81.5 91.5 82.5 103.5 85.75 114.81 89.5 125.5 96.5 132.5 107.28 134.5 117.5 128.5 122.5 124.5 129.5 115.5 136.57 108.42 142.98 97.51 147.51 87.72 152.1 75 155.63 63.42 157.4 50.67 159.5 36.5 154.5 23.5 142.98 20.5 135.33 23.75 131.63 30.72 129.5 43.5 128.5 54.5 130.5 66.5 133.04 75 141.51 78.8 152.5 81.5 160.5 83.5 166.5 83.5 174.5 83.5 178.89 84.78" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="21" />
                </g>
                <g id="Mask-e">
                  <polyline points="179 118 197.05 113.75 209 107 214.93 95.82 212 83 200.81 78.8 191 83 183.85 90.72 179 101.75 176.81 110.37 181 125 187.53 132.81 200 136 212.81 136 226 129.98 237 119" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
                </g>
                <g id="Mask-l">
                  <polyline points="238 119 256.93 95.82 265 81 273.18 65.39 276.02 51.72 279 34 279 17.07 271 9 260.1 13.62 256 23 249.93 40.02 245.63 56.45 241.4 73.32 240.34 88.02 239.98 99.2 241.6 111.57 245 123 249.93 134.22 257 138 265 135 273.18 131.75 279 128.82" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
                </g>
                <g id="Mask-d">
                  <polyline points="321.7 78.12 309 81 297.87 88.02 289.75 99.2 285.16 110.37 285.16 123.63 290 132 294.77 134.93 304.98 134.93 313.39 128.82 321.7 116.57 330 101 345.51 70.62 353 45 355.07 28.34 353.63 16.92 347 9 338.1 12.27 331.98 22.34 327 44 324 62 321.7 90.1 321.7 105.98 325 125 330 132 338.45 134.93 346 133 354 127" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
                </g>
                <g id="Mask-i">
                  <g id="Mask-i-2" data-name="Mask-i">
                    <polyline points="359 118 365 106 367.37 92.57 370.22 78.12 366.69 113.75 367.37 125.39 367.37 132.1 370.22 135.98 375.7 135.98 379.67 133.51 387.16 128.82 394 125 399.35 116.13" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
                  </g>
                  <g id="Mask-i-dot">
                    <polyline points="375.7 51.72 375.7 54.81 379.67 51.72 377.69 45.28 370.22 45.28 368.81 50.67 368.81 56.45 377.63 56.45 383.28 50.67" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
                  </g>
                </g>
                <g id="Mask-t">
                  <g id="Mask-t-bottom">
                    <polyline points="411 81 421.75 73.32 430.92 63.42 437.98 50.67 443 38 443 26.67 439 19 430.92 19 425 23 421 29 418.37 34.69 415.39 40.02 413.28 48.35 411 56.45 408 66 408 75 407 85 407 93.28 407 102.1 409 112 411 126 417 134 423 137 436 134 425 134.22 432.34 134.22 439 130 443 124.34" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="19" />
                  </g>
                  <g id="Mask-t-top">
                    <polyline points="386.5 80.5 394.57 80.5 448.22 78" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="15" />
                  </g>
                </g>
              </g>
            </svg>
          </Typography>
          <SearchBar />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="mode"
              onClick={() => {
                mode === 'system' ? prefersDarkMode : mode === 'dark';
                handleChangeThemeMode(true);
              }}
            >
              {icon}
            </IconButton>
            <Typography variant="h6" noWrap>
              {data?.me?.username}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <Box className={classes.accountProfile}>
          <Avatar>{data?.me?.username[0].toUpperCase()}</Avatar>
          <Typography>{sentenceCase(data?.me?.username)}</Typography>
        </Box>
        <Divider />
        <List>
          {drawerMenu.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={(event: any) => {
                router.push(item.path);
              }}
            >
              <ListItemIcon>{<item.icon />}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {body}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
      {data?.me ? (
        <Fab
          variant="extended"
          className={classes.fab}
          color="secondary"
          onClick={async () => {
            router.push("/create-post");
          }}
        >
          <EditIcon className={classes.extendedIcon} />
          Create Post
        </Fab>
      ) : null}
    </div>
  );
};
