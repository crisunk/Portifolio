require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const port = 3000

// Função para resolver URLs de imagens
const resolveImage = (image) => {
  if (!image || !image.url) {
    return null
  }

  return image.url
}

// Inicializar API do Prismic
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  })
}

// Resolver de links
const handleLinkResolver = (doc) => {
  return '/';
}

// Configurações do Express
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

// Middleware para adicionar informações Prismic às respostas
app.use(async (req, res, next) => {
  const api = await initApi(req)

  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  }

  res.locals.PrismicH = {
    ...PrismicH,
    resolveImage, // Adiciona o helper para resolução de URLs das imagens
  };

  next();
})

// Rota principal
app.get('/', async (req, res) => {
  try {
    const api = await initApi(req)
    const intro = await api.getSingle('intro')
    const project = await api.getSingle('project')
    const misc = await api.getSingle('misc')
    const about = await api.getSingle('about')

    const home = [intro, project, misc, about]

    console.log('Dados de misc.data.gallery:', misc.data.gallery)

    res.render('pages/home', { home })
  } catch (error) {
    console.error('Erro ao buscar documentos do Prismic:', error)
    res.status(500).send('Erro ao carregar conteúdo. Por favor, tente novamente mais tarde.')
  }
})

// Inicialização do servidor


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
})
