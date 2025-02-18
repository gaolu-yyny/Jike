import Login from '../pages/Login'
import Layout from '../pages/Layout'
import { createBrowserRouter } from 'react-router-dom'
import AuthRoute from '../component/AuthRoute'
import Home from '@/pages/Home'
import Publish from '@/pages/Publish'
import Article from '@/pages/Article'
const router=createBrowserRouter([
{
    path:'/',
    element:(<AuthRoute><Layout /></AuthRoute>),
    children:[
      {
        // path:'home',
        index:true,
        element:<Home/>
      },
      {
        path:'article',
        element:<Article/>
      },
      {
        path:'publish',
        element:<Publish/>
      }
    ]
},
{
  path: '/login',
  element: <Login />,
},
])
export default router