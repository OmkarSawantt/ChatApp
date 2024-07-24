import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import CheckEmail from "../pages/CheckEmail";
import CheackPassword from "../pages/CheackPassword";
import Home from "../pages/Home";
import Message from "../component/Message";
import Landing from "../pages/Landing";

const router=createBrowserRouter([
{
    path:"/",
    element:<App/>,
    children:[
        {
            path:"register",
            element:<Register/>
        },
        {
            path:"email",
            element:<CheckEmail/>
        },
        {
            path:"password",
            element:<CheackPassword/>
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
                    path:'userId',
                    element:<Message/>
                }
            ]
        }
    ]
}
])
export default router