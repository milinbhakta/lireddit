import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { Connection, createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import es from "./utils/elasticSearchClient";
import Parser from "rss-parser";
import { IChannel } from "./types";
import axios from "axios";
import path from "path";

const main = async () => {
  const conn: Connection = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    migrations: [
      // path.join(__dirname, "./migrations/1597626060117-Initial.*"),
      path.join(__dirname, "./migrations/1597424501158-MockPosts.*"),
    ],
    entities: [Post, User, Updoot],
  });
  await conn.runMigrations();
  // await Post.delete({});

  const app = express();

  const apiRouter = express.Router();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".milinbhakta.com" : undefined,
      },
      saveUninitialized: false,
      secret: "qowiueojwojfalksdjoqiwueo",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
    cors: false,
  });

  // search the post
  apiRouter.get("/post", (req, res) => {
    const query: string = req.query.q as string;

    es.search({
      index: "post",
      q: `*${query}*`,
      size: 5,
    })
      .then((result) => {
        res.json(result.hits.hits.map((hit) => hit._source));
      })
      .catch((err) => {
        res.send(err);
      });
  });

  // get the rss feed
  apiRouter.get("/news", async (_req, res) => {
    const parser: Parser<IChannel> = new Parser({});

    (async () => {
      const feed = await parser.parseURL(
        "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best"
      );
      res.json(feed);
    })();
  });

  // get the stocks
  apiRouter.get("/stocks/:ticker", async (req, res, next) => {
    try {
      const { data } = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${req.params.ticker}`
      );
      console.log(data);

      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  apiRouter.get("/health", (_req, res) => {
    res.send("OK");
  });

  app.use("/api", apiRouter);

  app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  });

  app.use((error: any, _req: any, res: any, _next: any) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: error.message,
    });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
};

main().catch((err: any) => {
  console.error(err);
});
