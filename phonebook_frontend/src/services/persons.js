import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then((response) => response.data);
};

const create = (newObject) => {
  const req = axios.post(baseUrl, newObject);
  return req.then((response) => response.data);
};

const deletePerson = (id) => {
  axios
    .delete(`${baseUrl}/${id}`)
    .then(() => {
      console.log(`deleted person with id: ${id}`);
    })
    .catch((error) => {
      console.log(`${error}`);
    });
};

const updateFromName = (name, newObject) => {
  const req = getAll();
  req.then((response) => {
    const person = response.find((p) => p.name === name);
    update(person.id, newObject);
  });
};

const update = (id, newObject) => {
  const req = axios.put(`${baseUrl}/${id}`, newObject);
  return req.then((response) => response.data);
};

export default { getAll, create, deletePerson, updateFromName, update };
