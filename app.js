require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')

// Typo correction: Prismic.Predicates.at instead of Prismic.Predicate.at
const { PrismicPredicates } = Prismic

function initApi(req) {
	return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
		accessToken: process.env.PRISMIC_ACESS_TOKEN,
		req,
		fetch,
	})
}

const HandleLinkResolver = (doc) => {
	return '/';
}


app.use((req, res, next) => {
	res.locals.ctx = {
		endpoint: process.env.PRISMIC_ENDPOINT,
		linkResolver: HandleLinkResolver,
	}
	res.locals.PrismicH = PrismicH

	next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

app.get('/', async (req, res) => {
	res.render('pages/home');
  });


const handleRequest = async (api) => {
	const [about, intro, meta_data, misc, project, project_cover, { results: collection }] = await Promise.all([
		api.getSingle('intro'),
		api.getSingle('project'),
		api.getSingle('misc'),
		api.getSingle('about'),
		api.query(Prismic.Predicates.at('document.type', 'collection'), {
			fetchLinks: 'product.image',
		}),
	])

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
}
