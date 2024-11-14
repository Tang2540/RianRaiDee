import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearch } from "../utils/SearchQuery/useSearch";

const Search = () => {
  const { suggestions, fetchSuggestions } = useSearch();

  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchSuggestions(query);

    const debounceTimer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    console.log(suggestions);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="max-w-[58rem] w-4/5">
      <label className="input input-bordered flex items-center gap-2">
        <input
        data-test="search-input"
          type="text"
          className="grow"
          placeholder="ค้นหาวิชาด้วยรหัสวิชา, ชื่อวิชาภาษาไทยหรือภาษาอังกฤษ"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
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

      <ul className="menu rounded-box">
        {suggestions &&
          Array.isArray(suggestions) &&
          suggestions?.map((item, index: number) => (
            <li key={index} data-test="search-results">
              <Link to={`/${item._id}`} data-test="result-item">
                <div>
                  <h2>{item.course_id}</h2>
                  <p>{item.name}</p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Search;