import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

const useStyles = makeStyles((theme) => ({
  green: {
    color: "inherit",
    backgroundColor: "green",
    borderRadius: "25%",
  },
  red: {
    color: "inherit",
    backgroundColor: "red",
    borderRadius: "25%",
  },
  noColor: {
    color: "inherit",
    backgroundColor: "inherit",
    borderRadius: "25%",
  },
}));

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const classes = useStyles();
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      alignContent="center"
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
      >
        <KeyboardArrowUpIcon
          fontSize="large"
          className={post.voteStatus === 1 ? classes.green : classes.noColor}
        />
      </IconButton>

      {post.points}

      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        // variantColor={post.voteStatus === -1 ? "red" : undefined}
      >
        <KeyboardArrowDownIcon
          fontSize="large"
          className={post.voteStatus === -1 ? classes.red : classes.noColor}
        />
      </IconButton>
    </Box>
  );
};
