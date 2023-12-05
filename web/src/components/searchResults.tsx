import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      width: "100%",
      color: "white",
    },
  })
);

export default function SearchResults(props: any) {
  const classes = useStyles();
  const router = useRouter();
  return (
    <div className={props.className}>
      <List>
        {props.results.map((result: any) => {
          return (
            <ListItem
              key={result.id}
              button
              onClick={(event: any) => {
                router.push(`/post/${result.id}`);
                props.optionClicked(false);
              }}
            >
              <ListItemText primary={result.title} className={classes.text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
