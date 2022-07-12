import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Layout } from "../components/Layout";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { CardActions } from "@material-ui/core";
import toast from 'react-hot-toast';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: 500,
    },
  })
);

const CreatePost: React.FC<{}> = ({ }) => {
  const classes = useStyles();
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  const notify = () => toast.success('Post successfully created!', { position: "bottom-center" });

  return (
    <Layout>
      <div className={classes.root}>
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: { input: values },
              update: (cache) => {
                cache.evict({ fieldName: "posts:{}" });
              },
            });
            if (!errors) {
              notify();
              router.push("/");
            }
          }}
        >
          {({
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Card className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="title"
                      label="Title"
                      type="title"
                      id="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.title && touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="text"
                      name="text"
                      label="Text"
                      fullWidth
                      multiline
                      rows={4}
                      value={values.text}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.text && touched.text && errors.text}
                    />
                  </Grid>
                  <CardActions>
                    <Button type="submit" color="primary" variant="contained">
                      create post
                    </Button>
                  </CardActions>
                </Grid>
              </Card>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(CreatePost);
