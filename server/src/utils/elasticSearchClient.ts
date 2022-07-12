import elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "error",
});

client.ping({ requestTimeout: 30000 }, (error) => {
  if (error) {
    console.log("elasticsearch cluster is down!");
  } else {
    console.log("Everything is ok");
  }
});

export default client;
