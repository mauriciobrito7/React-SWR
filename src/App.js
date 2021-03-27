import { useState } from "react";
import useSWR, { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
  return (
    <div className="App">
      <SWRConfig value={{ fetcher }}>
        <Crimes />
      </SWRConfig>
    </div>
  );
}

export default App;

const Crimes = () => {
  const API =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
  const { data, error } = useSWR(API);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <DisplayCrimes
        crimes={data}
        categories={[...new Set(data.map((crime) => crime.category))]}
      />
    </>
  );
};

const DisplayCrimes = ({ crimes, categories }) => {
  const [filteredCrimes, setFilteredCrimes] = useState(crimes || "");

  const filterCrimes = (category) => {
    setFilteredCrimes(crimes.filter((crime) => crime.category === category));
  };

  return (
    <>
      {categories &&
        categories.map((category) => (
          <button
            onClick={() => {
              filterCrimes(category);
            }}
          >
            {category}
          </button>
        ))}
      <button
        onClick={() => {
          setFilteredCrimes(crimes);
        }}
      >
        Reset
      </button>
      {filteredCrimes.map((crime) => (
        <ul key={crime.id}>
          <li>{crime.id}</li>
          <li>{crime.category}</li>
          <li>{crime.location_type}</li>
          <li>{crime.month}</li>
        </ul>
      ))}
    </>
  );
};
