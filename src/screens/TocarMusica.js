import React, { useEffect, useRef, useState } from "react";
import {
  StatusBar,
  Text,
  StyleSheet,
  Alert,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from "react-native";
import Canvas from "react-native-canvas";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Notes from "../components/notes";
import { WebView } from "react-native-webview";
import Sidebar from "../components/SideNavigation";
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";
import SideNavigation from "../components/SideNavigation";

const red = "#9b1919";
const teal = "#008080";
const green = "forestgreen";

const noteTransposition = {
  F4: 30,
  "F#4": 80,
  G4: 120,
  "G#4": 160,
  A4: 200,
  "A#4": 240,
  B4: 290,
  C5: 350,
  "C#5": 400,
  D5: 440,
  "D#5": 480,
  E5: 530,
  F5: 590,
  "F#5": 640,
  G5: 680,
  "G#5": 720,
  A5: 760,
  "A#5": 790,
};

console.log(noteTransposition);

const TocarMusica = ({ navigation, route }) => {
  const { musica } = route.params;
  
  console.log("Id:", musica)

  var arq;

  const [arquivo, setArquivo] = useState();

  const canvasRef = useRef(null);
  const webViewRef = useRef(null);

  const [shapes, setShapes] = useState([]);
  const [currentclickedShape, setcurrentclickedShape] = useState("");


  const drawCircle = (ctx, x) => {
    const centerX = x;
    const centerY = 105;

    //const centerX = 35 + offset;
    const radius = 15;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = green;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#003300";
    ctx.stroke();
  };

  const drawPath = (ctx, color, points, offset, noteNumber, noteName) => {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = color;

    let y = 0;

    ctx.beginPath();
    if (points[0]["y"] == 0) {
      y = 90;
    }

    ctx.moveTo(points[0]["x"] + offset, 90);

    for (var p = 1; p < points.length; p++) {
      if (points[p]["y"] == 0) {
        y = 90;
      } else {
        y = points[p]["y"];
      }

      ctx.lineTo(points[p]["x"] + offset, y);
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

  const handleTouch = (event, play = true) => {
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

      if (play) {
        playMidiNote(clickedShape.noteName);
        setNotePlayed(clickedShape.noteName);
      } else {
        setNotePlayed(clickedShape.noteName);
      }
    }
  };

  const [color, setColor] = useState("red");

  const handleTouchSimulate = (event, play = true, velocity) => {
    const { locationX, locationY } = event.nativeEvent;
    console.log("velocity: ", velocity);
    const clickedShape = shapes.find(
      (shape) =>
        locationX >= shape.boundingBox.minX &&
        locationX <= shape.boundingBox.maxX &&
        locationY >= shape.boundingBox.minY &&
        locationY <= shape.boundingBox.maxY
    );

    if (velocity > 40) {
      setColor(red);
    } else {
      setColor(teal);
    }

    if (clickedShape) {
      //console.log(`Clicked on ${clickedShape.noteName}`);
      //console.log(clickedShape.ctx);
      drawPath(
        clickedShape.ctx,
        color,
        clickedShape.points,
        clickedShape.offset,
        clickedShape.noteNumber,
        clickedShape.noteName
      ); //F4
      //drawCircle(clickedShape.ctx, noteTransposition[clickedShape.noteName]);

      setcurrentclickedShape(clickedShape);

      if (play) {
        playMidiNote(clickedShape.noteName);
        setNotePlayed(clickedShape.noteName);
      } else {
        setNotePlayed(clickedShape.noteName);
      }
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

  const [lessonName, setLesssonName] = useState("Primeiras Notas");

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
        drawPath(ctx, "#000000", Notes.FS4, 560 + 400 + 155, 90, "F#6"); //FS6drawCircle(ctx,"F4"),
      }
    };

    const changeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    getLesson();

    changeOrientation();
    if (canvasRef.current) {
      handleCanvas(canvasRef.current);
    }
  }, [screenSize, shapes]);
  const [arqui, setArqui] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "A barata diz que tem", value: "0" },
    { label: "As rodas do ônibus", value: "1" },
    { label: "Jingle Bells", value: "2" },
    { label: "Noite feliz", value: "3" },
    { label: "Parabéns pra você", value: "4" },
    { label: "Seu Lobato tinha um sítio", value: "5" },
    { label: "2 compassos.mid", value: "6" },
  ]);

  const [notePlayed, setNotePlayed] = useState("Waiting...");

  const playMidiNote = (noteName) => {
    let playN = 'playMidiNote("' + noteName + '"); true;';
    webViewRef.current.injectJavaScript(playN);
    console.log(playN);
    setNotePlayed(noteName);
  };

  const callPlayMidi = (index) => {
    let play = "playMidi(" + index + "); true;";
    webViewRef.current.injectJavaScript(play);
  };

  const callResponse=()=>{
     
    console.log("Response called");
    let play = "response('"+ arqui +"'); true;";
    webViewRef.current.injectJavaScript(play);

  };

  const callPlayMidiByName = () => {
    console.log(musicaId);
    let play = "playMidiByName('" + arqui +"'); true;";
    console.log(play);
    webViewRef.current.injectJavaScript(play);
  };

  const onMessage = (event) => {
    const msg = JSON.parse(event.nativeEvent.data);
    //Alert.alert('Message from WebView', msg);
    console.log('Message from WebView', msg);

    if (msg.type === "playNote" && msg.noteName && msg.noteVelocity) {
      simulateClickByNoteName(msg.noteName, msg.noteVelocity, msg.noteNumber);
    }

    if (msg.type === "EOF" && msg.noteNumber) {
      console.log("Notes length: ", msg.noteNumber);
    }



    if (msg.type == "noteOff" && msg.noteName) {
      drawPath(
        currentclickedShape.ctx,
        currentclickedShape.color,
        currentclickedShape.points,
        currentclickedShape.offset,
        currentclickedShape.noteNumber,
        currentclickedShape.noteName
      ); //F4
      setcurrentclickedShape("");
    }
  };

  const simulateClickByNoteName = (noteName, noteVelocity, noteNumber) => {
    console.log(
      noteName,
      "velocity: ",
      noteVelocity,
      " noteNumber: ",
      noteNumber
    );
    const shape = shapes.find((s) => s.noteName === noteName);
    if (!shape) return;

    // Create a synthetic event object with the center of the bounding box
    const syntheticEvent = {
      nativeEvent: {
        locationX: (shape.boundingBox.minX + shape.boundingBox.maxX) / 2,
        locationY: (shape.boundingBox.minY + shape.boundingBox.maxY) / 2,
      },
    };

    handleTouchSimulate(syntheticEvent, false, noteVelocity);
  };

  const [arrayList, setArrayList] = useState([]);
  const [musicaId, setMusicaId] = useState();
  const [urlArquivo, setUrlArquivo] = useState();

  const url = "/uploads/midi/04-subindo-e-descendo.mid";

  const getLesson = async () => {

    //const [file, setFile] = useState();
    try {
      return await API.get(`${BASE_URL}/musicas/${musica}`)
        .then((res) => {
          setArrayList(res.data);
          //console.log(arrayList);
          console.log(res.data);
          setLesssonName(res.data.nome);
          //setMusicaId(res.data.musicaId);
          setArqui(res.data.urlArquivo);
          //setFile(res.data.musica.urlArquivo);

          console.log("arq: ", arqui);

          console.log(res.data.urlArquivo);
        })
        .catch((err) => {
          returnError(err);
        });
    } catch (err) {
      returnError(err);
    }
  };

  return (
    
    <View
      style={styles.container}
      onTouchStart={handleTouch}
      onTouchEnd={handleTouchEnd}
    >
      <StatusBar hidden={true} />
      <Sidebar navigation={navigation} />

      <Text style={[styles.text, { color: "#bf0939" }]}>{lessonName}</Text>
      <TouchableOpacity
        style={styles.button}

        onPress={() => callResponse()}

      >
        <Text style={styles.buttonText}>Tocar</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{notePlayed}</Text>
      <WebView
        ref={webViewRef}
        source={{
          uri: "http://atendimento.caed.ufmg.br:8000/ebooker/magickeys/embedplayersequence.php",
        }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScriptBeforeContentLoaded={`
          // Optional: just ensure the page knows ReactNativeWebView exists
          window.ReactNativeWebView = window.ReactNativeWebView || {
            postMessage: function(msg) {
              console.log("RNWebView stub: ", msg);
            }
          };
          true;
        `}
      />

      <Canvas
        ref={canvasRef}
        style={[
          styles.canvas,
          {
            marginTop: -80,
            width: screenSize.width,
            height: screenSize.height,
          },
        ]}
      />
    </View>
  );
};

export default TocarMusica;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#11c0f7",
  },
  canvas: {},
  text: {
    fontSize: 36,
    color: "blue",
    fontWeight: "bold",
  },
  dropdown: {
    borderColor: "#888",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    padding: 15,
    color: "#000000",
  },
  dropdownList: {
    width: "30%",
    borderColor: "#888",
    //backgroundColor: '#fff',
  },

  button: {
    backgroundColor: "#b407a3",
    padding: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});