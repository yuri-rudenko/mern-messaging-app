import { BrowserRouter, useNavigate } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import { check, getUser } from "./http/userAPI";
import Loader from "./Components/small/Loader/Loader";

const App = observer(() => {

  const {user, chat} = useContext(Context);

  useEffect(() => {

    user.setLoading(true)

    check().then(async data => {
      if(data) {
        let foundUser;
        if(data.id) foundUser = await getUser(data.tag);
        if(foundUser) {
          user.setUser(foundUser);
          user.setIsAuth(true);
          chat.setChats(foundUser.chats);
        }
      }
    })
    .finally(() => user.setLoading(false))

  }, [])


  return (user.loading ?
      <Loader absolute={true}/>
    :
      <div className="App">
          <BrowserRouter>
              <AppRouter/>
          </BrowserRouter>
      </div>)
});

export default App;
