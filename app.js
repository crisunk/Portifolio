require('dotenv').config()


const express = require('express')
const app = express()
const path = require('path')
const port = 3000


const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  })
}

const { PrismicPredicates } = Prismic

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

// Link Resolver
const HandleLinkResolver = (doc) => {
  // if (doc.type === 'product') {
  //   return `/detail/${doc.slug}`
  // }

  // if (doc.type === 'collections') {
  //   return '/collections'
  // }

  // if (doc.type === 'about') {
  //   return `/about`
  // }

  // Default to homepage
  return '/'
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const misc = await api.getSingle('misc')

  res.render('pages/home', { home: misc.data.gallery})
	console.log(misc.data.gallery)


})

// const assets = []

// home.data.gallery.forEach(item => {
// 	assets.push(item.image.url)
// })


app.get('/', async (req, res) => {
	const api = await initApi(req)
	const intro = await api.getSingle('intro')
	const project = await api.getSingle('project')
	const misc = await api.getSingle('misc')
	const about = await api.getSingle('about')
	const home = [intro, project, misc, about]
	console.log(home)
	res.render('pages/home', { home })
	})

	app.listen(port, () => {
		console.log(`http://localhost:${port}`);
})

