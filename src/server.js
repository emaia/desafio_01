const express = require('express')
const server = express()

server.use(express.json())
server.use(logRequests)

const projects = []

/**
 * Middleaware para validar a existencia de um projeto
 */
function verifyProjectExists(req, res, next) {
  
  const { id } = req.params
  const project = projects.find(p => p.id === id)

  if (!project) {
    return res.status(400).json({ error: 'Project not found.' })
  }

  return next()
}

/**
 * Middleware para contagem de requisições
 */
function logRequests(req, res, next) {
  console.count('Requests')
  return next()
}

/**
 * Retorna uma mensagem default
 */
server.get('/', (req, res) => {
  return res.json({ status: 'Hello from Node!' })
})

/**
 * Retorna todos os projetos cadastrados
 */
server.get('/projects', (req, res) => {
  return res.json(projects)
})

/**
 * Request body: id, title
 * Cadastra um novo projeto na aplicação
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)
  return res.status(201).json(project)

})

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto especificado com o id nos parâmetros da rota.
 */
server.put('/projects/:id', verifyProjectExists, (req, res) => {

  const { id } = req.params
  const { title } = req.body
  const project = projects.find(p => p.id === id)

  project.title = title

  return res.json(project)
})

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id', verifyProjectExists, (req, res) => {

  const { id } = req.params
  const projectIndex = projects.findIndex(p => p.id == id);
  
  projects.splice(projectIndex, 1)

  return res.json({ message: 'Project created successfully.' })

})

/**
 * Route params: id;
 * Route body: task
 * Adiciona uma nova tarefa no projeto especificado pelo id; 
 */
server.post('/projects/:id/tasks', verifyProjectExists, (req, res) => {
  
  const { id } = req.params
  const { task } = req.body
  const project = projects.find(p => p.id === id)

  project.tasks.push(task)

  return res.status(201).json({ message: 'Task created successfully.' })
})

server.listen(3000)
