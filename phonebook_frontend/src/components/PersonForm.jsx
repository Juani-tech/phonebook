const PersonForm = ({
  onSubmit,
  newName,
  newNumber,
  handleNewPersonChange,
  handleNewNumberChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleNewPersonChange}></input>
      </div>
      <div value={newNumber}>
        number:{" "}
        <input value={newNumber} onChange={handleNewNumberChange}></input>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
