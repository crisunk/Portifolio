require('dotenv').config()


const express = require('express')
const app = express()
const path = require('path')
const port = 3002

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

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

// app.get('/', async (req, res) => {
// 	res.render('pages/home');
//   });

// app.get('/home', async (req, res) => {
// 	initApi(req).then(api => {
// 		api.query(
// 			Prismic.Predicates.at('document.type', 'home')
// 		).then(response => {
// 			const {results} = response

// 			console.log(results)

// 			res.render('pages/home')
// 		})
// 	})
// })

// app.get('/', async (req, res) => {
//   const api = await initApi(req)
//   const home = await api.getSingle('about')

//   res.render('pages/home', { home: home.data })


// })

// app.get('/', async (req, res) => {
//   const api = await initApi(req)
//   const home = await api.getSingle('intro', 'project', 'misc', 'about' )
// 		console.log(home)
//   res.render('pages/home', { home });
// })

// app.get('/', async (req, res) => {
//   const api = await initApi(req)
//   const home = await
//     Promise.all([
//         api.getSingle('intro'),
//         api.getSingle('project'),
//         api.getSingle('misc'),
//         api.getSingle('about')
//         )];
// 		console.log(home)
//   res.render('pages/home', { home })
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



// 	const handleRequest = async (api) => {
//     try {
//         const [about, intro, meta_data, misc, project, project_cover, { results: collection }] = await Promise.all([
//             api.getSingle('intro'),
//             api.getSingle('project'),
//             api.getSingle('meta_data'),
//             api.getSingle('misc'),
//             api.getSingle('about'),
//             api.query(Prismic.Predicates.at('document.type', 'collection'), {
//                 fetchLinks: 'product.image',
//             }),
//         ]);
//         // Resto do seu código de manipulação dos dados
//     } catch (error) {
//         console.error("Erro ao lidar com as requisições Prismic:", error);
//         // Lógica para lidar com o erro, como retornar uma mensagem de erro ou tratar de outra forma
//     }
// }

// código velho

// const handleRequest = async (api) => {
// 	const [about, intro, meta_data, misc, project, project_cover, { results: collection }] = await Promise.all([
// 		api.getSingle('intro'),
// 		api.getSingle('project'),
// 		api.getSingle('meta_data'),
// 		api.getSingle('misc'),
// 		api.getSingle('about'),
// 		api.query(Prismic.Predicates.at('document.type', 'collection'), {
// 			fetchLinks: 'product.image',
// 		}),
// 	])

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})
// }
