import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import { UpdootSection } from "./UpdootSection";
import { EditDeletePostButtons } from "./EditDeletePostButtons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      height: "auto",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    actions: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardTop: {
      width: "100%",
      height: "2%",
      backgroundColor: "#5D93E1",
    },
    cardWrapper: {
      width: "300px",
      height: "300px",
    },
  })
);

const colors = [
  {
    primaryColor: "#5D93E1",
    secondaryColor: "#ECF3FC",
  },
  {
    primaryColor: "#F9D288",
    secondaryColor: "#FEFAF1",
  },
  {
    primaryColor: "#5DC250",
    secondaryColor: "#F2FAF1",
  },
  {
    primaryColor: "#F48687",
    secondaryColor: "#FDF1F1",
  },
  {
    primaryColor: "#B964F7",
    secondaryColor: "#F3F0FD",
  },
];

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
};

export default function PostCard(props: any) {
  const classes = useStyles();
  const router = useRouter();
  return (
    <div className={classes.cardWrapper}>
      <div
        className={classes.cardTop}
        style={{
          "backgroundColor": colors[props.post.creator.id % 5].primaryColor,
        }}
      ></div>
      <Card className={classes.root} variant="outlined">
        <CardHeader
          title={props.post.title}
          subheader={`posted by ${props.post.creator.username}`}
        />
        <CardContent className={classes.content}>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.post.textSnippet}
          </Typography>
        </CardContent>
        <CardActions disableSpacing className={classes.actions}>
          <UpdootSection post={props.post} />
          <EditDeletePostButtons
            id={props.post.id}
            creatorId={props.post.creator.id}
          />
        </CardActions>
      </Card>
    </div>
  );
}
