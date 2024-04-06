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

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/api/persons", (req, res) => {
  // res.json(persons);
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });

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

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  // misma status para error y no error :) (ver por que xd  )
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({
      error: "Name missing",
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "Number missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: String(body.number),
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
