import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/place");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  console.log(data);

  return (
    <>
      <div className="hero bg-base-200 min-h-[80vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-5">Hello there</h1>
            <Search />
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-12">
        {data.map(
          (
            item: { _id: string; name: string; province: string },
            index: number
          ) => (
            <Link to={`/${item._id}`} key={index}>
              <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure>
                  <img src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp" alt="Album"/>
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{item.name}</h2>
                  <p>{item.province}</p>
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
