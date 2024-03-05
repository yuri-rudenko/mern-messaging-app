import { BrowserRouter } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import { check } from "./http/userAPI";

const App = observer(() => {

  const {user} = useContext(Context);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    check().then(data => {
      if(data) {
        user.setUser(true)
        user.setIsAuth(true)
      }
    })
    .finally(() => setLoading(false))

  }, [])

  if(loading) return <p>loading...</p>

  return (
      <div className="App">
          <BrowserRouter>
              <AppRouter/>
          </BrowserRouter>
      </div>
  );
})

export default App;
