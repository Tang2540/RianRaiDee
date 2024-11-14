import { useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../utils/Auth/useAuth';
import CommentBox from '../components/CommentBox';

interface UserData {
  user:{
    _id:string;
    username:string;
    display_name:string;
  },
  reviews:[
    {
      content:string;
      course_id: string;
      course:{
        name:string;
        province:string;
      }
    }
  ]
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
    <div className="container mx-auto flex flex-col gap-5 max-w-6xl mt-12">
    <div>{data.user.display_name}</div>
    {data.reviews.map((item,index)=>(
      <div key={index}>
        <CommentBox profileItem={item}/>
      </div>
    ))}

    {user?._id==data.user._id&&<div>you have the right to see this</div>}
    </div>
  )
}

export default Profile