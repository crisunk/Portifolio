require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))




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

// Configurações do Express


app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')
const port = 3000
console.log(path.join(__dirname, 'public'))


// app.get('./', function(req, res){
// 	res.sendFile(path.join(__dirname + 'views'))
// })


// Middleware para adicionar informações Prismic às respostas
app.use(async (req, res, next) => {
  const api = await initApi(req)

  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    // linkResolver: handleLinkResolver,
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
		const meta_data = await api.getSingle('meta_data')
    const project = await api.getAllByType('project')
    const misc = await api.getSingle('misc')
    const about = await api.getSingle('about')

    const home = [intro, project, misc, about, meta_data]

    // console.log('seus dados:', project)

    res.render('pages/home', { home, about, project })
  } catch (error) {
    console.error('Erro ao buscar documentos do Prismic:', error)
    res.status(500).send('Erro ao carregar conteúdo. Por favor, tente novamente mais tarde.')
  }
})


app.get('/projects/:uid', async (req, res) => {
  try {
    const api = await initApi(req);
    const project_intern = await api.getByUID('project', req.params.uid);
    const meta_data = await api.getSingle('meta_data');

    // Similar content query
    const similars = await api.getByType('project', {
      filters: [
        Prismic.filter.not('my.project.uid', req.params.uid)
      ]
    })

    console.log('dados consolidados:', similars);

    res.render('pages/projects', { project_intern, meta_data, similars });
  } catch (error) {
    console.error('Erro ao obter dados do Prismic:', error);
    // in case of errors
    res.status(500).send('Internal Server Error');
  }
})



// Inicialização do servidor

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
})
