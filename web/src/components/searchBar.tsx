import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  alpha,
  Theme,
  makeStyles,
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import SearchResults from "./searchResults";

interface SearchBarProps {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      maxWidth: "500px",
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
    },
    results: {
      position: "absolute",
      width: "100%",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      zIndex: 100,
    },
    main: {
      position: "relative",
      maxWidth: "500px",
      width: "100%",
    },
  })
);

export const SearchBar: React.FC<SearchBarProps> = ({}): any => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [active, setActive] = useState(false);

  const searchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/post?q=`;

  const optionClicked = (clicked: boolean) => {
    setActive(clicked);
    setSearchValue("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search: string = event.target.value;
    setSearchValue(search);
    if (search !== "") {
      (async () => {
        await fetch(`${searchUrl}${search}`)
          .then((response) => response.json())
          .then((res) => {
            setResults(res);
            setActive(true);
          })
          .catch((err) => {
            console.error(err);
            setResults([]);
          });
      })();
    } else {
      setResults([]);
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          value={searchValue}
          onChange={handleChange}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
      {results.length > 0 && active ? (
        <SearchResults
          results={results}
          className={classes.results}
          optionClicked={optionClicked}
        />
      ) : null}
    </div>
  );
};
