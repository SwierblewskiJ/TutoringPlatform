import { createBrowserRouter } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import Home from '../pages/Home';
import AuthGuard from './AuthGuard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AddAdPage from '../pages/AddAdPage';
import NotFound from '../pages/NotFound';
import MyProfile from '../pages/MyProfile';
import AdDetails from '../pages/AdDetails';


export const router = createBrowserRouter([
    {
        path: "/",
        element : <Wrapper />,
        children: [

            {path: "/", element: <Home/>},
            {path: "/ad/:id" , element: <AdDetails/>},
            {path: "/login", element: <Login/>},
            {path: "/register", element: <Register/> },
            {path: "/ad/:id" , element: <AdDetails/>},

            {path: "*", element: <NotFound/>},

            {
                element: <AuthGuard/>,
                children: [
                    {path: "/me", element: <MyProfile/>},
                ]

            },
            { 
                element: <AuthGuard allowedRoles={['Tutor']}/>,
                children: [
                    { path: "/addAd", element: <AddAdPage /> },
                    // { path: "/myOffers", element: <MyOffers /> },
                ]

            },
            {
                element: <AuthGuard allowedRoles={['Student']} />, 
                children: [
                    // { path: "/myLessons", element: <MyLessons /> },
                ]
            }
        ],
    },
]);