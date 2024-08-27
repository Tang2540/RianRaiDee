import { useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../utils/Auth/useAuth';

interface UserData {
    _id:string
    username:string
  }

const Profile = () => {
    const data = useLoaderData() as UserData;

    const {user,checkAuthStatus} = useAuth()

    useEffect(() => {
        checkAuthStatus();
      }, [checkAuthStatus]);

    if(!user){
      <div>something is wrong</div>
    }
    
  return (
    <>
    <div>{data.username}</div>
    {user?._id==data._id&&<div>you have the right to see this</div>}
    </>
  )
}

export default Profile