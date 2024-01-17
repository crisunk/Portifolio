require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
// const { type } = require('os')
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
		const meta_data = await api.getSingle('meta_data')
    const project = await api.getAllByType('project')
    const misc = await api.getSingle('misc')
    const about = await api.getSingle('about')

    const home = [intro, project, misc, about, meta_data]

    console.log('seus dados:', project)

    res.render('pages/home', { home, about, project })
  } catch (error) {
    console.error('Erro ao buscar documentos do Prismic:', error)
    res.status(500).send('Erro ao carregar conteúdo. Por favor, tente novamente mais tarde.')
  }
})

// working code

// app.get('/projects/:uid', async (req, res) => {

//     const api = await initApi(req)
// 		const uid = req.params.uid
// 		const project_intern = await api.getByUID('project')
// 		const meta_data = await api.getSingle('meta_data')

// 		res.render('pages/projects', { project_intern, meta_data })


// 	})



// app.get('/projects/:uid', async (req, res) => {
// 	const api = await initApi(req)
// 	const project_intern = await api.getByUID('project', req.params.uid)
// 	const meta_data = await api.getSingle('meta_data')
// 	const consolidate = [project_intern, meta_data]
//   const similar_content = await api.getSingle('project',{
//     filters: [Prismic.filter.not("my.project.uid", "type")],
//   })

// 	console.log('dados consolidados:',similar_content)

// 	res.render('pages/projects', { consolidate, project_intern, meta_data, similar_content })

// })

app.get('/projects/:uid', async (req, res) => {
  try {
    const api = await initApi(req);
    const project_intern = await api.getByUID('project', req.params.uid);
    const meta_data = await api.getSingle('meta_data')


    // similar content query
		const similar_content = await api.getSingle('project', Prismic.filter.not( req.params.uid))

    console.log('dados consolidados:', {similar_content})

    res.render('pages/projects', { project_intern, meta_data, similar_content });
  } catch (error) {
    console.error('Erro ao obter dados do Prismic:', error)

    // in case of errors

    res.status(500).send('Erro interno ao processar a solicitação.')
  }
})



// Inicialização do servidor

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
})
