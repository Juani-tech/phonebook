import personsService from "../services/persons";
const Persons = ({ personsToShow }) => {
  console.log(personsToShow);
  return personsToShow.map((person) => (
    <div key={person.name}>
      {person.name} {person.number}
      <button onClick={() => personsService.deletePerson(person.id)}>
        delete
      </button>
    </div>
  ));
};

export default Persons;
