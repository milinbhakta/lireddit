import React, { useEffect } from "react";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import dynamic from "next/dynamic";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import toast from "react-hot-toast";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });
import {
  makeStyles,
  useTheme,
  alpha,
  Theme,
  createStyles,
} from "@material-ui/core/styles";

interface DrawingProps {
  //Your component props
  window: Window;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    status: {
      marginTop: "10px",
      marginBottom: "10px",
    },
    clear: {
      marginBottom: "10px",
    },
  })
);

const Drawing: React.FC<DrawingProps> = (props: DrawingProps) => {
  const classes = useStyles();
  const isBrowser = typeof window !== "undefined";
  const [ml5, setML5] = React.useState(isBrowser ? require("ml5") : undefined);
  /*  ===
    ml5 Example
    SketchRNN
        === */
  let model: any;
  // Start by drawing
  let previous_pen: string = "down";
  // Current location of drawing
  let x: any;
  let y: any;
  // The current "stroke" of the drawing
  let strokePath: any;
  let seedStrokes: any = [];

  // Storing a reference to the canvas
  let canvas: any;

  //in component
  useEffect(() => {
    const newMl5 = require("ml5");
    setML5(newMl5);
  }, []);

  // The model is ready
  const modelReady = (p5: p5Types) => {
    canvas.show();
    // sketchRNN will begin when the mouse is released
    canvas?.mouseReleased(() => {
      startSketchRNN(p5);
    });
    p5.select("#status")?.html(
      "model ready - sketchRNN will begin after you draw with the mouse"
    );
  };

  // Reset the drawing
  const clearDrawing = (p5: p5Types) => {
    p5.background(220);
    // clear seed strokes
    seedStrokes = [];
    // Reset model
    model?.reset();
  };

  // sketchRNN takes over
  function startSketchRNN(p5: p5Types) {
    // Start where the mouse left off
    x = p5.mouseX;
    y = p5.mouseY;
    // Generate with the seedStrokes
    model?.generate(seedStrokes, (err: any, s: any) => {
      strokePath = s;
    });
  }

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const toastId = toast.loading("Loading...");
    const width = window.innerWidth * 0.8; // 90vw
    const height = width * (9 / 16); // Maintain a 16:9 aspect ratio

    canvas = p5.createCanvas(width, height).parent(canvasParentRef);
    // canvas = p5.createCanvas(640, 480).parent(canvasParentRef);
    // Hide the canvas until the model is ready
    canvas.hide();

    p5.background(220);
    p5.select("#status")?.html("model is loading....");
    // Load the model
    // See a list of all supported models: https://github.com/ml5js/ml5-library/blob/master/src/SketchRNN/models.js
    model = ml5.sketchRNN("everything", modelReady(p5));
    toast.success("Model Loaded!", { id: toastId });
    // Button to start drawing
    p5.select("#clear")?.mousePressed(() => {
      clearDrawing(p5);
    });
  };

  const draw = (p5: p5Types) => {
    // If the mosue is pressed capture the user strokes
    if (p5.mouseIsPressed) {
      // Draw line
      p5.stroke(0);
      p5.strokeWeight(3.0);
      p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
      // Create a "stroke path" with dx, dy, and pen
      let userStroke = {
        dx: p5.mouseX - p5.pmouseX,
        dy: p5.mouseY - p5.pmouseY,
        pen: "down",
      };
      // Add to the array
      seedStrokes.push(userStroke);
    }

    // If something new to draw
    if (strokePath) {
      // If the pen is down, draw a line
      if (previous_pen == "down") {
        p5.stroke(0);
        p5.strokeWeight(3.0);
        p5.line(x, y, x + strokePath.dx, y + strokePath.dy);
      }
      // Move the pen
      x += strokePath.dx;
      y += strokePath.dy;
      // The pen state actually refers to the next stroke
      previous_pen = strokePath.pen;

      // If the drawing is complete
      if (strokePath.pen !== "end") {
        strokePath = null;
        model?.generate((err: any, s: any) => {
          strokePath = s;
        });
      }
    }
  };

  return (
    <Layout>
      <Typography id="status" className={classes.status}>
        Loading...
      </Typography>
      <Button id="clear" variant="contained" className={classes.clear}>
        Clear
      </Button>
      {<Sketch setup={setup} draw={draw} />}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Drawing);
