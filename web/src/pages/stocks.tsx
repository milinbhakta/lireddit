import { useEffect, useMemo, useState } from "react";
import protobuf from "protobufjs";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
const { Buffer } = require("buffer/");
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import toast from "react-hot-toast";
import { log } from "console";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ticker: {
      fontSize: "12.0vmin",
      textAlign: "center",
    },
    price: {
      fontSize: "16.0vmin",
      textAlign: "center",
    },
    priceTime: {
      fontSize: "8.0vmin",
      textAlign: "center",
    },
    warning: {
      fontSize: "2.0vmin",
      color: "red",
      textAlign: "center",
    },
    up: {
      color: "#34a853",
    },
    down: {
      color: "#d93025",
    },
    chart: {
      color: "white",
    },
  })
);

const Stocks = () => {
  const classes = useStyles();
  const ticker = "NVDA";

  const [series, setSeries] = useState([
    {
      data: [],
      name: ticker,
    },
  ]);
  const [price, setPrice] = useState(-1);
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState<Date | null>(null);


  const stonksUrl: string = `${process.env.NEXT_PUBLIC_SERVER_URL}/stocks/${ticker}`;

  const getStonks = async () => {
    const response = await fetch(stonksUrl);
    return response.json();
  };

  const directionEmojis = {
    up: "🚀",
    down: "💩",
    "": "",
  };

  const round = (number: number) => {
    return number ? +number.toFixed(2) : null;
  };

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick",
      height: 350,
      fontFamily: ["barlow", "san-serif"].join(","),
      background: "#fff",
      foreColor: "black",
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        show: true,
        format: "datetime",
        formatter: (value: any) => {
          return new Date(value).toLocaleTimeString();
        },
      },
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName: any) => seriesName,
        },
      },
      z: {
        formatter: undefined,
        title: "Size: ",
      },
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
        colors: {
          upward: "#3C90EB",
          downward: "#DF7D46",
        },
      },
    },
  };

  useEffect(() => {
    let timeoutId: any;
    async function getLatestPrice() {
      const toastId = toast.loading("Loading...");
      try {
        const data = await getStonks();

        const tickerData = data.chart.result[0];
        console.log(tickerData);
        setPrevPrice(price);
        setPrice(tickerData.meta.regularMarketPrice.toFixed(2));
        setPriceTime(
          new Date((tickerData.meta.regularMarketTime * 1000) as unknown as number)
        );
        const quote = tickerData.indicators.quote[0];
        const prices = tickerData.timestamp.map((timestamp: any, index: any) => ({
          x: new Date(timestamp * 1000),
          y: [
            quote.open[index],
            quote.high[index],
            quote.low[index],
            quote.close[index],
          ].map(round),
        }));
        setSeries([
          {
            data: prices,
            name: ticker,
          },
        ]);
      } catch (error) {
        console.log(error);
      }
      toast.success("Got the Data!", {
        id: toastId,
        position: "bottom-center",
        duration: 500,
      });
      timeoutId = setTimeout(getLatestPrice, 5000 * 2);
    }

    getLatestPrice();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const direction = useMemo(
    () => (prevPrice < price ? "up" : prevPrice > price ? "down" : ""),
    [prevPrice, price]
  );

  return (
    <Layout>
      <div className="warning">
        FOR ENTERTAINMENT PURPOSES ONLY!
        <br />
        DO NOT USE THIS SITE AS FINANCIAL ADVICE!
      </div>
      <div className={classes.ticker}>{ticker}</div>
      <div className={[classes.price, direction].join(" ")}>
        ${price} {directionEmojis[direction]}
      </div>
      <div className={classes.priceTime}>
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <div className={classes.chart}>
        {typeof window !== "undefined" && (
          <Chart
            options={chartOptions}
            series={series}
            type="candlestick"
            width="100%"
            height="350"
          />
        )}
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Stocks);
