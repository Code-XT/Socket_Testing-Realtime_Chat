import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  let [members, setMembers] = useState([]);
  let typingTimeout;
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`connected: ${socket.id}`);
      document.getElementById("socket-id").innerHTML = socket.id;
      setStatus("online");
      socket.emit("join", socket.id);
    });
    socket.on("disconnect", () => {
      console.log(`a user disconnected: ${socket.id}`);
      setStatus("offline");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", e.target[0].value, e.target[1].value, message);
    e.target[1].value
      ? (document.getElementById("messages").innerHTML += `<p>Me 
        (${e.target[1].value}): ${message}</p>`)
      : (document.getElementById(
          "messages"
        ).innerHTML += `<p>Me: ${message}</p>`);
    setMessage("");
  };

  socket.on("response", (message) => {
    setMessages((messages = [...messages, message]));
  });

  socket.on("joined", (member) => {
    setMembers((members = [...member]));
    console.log(members);
  });

  socket.on("typing_status", (isTyping) => {
    document.getElementById("typing").innerHTML = `${
      isTyping ? " is typing" : ""
    }`;
  });

  return (
    <>
      <h3>Socket.IO Chat</h3>
      <h5 id="socket-id"></h5>
      <form onSubmit={(e) => sendMessage(e)}>
        <input type="text" placeholder="username" />
        <input type="text" placeholder="receiver" />
        <input
          type="text"
          placeholder="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              socket.emit("typing", false);
            } else {
              socket.emit("typing", true);
              clearTimeout(typingTimeout);
              typingTimeout = setTimeout(() => {
                socket.emit("typing", false);
              }, 1000);
            }
          }}
        />
        <button type="submit">Send</button>
      </form>

      <div>
        <h4>Members</h4>
        {members.map((mb) => (
          <p>
            {status === "online" ? "Online" : "Offline"}: {mb}
            <span id="typing"></span>
          </p>
        ))}
      </div>
      <h2>Messages</h2>
      <div id="messages">
        {messages.map((m) => (
          <p>
            {m.receiver
              ? `${m.username} (Private): ${m.message}`
              : `${m.username}: ${m.message}`}
          </p>
        ))}
      </div>
    </>
  );
}

export default App;
