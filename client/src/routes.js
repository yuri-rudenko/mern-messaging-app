import Login from "./Pages/Login"
import Main from "./Pages/Main"
import Profile from "./Components/Profile"

export const authRoutes = [
    {
        path: '/',
        Component: Main,
    },
    {
        path: '/profile',
        Component: Profile,
    },
]

export const publicRoutes = [
    {
        path: '/login',
        Component: Login,
    },
    {
        path: '/registration',
        Component: Login,
    },
]