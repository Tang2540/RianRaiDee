import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../utils/Auth/useAuth";
import CommentBox from "../components/CommentBox";
import axios from "axios";

interface PlaceData {
  course: {
    _id: string;
    course_id: string;
    name: string;
    desc: string
  };
  review: [
    {
      content: string;
      user_id: string;
      grade: string;
      sec: number
      year: number;
      publish_date: string
      user: {
        display_name: string;
        picture:string;
      };
    }
  ];
}

const Place = () => {
  const fetchedData = useLoaderData() as PlaceData;
  const { user, checkAuthStatus } = useAuth();


  const [data, setData] = useState<PlaceData>(fetchedData);
  const [comment, setComment] = useState("");
  const [grade, setGrade] = useState("");
  const [sec, setSec] = useState("");
  const [year, setYear] = useState("");

  function formatDateThai(timestamp:number) {
    const date = new Date(timestamp);
    const year = date.getFullYear() + 543; // เพิ่ม 543 ให้เป็น พ.ศ.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}/${month}/${year}`;
  }


  const handleClick = async () => {
    checkAuthStatus()
    await axios
      .post(`http://localhost:3000/api/review/${data.course._id}`, {
        username: user?.username,
        content: comment,
        grade,
        sec,
        year,
        publish_date: formatDateThai(Date.now())
      })
      .then((res) => {
        setData(res.data);
        setComment("");
        setGrade("");
        setSec("");
        setYear("");
      })
      .catch((err) => {
        console.log(err);
      });

      document.getElementById('my_modal_3')?.removeAttribute('open');
      
  };

  return (
    <>
    <div className="container mx-auto flex flex-col gap-5 max-w-6xl mt-12">
      <div className="text-5xl">{data.course.name}</div>
      <div className="divider"></div>
      <p>{data.course.desc}</p>
      <div className="divider"></div>

      <section className="px-12">
        <div className="flex justify-between">
        <div className="text-5xl">รีวิว</div>
        <button className="btn" onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_3"
                  ) as HTMLDialogElement;
                  modal.showModal();
                }} data-test="open-review-box-btn">เขียนรีวิว</button>
        </div>
        <div className="divider"></div>


        <div className={`flex flex-col mt-6 ${data.review && data.review.length > 0 ? '':'justify-center items-center'}`}>

          {data.review && data.review.length > 0 ? (
            data.review.map((item, index) => (
              <div key={index} data-test="comment-box">
                <CommentBox placeItem={item} />
              </div>
            ))
          ) : (
            <div className="text-7xl mt-16">ยังไม่มีรีวิว</div>
          )}
        </div>
      </section>
    </div>

    <dialog id="my_modal_3" className="modal">
  <div className="modal-box max-w-6xl">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
   {user ?
    (<div className="flex flex-col gap-11">
    <h3 className="font-bold text-lg">เขียนรีวิว</h3>
    <textarea className="textarea textarea-bordered w-full mt-5" placeholder="กรุณารีวิวด้วยคำที่สุภาพ" value={comment} onChange={(e)=>{setComment(e.target.value)}} data-test="review-text"></textarea>
    <div>
  <h4>เกรดที่ได้</h4>
  <select className="select select-bordered w-full max-w-xs" value={grade} onChange={(e)=>{setGrade(e.target.value)}}>
  <option disabled selected>เลือกเกรด</option>
  <option value="A">A</option>
  <option value="B+">B+</option>
  <option value="B">B</option>
  <option value="C+">C+</option>
  <option value="C">C</option>
  <option value="D+">D+</option>
  <option value="D">D</option>
  <option value="F">F</option>
</select>
</div>
    <div>
      <h4>เซคที่เรียน</h4>
      <input type="text" className="input input-bordered w-full max-w-xs" value={sec} onChange={(e)=>{setSec(e.target.value)}} data-test="review-sec"/>
    </div>
    <div>
      <h4>ปีการศึกษาที่เรียน</h4>
      <input type="text" className="input input-bordered w-full max-w-xs" value={year} onChange={(e)=>{setYear(e.target.value)}} data-test="review-year"/>
    </div>
    <button className="btn" onClick={handleClick} data-test="review-submit-btn">ลงรีวิว</button>
    </div>)
    :
    (<div className="flex flex-col items-center justify-center">
    <div className="text-7xl">เข้าสู่ระบบเพื่อรีวิว</div>
    <Link to="/auth" className="mt-8 btn" data-test="review-login-btn">เข้าสู่ระบบ</Link>
    </div>)}
  </div>
</dialog>
    </>
  );
};

export default Place;
