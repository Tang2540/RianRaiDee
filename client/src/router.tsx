import { createBrowserRouter, LoaderFunctionArgs } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Place from './pages/Place'
import SuggestEdit from './pages/SuggestEdit';
import Auth from './layouts/Auht';
import Profile from './pages/Profile';

const fetchPlace = async ({params}:LoaderFunctionArgs) => {
  const id = params.id
  const res = await fetch(`http://localhost:3000/api/place/${id}`);
  const data = await res.json();
  return data
}

const fetchUser = async ({params}:LoaderFunctionArgs)=>{
  const id = params.id
  const res = await fetch(`http://localhost:3000/api/profile/${id}`)
  const data = await res.json()
  return data
}

const router = createBrowserRouter([
    {
      element: <MainLayout /> ,
      children:[
        {path:"/",element:<Home />},
        {path:"/:id",element:<Place/>,loader: fetchPlace},
        {path:"/edit/:id",element:<SuggestEdit/>},
        {path:"/profile/:id",element:<Profile/>,loader: fetchUser}
      ]
    },
    {path:"/auth",element:<Auth/>}
    // Add more routes here as needed
  ]);
 
  export default router;