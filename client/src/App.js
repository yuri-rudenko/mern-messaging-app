import { BrowserRouter, useNavigate } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import { check, getUser } from "./http/userAPI";
import Loader from "./Components/small/Loader/Loader";

const setChatNames = function (chats, user) {

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
        }
      }
    })
      .finally(() => user.setLoading(false))

  }, [])


  return (user.loading ?
    <Loader absolute={true} />
    :
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>)
});

export default App;
