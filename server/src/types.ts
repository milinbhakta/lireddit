import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

export type MyContext = {
  req: Request & { session: any };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};

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
  feedUrl: string;
  title: string;
  description: string;
  link: string;
  language: string;
  lastBuildDate: string;
}
