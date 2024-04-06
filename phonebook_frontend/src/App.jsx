import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personsService from "./services/persons";

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }
  let color;
  isError ? (color = "red") : (color = "green");
  const notificationStyle = {
    color: color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return (
    <div className="success" style={notificationStyle}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Segundo parametro especifica con que frecuencia se ejecuta el efecto.
  // En un principio se ejecuta siempre despues de la primera renderizacion del componente y cuando se
  // cambia el valor del segundo parametro, pero si esta vacio nunca cambia...
  // Si por ejemplo queremos fetchear data del server si y solo si se introdujo un input, es util
  // poner ese segundo parametro
  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const checkIfExists = (name) =>
    persons.find((person) => person.name === name) !== undefined;

  const addPerson = (event) => {
    event.preventDefault();
    if (checkIfExists(newName)) {
      console.log("Nombre repetido, modificando número");
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        ) === false
      ) {
        return;
      }
      const req = personsService.getAll();

      req.then((response) => {
        const person = response.find((p) => p.name === newName);
        if (!person) {
          setErrorMessage(`${newName} information has been removed recently`);
        } else {
          personsService
            .update(person.id, {
              name: newName,
              number: newNumber,
            })
            .then(() => {
              // Actualizar el estado solo después de completar la operación de modificación
              setPersons(
                persons.map((p) =>
                  p.id !== person.id ? p : { ...person, number: newNumber }
                )
              );
              setSuccessfulMessage(`Modified ${newName}`);
              setTimeout(() => {
                setSuccessfulMessage(null);
              }, 5000);
            })
            .catch((error) => {
              console.error("Error al actualizar persona:", error);
            });
        }
      });
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personsService.create(newPerson).then((response) => {
        setPersons(persons.concat(response));
        setSuccessfulMessage(`Added ${newName}`);
        setTimeout(() => {
          setSuccessfulMessage(null);
        }, 5000);
      });
    }
    setNewName("");
    setNewNumber("");
  };

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const deletePersonAndRefresh = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.deletePerson(id);
      setPersons(personsToShow.filter((person) => person.id !== id));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successfulMessage} isError={false}></Notification>
      <Notification message={errorMessage} isError={true}></Notification>
      <Filter
        filterValue={filterValue}
        handleFilterChange={handleFilterChange}
      ></Filter>
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNewNumberChange={handleNewNumberChange}
        handleNewPersonChange={handleNewNameChange}
      ></PersonForm>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button
              onClick={() => deletePersonAndRefresh(person.id, person.name)}
            >
              delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
