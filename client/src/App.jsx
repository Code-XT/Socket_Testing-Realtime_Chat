import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function App({ socket }) {
  const [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  let [members, setMembers] = useState([]);
  let typingTimeout;
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      setStatus("online");

      socket.emit("join", socket.id, username);
    });
    socket.on("disconnect", () => {
      setStatus("offline");
    });
    return () => {
      socket.close();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", username, e.target[0].value, message);
    // e.target[0].value
    //   ? (document.getElementById(
    //       "messages"
    //     ).innerHTML += `<p>Me (${e.target[0].value}): ${message}</p>`)
    //   : (document.getElementById(
    //       "messages"
    //     ).innerHTML += `<p>Me: ${message}</p>`);
    setMessage("");
  };

  socket.on("response", (message) => {
    setMessages((messages = [...messages, message]));
  });

  socket.on("joined", (member) => {
    setMembers((members = [...member]));
  });

  socket.on("typing_status", (isTyping, memberId) => {
    const typingSpan = document.getElementById(`typing_${memberId}`);
    if (typingSpan) {
      typingSpan.innerHTML = isTyping ? " is typing" : "";
    }
  });

  const handleLogout = () => {
    socket.close();
    navigate("/");
    const newUsers = members.filter((user) => user.receiver !== username);
    setMembers(newUsers);
  };
  console.log(messages);

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-green-400">
        <div className="bg-white bg-opacity-25 p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl text-center font-bold mb-4 text-white">
            Socket.IO Chat
          </h3>
          <h3 className="text-lg text-center text-gray-600 mb-4">
            Welcome {username}
          </h3>

          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 mb-4"
            >
              Logout
            </button>
          </div>

          <form
            onSubmit={(e) => sendMessage(e)}
            className="flex items-center mb-4"
          >
            <input
              type="text"
              placeholder="Receiver"
              className="flex-grow p-2 mr-2 border rounded-lg focus:outline-none bg-opacity-50"
            />
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  socket.emit("typing", {
                    isTyping: false,
                    memberId: socket.id,
                  });
                } else {
                  socket.emit("typing", {
                    isTyping: true,
                    memberId: socket.id,
                  });
                  clearTimeout(typingTimeout);
                  typingTimeout = setTimeout(() => {
                    socket.emit("typing", {
                      isTyping: false,
                      memberId: socket.id,
                    });
                  }, 1000);
                }
              }}
              className="flex-grow p-2 border rounded-lg focus:outline-none bg-opacity-50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ml-2"
            >
              Send
            </button>
          </form>
          <div>
            <h4 className="text-lg font-bold mb-2 text-white">Members</h4>
            {members.map((mb) => (
              <p key={mb.id} className=" mb-2 text-white">
                {status === "online" ? "Online" : "Offline"}: {mb.receiver}
                <span id={`typing_${mb.id}`} className="ml-2"></span>
              </p>
            ))}
          </div>
          <h2 className="text-xl font-bold mt-6 mb-4 text-white">Messages</h2>
          <div
            id="messages"
            className="max-h-80 overflow-y-auto"
            style={{ maxHeight: "400px" }}
          >
            {messages.map((m, index) => (
              <p key={index} className="my-2 text-white">
                {m.receiver
                  ? (m.username === username ? m.receiver : m.username) +
                    " (Private): " +
                    m.message
                  : (m.username === username ? "Me" : m.username) +
                    ": " +
                    m.message}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
