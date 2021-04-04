const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkExistingRepository(request, response, next) {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if (repositoryId < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryId = repositoryId;
  request.repository = repositories[repositoryId];
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).send(repository);
});

app.put("/repositories/:id", checkExistingRepository, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checkExistingRepository, (request, response) => {
  const { repositoryId } = request;  

  repositories.splice(repositoryId, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", checkExistingRepository, (request, response) => {
  const { repository } = request;

  repository.likes += 1;

  return response.status(200).send(repository);
});

module.exports = app;
