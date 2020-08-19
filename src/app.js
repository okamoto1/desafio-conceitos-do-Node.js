const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
    const { id } = request.params;
    if (!isUuid(id)){
        return response.status(400).json({ error: 'Invalid id'});
    }
    return next();
}

function findRepositoryIndex(id) {
  const repositoryIndex = repositories.findIndex(element => element.id === id);
  if (repositoryIndex === -1){
    return 'Repository not found';
  }
  return repositoryIndex;
}

app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = { id : uuid(), 
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  repositoryIndex = findRepositoryIndex(id);
  if (typeof repositoryIndex === 'string'){
    return response.status(400).json({error: repositoryIndex});
  }
  const { title, url, techs} = request.body;
  const likes = repositories[repositoryIndex].likes;
  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes
  };
  repositories[repositoryIndex] = updatedRepository;
  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  repositoryIndex = findRepositoryIndex(request.params.id);
  if (typeof repositoryIndex === 'string'){
    return response.status(400).json({error: repositoryIndex});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  repositoryIndex = findRepositoryIndex(request.params.id);
  if (typeof repositoryIndex === 'string'){
    return response.status(400).json({error: repositoryIndex});
  }
  repositories[repositoryIndex].likes += 1;
  return response.status(200).json({likes: repositories[repositoryIndex].likes});
});

module.exports = app;
