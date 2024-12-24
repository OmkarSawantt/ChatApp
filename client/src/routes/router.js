import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import CheckEmail from "../pages/CheckEmail";
import CheackPassword from "../pages/CheackPassword";
import Home from "../pages/Home";
import Message from "../component/Message";
import Landing from "../pages/Landing";
import AuthLayout from "../layout/layout";
import ErrorPage from "../pages/ErrorPage"
import GroupChat from "../component/GroupChat";
import Group from "../pages/Group";
const router=createBrowserRouter([
{
    path:"/",
    element:<App/>,
    errorElement: <ErrorPage />,
    children:[
        {
            path:"register",
            element:<AuthLayout><Register></Register></AuthLayout>
        },
        {
            path:"email",
            element:<AuthLayout><CheckEmail></CheckEmail></AuthLayout>
        },
        {
            path:"password",
            element:<AuthLayout><CheackPassword></CheackPassword></AuthLayout>
        },
        {
            path:"",
            element:<Landing/>
        },
        {
            path:"home",
            element:<Home/>,
            children:[
                {
                    path:':userId',
                    element:<Message/>
                }
            ]
        },
        {
            path:'group',
            element:<Group/>,
            children:[
                {
                    path:':groupId',
                    element:<GroupChat/>
                }
            ]
        }
    ]
}
])
export default router