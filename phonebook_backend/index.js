require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./modules/person.js");

app.use(express.json());
// loggear las peticiones, tiny esta predefinido

// app.use(morgan("tiny"));
app.use(express.static("dist"));

// Definir un token personalizado en Morgan para capturar el cuerpo de la solicitud
morgan.token("req-body", function (req, res) {
  return JSON.stringify(req.body); // Convertir el cuerpo de la solicitud a formato JSON
});

// Utilizar Morgan middleware con el token personalizado
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

app.get("/api/persons", (req, res, next) => {
  // res.json(persons);
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));

  // const id = Number(req.params.id);
  // console.log(`id obtenido: ${id}`);
  // const person = persons.find((person) => person.id === id);
  // console.log(`person: ${person}`);
  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(400).send("ID not found");
  // }
});

app.get("/info", (req, res) => {
  console.log(req.headers);
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: String(body.number),
    id: generateId(),
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name == "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// este debe ser el último middleware cargado
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
