import Login from '../pages/Login'
import Layout from '../pages/Layout'
import { createBrowserRouter } from 'react-router-dom'
const router=createBrowserRouter([
{
    path:'/',
    element:<Layout/>,
},
{
  path: '/login',
  element: <Login />,
},
])
export default router