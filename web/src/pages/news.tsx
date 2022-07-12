import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";
import { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { useRouter } from "next/router";
import toast from 'react-hot-toast';

export interface IItem {
  creator: string;
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
}

export interface IChannel {
  items: IItem[];
  feedUrl?: string;
  title?: string;
  description?: string;
  link?: string;
  language?: string;
  lastBuildDate?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: "flex",
      justifySelf: "center",
    },
    text: {
      width: "100%",
    },
  })
);


const News = (props: any) => {
  const classes = useStyles();
  const [news, setNews] = useState<IChannel>({ items: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const toastId = toast.loading('Loading...');
      const myPromise = await fetch(`http://localhost:4000/news`).then((res) => res.json())
        .then((res) => {
          setNews(res);
          setLoading(false);

          toast.success("Got the News!", { id: toastId });
        })
        .catch((err) => {
          toast.error('Error when fetching News!', { id: toastId });
          console.error(err);
        });
    })();
  }, []);
  return (
    <Layout>
      {loading ? <div className={classes.progress}>
        <CircularProgress color="secondary" />
      </div> : <List>
        {news?.items.map((result: IItem) => {
          return (
            <ListItem
              key={result.guid}
              button
              onClick={(event: any) => {
                router.push(result.link);
              }}
            >
              <ListItemText primary={result.title} className={classes.text} secondary={result.contentSnippet} />
            </ListItem>
          );
        })}
      </List>}
    </Layout>
  );
};

export default withApollo({ ssr: true })(News);
