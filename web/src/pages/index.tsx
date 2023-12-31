import { NextPage } from "next/types";
import { usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { Layout } from "../components/Layout";
import PostCard from "../components/PostCard";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      padding: "10px",
      flexWrap: "wrap",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "space-between",
      height: "100%",
      width: "100%",
    },
    link1: {
      color: "white",
      cursor: "pointer",
    },
    grid: {
      position: "relative",
      overflow: "visible",
      boxShadow: "0px 3px 50px #A5A5A5",
    },
    cardWrapper: {
      // width: "270px",
      height: "200px",
      // boxShadow: "0px 3px 50px #A5A5A5",
      position: "relative",
    },
    cardTop: {
      width: "2%",
      height: "2%",
      backgroundColor: "#5D93E1",
    },
    cardLeft: {
      width: "2%",
      height: "2%",
      backgroundColor: "#5D93E1",
      position: "absolute",
      left: "0px",
      top: "0px",
    },
    postHolder: {
      width: "100%",
      height: "98%",
      padding: "10px 10px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    loadMore: {
      marginTop: "10px",
    },
  })
);

interface IColors {
  primaryColor: string;
  secondaryColor: string;
}

const Index: NextPage = () => {
  const classes = useStyles();
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 8,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Grid container spacing={3} className={classes.main}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Grid item xs key={p.id}>
                <PostCard post={p} />
              </Grid>
            )
          )}
        </Grid>
      )}
      {data && data.posts.hasMore ? (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          className={classes.loadMore}
        >
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }
                // ): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostsQuery;
                //   }

                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...(previousValue as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
            }}
          >
            load more
          </Button>
        </Box>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
