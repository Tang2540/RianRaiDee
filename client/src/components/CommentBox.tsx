import { Link } from "react-router-dom";

interface CommentBoxProps {
  placeItem?: {
    content: string;
      user_id: string;
      grade: string;
      sec: number
      year: number;
      publish_date: string
      user: {
        display_name: string;
        picture:string
      };
  }|undefined;
  profileItem?: {
    content: string;
    course_id: string
    course: {
      name: string;
    };
  }|undefined;
}

const CommentBox = ({ placeItem, profileItem }: CommentBoxProps) => {

if(placeItem){
  
  return (
    <>
      <div className="flex items-center mb-2" data-test="comment-box-user">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt={placeItem.user.display_name}
              src={"http://localhost:3000/images/"+placeItem.user.picture}
            />
          </div>
        </div>
        <Link to={`/profile/${placeItem.user_id}`} data-test="comment-display-name">
          {placeItem.user.display_name}
        </Link>
      </div>
      <p data-test="comment-content">{placeItem.content}</p>

      <div className="mt-6" data-test="comment-box-detail">
        <p data-test="grade">เกรดที่ได้: {placeItem.grade}</p>
        <p data-test="sec">sec: {placeItem.sec}</p>
        <p data-test="year">ปีการศึกษา: {placeItem.year}</p>
        <p data-test="date">{placeItem.publish_date}</p>
      </div>
      <div className="divider"></div>
    </>
  )
}

if(profileItem){
  
  return (
  <>
      <div className="flex items-center mb-2">
      <Link to={`/${profileItem.course_id}`}>{profileItem?.course.name}</Link>
      </div>
      <p>{profileItem?.content}</p>
      <div className="divider"></div>
    </>
)}
};

export default CommentBox;
