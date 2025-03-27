import { BrowserRouter, useNavigate } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { observer } from "mobx-react-lite";
import { createContext, useContext, useEffect, useState } from "react";
import { Context } from ".";
import { check, getUser } from "./http/userAPI";
import Loader from "./Components/small/Loader/Loader";
import { io } from "socket.io-client";

let socket;
socket = io(process.env.REACT_APP_API_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

export const SocketContext = createContext();

export const setChatNames = function (chats, user) {

  const newChats = chats.map(chat => {

    if (!chat.isGroup) {
      const foundUser = chat?.users.find(u => u._id !== user._id);
      return { ...chat, name: foundUser.name, displayPicture: foundUser.image }
    }

    return chat;

  })

  return newChats;

}

const App = observer(() => {

  const { user, chat } = useContext(Context);

  useEffect(() => {

    user.setLoading(true)

    check().then(async data => {
      if (data) {
        let foundUser;
        if (data.id) foundUser = await getUser(data.tag);
        if (foundUser) {
          user.setUser(foundUser);
          user.setIsAuth(true);
          chat.setChats(setChatNames(foundUser.chats, foundUser));
          socket.emit("setup", user.user);
        }
      }
    })
      .finally(() => user.setLoading(false))

    return () => {
      socket.removeAllListeners("message recieved");
    };

  }, [])

  useEffect(() => {

    const handleAddedToChat = (addingChat) => {

      if (!addingChat._id) return;

      chat.appendChat(addingChat);

    }

    socket.on("added to chat", handleAddedToChat);

    return () => {
      socket.removeAllListeners("added to chat");
    };

  }, []);


  return (user.loading ?
    <Loader absolute={true} />
    :
    <div className="App">
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </SocketContext.Provider>
    </div>)
});

export default App;
