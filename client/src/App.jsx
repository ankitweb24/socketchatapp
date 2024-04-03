import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

import soundFile from "./assets/music/sound.mp3";

const App = () => {
  const [input, setinput] = useState("");
  const [message, setMessage] = useState([]);

  const socket = useMemo(() => io(`http://localhost:8000/`), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`user connected ${socket.id}`);
    });

    socket.on("msg", (data) => {
      setMessage((prevMsg) => [...prevMsg, { sender: "other", text: data }]);
      soundPlay();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const soundPlay = () => {
    let audio = new Audio(soundFile);
    audio.play();
  };

  const sendMessage = () => {
    setMessage((prevMsg) => [...prevMsg, { sender: "self", text: input }]);
    socket.emit("userMsg", input);
    setinput("");
  };

  return (
    <section>
      <div className="first_div">
        {message.map((element, index) => {
          return (
            <div
              key={index}
              style={{
                alignSelf:
                  element.sender === "self" ? "flex-start" : "flex-end",
                margin: "5px",
                padding: "20px",
                background: element.sender === "self" ? "red" : "green",
                color: "#fff",
                maxWidth: "70%",
                borderRadius: "10px",
              }}
            >
              {element.text}
            </div>
          );
        })}
      </div>

      <div className="second_div">
        <input
          value={input}
          onChange={(e) => setinput(e.target.value)}
          type="text"
          placeholder="type your message"
        />
        <button onClick={sendMessage}>send</button>
      </div>
    </section>
  );
};

export default App;
