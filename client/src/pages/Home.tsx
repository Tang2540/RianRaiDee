import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/course");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  console.log(data);

  return (
    <>
      <div className="hero bg-base-200 min-h-[80vh]">
        <div className="hero-content text-center flex-col">
            <h1 className="text-5xl font-bold mb-5">ไม่รู้จะเรียนวิชาอะไร <span>มาเลือกที่เรา</span></h1>
            <Search />
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-12 p-11">
        {data.map(
          (
            item: { _id: string; course_id: string; name: string; desc: string;},
            index: number
          ) => (
            <Link to={`/${item._id}`} key={index}>
              <div className="card lg:card-side bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{item.course_id} {item.name}</h2>
                  <p>{item.desc}</p>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </>
  );
};

export default Home;
