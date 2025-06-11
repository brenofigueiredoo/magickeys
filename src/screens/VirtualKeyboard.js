import React, { useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, View, Dimensions } from "react-native";
import Canvas from "react-native-canvas";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Notes from "../components/notes";
import { WebView } from "react-native-webview";
import SideNavigation from "../components/SideNavigation";

const red = "#9b1919";

const VirtualKeyboard = ({ navigation }) => {
  const canvasRef = useRef(null);
  const webViewRef = useRef(null);

  const [shapes, setShapes] = useState([]);
  const [currentclickedShape, setcurrentclickedShape] = useState("");

  const drawPath = (ctx, color, points, offset, noteNumber, noteName) => {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(points[0]["x"] + offset, points[0]["y"]);

    for (var p = 1; p < points.length; p++) {
      ctx.lineTo(points[p]["x"] + offset, points[p]["y"]);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    const shape = {
      ctx,
      color,
      points,
      offset,
      noteNumber,
      noteName,
      boundingBox: {
        minX: Math.min(...points.map((p) => p.x)) + offset,
        maxX: Math.max(...points.map((p) => p.x)) + offset,
        minY: Math.min(...points.map((p) => p.y)),
        maxY: Math.max(...points.map((p) => p.y)),
      },
    };

    shapes.push(shape);
  };

  const HTML = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>
</head>
<body>
  <script> 
  console.log('HTML_CONTENT loaded');

  // Start Tone.js once and create a single synth instance
    Tone.start();
    const synth = new Tone.Synth().toDestination();

    document.addEventListener("message", function(event) {
      const data = JSON.parse(event.data);
      if (data.type === "playSound") {
        
        synth.triggerAttackRelease(data.note, "8n");
      }
    });
  </script>
</body>
</html>
`;

  const [screenSize, setScreenSize] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  // Function to update dimensions on screen resize
  const updateScreenSize = () => {
    setScreenSize({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    });
  };

  const handleTouch = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    const clickedShape = shapes.find(
      (shape) =>
        locationX >= shape.boundingBox.minX &&
        locationX <= shape.boundingBox.maxX &&
        locationY >= shape.boundingBox.minY &&
        locationY <= shape.boundingBox.maxY
    );

    if (clickedShape) {
      //console.log(`Clicked on ${clickedShape.noteName}`);
      //console.log(clickedShape.ctx);
      drawPath(
        clickedShape.ctx,
        red,
        clickedShape.points,
        clickedShape.offset,
        clickedShape.noteNumber,
        clickedShape.noteName
      ); //F4
      setcurrentclickedShape(clickedShape);
      playTone(clickedShape.noteName);
    }
  };

  const playTone = (noteName) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: "playSound", note: noteName })
      );
    }
  };

  const handleTouchEnd = (event) => {
    drawPath(
      currentclickedShape.ctx,
      currentclickedShape.color,
      currentclickedShape.points,
      currentclickedShape.offset,
      currentclickedShape.noteNumber,
      currentclickedShape.noteName
    ); //F4
    setcurrentclickedShape("");
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      updateScreenSize
    );

    return () => subscription.remove(); // Cleanup event listener
  }, []);

  useEffect(() => {
    const handleCanvas = (canvas) => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = screenSize.width;
        canvas.height = screenSize.height - 50;

        var offset = 0;
        var k = 63;
        let shapes = [];

        drawPath(ctx, "#FFFFFF", Notes.F4, 0, 65, "F4"); //F4
        drawPath(ctx, "#000000", Notes.FS4, 0, 66, "F#4"); //FS4
        drawPath(ctx, "#FFFFFF", Notes.G4, 0, 67, "G4"); //G4
        drawPath(ctx, "#000000", Notes.GS4, 0, 68, "G#4"); //G$4
        drawPath(ctx, "#FFFFFF", Notes.A4, 0, 69, "A4"); //A4
        drawPath(ctx, "#000000", Notes.AS4, 0, 70, "A#4"); //A#4
        drawPath(ctx, "#FFFFFF", Notes.B4, 0, 71, "B4"); //B4
        drawPath(ctx, "#FFFFFF", Notes.C5, 0, 72, "C5"); //C5
        drawPath(ctx, "#000000", Notes.CS5, 0, 73, "C#5"); //CS5
        drawPath(ctx, "#FFFFFF", Notes.D5, 0, 74, "D5"); //D5
        drawPath(ctx, "#000000", Notes.CS5, 80, 75, "D#5"); //DS5
        drawPath(ctx, "#FFFFFF", Notes.B4, 560 - 320, 76, "E5"); //E5
        drawPath(ctx, "#FFFFFF", Notes.F4, 560, 77, "F5"); //F5
        drawPath(ctx, "#000000", Notes.FS4, 480 + 55 + 25, 78, "F#5"); //FS5
        drawPath(ctx, "#FFFFFF", Notes.G4, 560, 79, "G5"); //G5
        drawPath(ctx, "#000000", Notes.GS4, 480 + 55 + 25, 80, "G#5"); //GS5
        drawPath(ctx, "#FFFFFF", Notes.A4, 480 + 80, 81, "A5"); //A5
        drawPath(ctx, "#000000", Notes.AS4, 480 + 80, 82, "A#5"); //AS5
        drawPath(ctx, "#FFFFFF", Notes.B4, 480 + 80, 83, "B5"); //B5
        drawPath(ctx, "#FFFFFF", Notes.C5, 480 + 80, 84, "C6"); //C6
        drawPath(ctx, "#000000", Notes.CS5, 480 + 55 + 25, 85, "C#6"); //CS6
        drawPath(ctx, "#FFFFFF", Notes.D5, 480 + 80, 86, "D6"); //D6
        drawPath(ctx, "#000000", Notes.CS5, 480 + 80 + 55 + 25, 87, "D#6"); //DS6
        drawPath(ctx, "#FFFFFF", Notes.B4, 560 + 80 + 80 + 80, 88, "E6"); //E6
        drawPath(
          ctx,
          "#FFFFFF",
          Notes.F4,
          +80 + 160 + 560 + 80 + 80 + 80 + 80,
          89,
          "F6"
        ); //F6
        drawPath(ctx, "#000000", Notes.FS4, 560 + 400 + 155, 90, "F#6"); //FS6
      }
    };

    const changeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    changeOrientation();
    if (canvasRef.current) {
      handleCanvas(canvasRef.current);
    }
  }, [screenSize, shapes]);

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouch}
      onTouchEnd={handleTouchEnd}
    >
      <StatusBar hidden={true} />
      <SideNavigation navigation={navigation} />
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: HTML }}
        onLoad={() => console.log("WebView content loaded successfully!")}
      />

      <Canvas
        ref={canvasRef}
        style={[
          styles.canvas,
          { width: screenSize.width, height: screenSize.height },
        ]}
      />
    </View>
  );
};

export default VirtualKeyboard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  canvas: {
    paddingTop: 15,
    backgroundColor: "#fff",

    borderLeftColor: "#fff",
    borderLeftWidth: 5,
  },
  sidebar: {
    width: 90,
    alignItems: "center",
    paddingTop: 20,
    flex: 1, // Allow sidebar to take full height
  },

  icon: {
    paddingVertical: 50,
  },
});
