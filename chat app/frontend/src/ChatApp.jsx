import { useEffect, useState } from "react";
import { socket } from "./socket.js";

function ChatApp() {
  const room = "chat-123";
  //! all messages and current message -->
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("user");

  useEffect(() => {
    let name = prompt("Enter username : ");

    if (!name || !name.trim()) {
      name = "Anonymous";
    }

    setUsername(name);

    // socket.join(room);
    socket.emit("joinRoom", room);

    //! update messages when new message is received -->
    socket.on("receiveMessage", (data) => {
      // console.log(data.message);

      setMessages((prev) => {
        return [...prev, data];
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div
      id="chat-app-container"
      className=" w-full h-screen flex flex-col justify-center items-center"
    >
      {/* //todo: show all messages here --> */}
      <div className="w-full h-67 text-white flex flex-col gap-2">
        {messages.map((curr) => {
          return (
            <div key={curr.id}>
              {curr.from} : {curr.message} ({curr.time})
            </div>
          );
        })}
      </div>

      {/* //todo: input box for sending message --> */}
      <div className="flex gap-2">
        <input
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          value={msg}
          id="messageField"
          name="messageField"
          placeholder="Enter a message"
          className="bg-transparent p-1 border border-white"
        />
        <button
          onClick={() => {
            if (!msg.trim()) return;

            socket.emit("sendMessage", {
              id: Date.now(),
              roomId: room,
              from: username,
              message: msg,
              time: new Date().toLocaleTimeString(),
            });

            setMsg("");
          }}
          className="border border-white py-1 px-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
