import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearch } from "../utils/SearchQuery/useSearch";

const Search = () => {
  const {suggestions, results, setResults,fetchSuggestions} = useSearch()

  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchSuggestions(query)

    const debounceTimer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    console.log(suggestions);

    return () => clearTimeout(debounceTimer);
  }, [query]);
  
  const handleClick = (name:string) => {
    fetchSuggestions(name)
    setResults(suggestions)
    console.log(results)
  }

  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          onChange={(e)=>{setQuery(e.target.value)}}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      <ul className="menu rounded-box w-56">
        {suggestions && Array.isArray(suggestions) &&suggestions?.map((item,index:number)=>(
            <li key={index}>
              {item.type=='province'?
              (<a onClick={()=>{handleClick(item.name)}}>{item.name}</a>):
              (<Link to={`/${item._id}`}>
                <div>
                <h2>{item.name}</h2>
                <p>{item.province}</p>
                </div>
              </Link>)}
            </li>
        ))}
      </ul>
    </>
  );
};

export default Search;
