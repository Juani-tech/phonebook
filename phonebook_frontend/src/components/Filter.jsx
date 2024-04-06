const Filter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={filterValue} onChange={handleFilterChange}></input>
    </div>
  );
};

export default Filter;
