import Login from "./Components/Login"
import Main from "./Components/Main"
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