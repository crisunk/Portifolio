require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const app = express()
const path = require('path')
const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const errorHandler = require('errorhandler')
const uaParser = require('ua-parser-js')

const port = 3000


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Inicializar API do Prismic

const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}



// Resolver de links

const linkResolver = (doc) => {
  if (doc.type === 'home') {
    return '/'
  } else if (doc.type === 'about') {
    return '/about'
  } else if (doc.type === 'portfolio') {
    return '/about/' + doc.uid
  }

  // Default to homepage
  return '/';
}

app.use((req, res, next) => {
  // console.log(req.headers)
  const ua = uaParser(req.headers['user-agent'])
  // console.log(ua)
  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

	res.locals.link = linkResolver

  res.locals.PrismicH = PrismicH
  next()
})
//=======================All the routes - these can have their own file/folder========================


app.get('/', async (req, res) => {
  const api = await initApi(req)
	const meta_data = await api.getSingle('meta_data')
  const intro = await api.getSingle('intro')
	const project = await api.getSingle('project')
	const misc = await api.getSingle('misc')
	const about = await api.getSingle('about')
	const home = [intro, project, misc, about]
	console.log('intro', intro)

  res.render('pages/home', {
		meta_data: meta_data.data,
		misc: misc.data,
		intro: intro.data,
		project: project.data,
		about: about.data,
		home: home.data,
	})

	// console.log(misc)

})


//=====================================Undefined routes error handling==================
app.all('*', async (req, res, next) => {
  res.render('pages/404')
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Code 500: Something Went Wrong'
  res.status(statusCode).send(err.message)
})

//=======================Connecting to port====================================
app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
