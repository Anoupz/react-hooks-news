import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: "" } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const getResults = async () => {
    setLoading(true);
    try {
      const {
        data: { hits },
      } = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`);
      setResults(hits);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getResults();
  }, []);

  const handleSearch = (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();
    getResults();
  };

  const handleClearSearch = () => {
    setQuery("");
    searchInputRef?.current?.focus();
  };

  return (
    <div className="App">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          ref={searchInputRef}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClearSearch}>
          Clear
        </button>
      </form>
      <br />
      {loading ? (
        <div>Loading results...</div>
      ) : (
        <ul>
          {results.map(
            (result: { objectID: string; url: string; title: string }) => (
              <li key={result.objectID}>
                <a href={result.url}>{result.title}</a>
              </li>
            )
          )}
        </ul>
      )}
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default App;
