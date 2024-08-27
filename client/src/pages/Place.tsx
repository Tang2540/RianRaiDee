import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/Auth/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";

interface PlaceData {
  park: {
    name: string;
    _id: string;
  };
  review: [
    {
      content: string;
      user_id: string;
      user: {
        username: string;
      };
    }
  ];
}

const Place = () => {
  const fetchedData = useLoaderData() as PlaceData;
  const navigate = useNavigate();
  const { user, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const [data, setData] = useState<PlaceData>(fetchedData);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState(0);

  const handleClick = async () => {
    await axios
      .post(`http://localhost:3000/api/review/${data.park._id}`, {
        username: user?.username,
        content: comment,
        ratings,
      })
      .then((res) => {
        setData(res.data);
        setComment("");
        setRatings(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container mx-auto flex flex-col gap-5">
      <div className="text-5xl">{data.park.name}</div>
      <div className="divider"></div>
      <div className="flex items-end w-full h-[660px] lg:h-[800px] bg-[url(https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp)] bg-cover p-4">
        <button>hit me senpai</button>
      </div>
      <div className="divider"></div>
      <div>
        <div>Reviews</div>
      {data.review.map(
        (
          item: {
            content: string;
            user_id: string;
            user: { username: string };
          },
          index: number
        ) => (
          <div key={index}>
            <Link to={`/profile/${item.user_id}`}>{item.user.username}</Link>:
            {item.content}
          </div>
        )
      )}
      </div>
      <button
        onClick={() => {
          navigate(`/edit/${data.park._id}`, { state: { data: data } });
        }}
      >
        Suggest Edit
      </button>

      <div>
        {!user ? (
          <div>Log in yo comment</div>
        ) : (
          <>
            <input
              type="text"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <input
              type="number"
              onChange={(e) => {
                setRatings(Number(e.target.value));
              }}
            />
            <button onClick={handleClick}>submit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Place;
