const Hapi = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const Ejs = require('ejs')
const ejsUtil = require('./utils/ejs')
const pdfUtil = require('./utils/pdf')

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
})

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello, world!'
  },
})

server.route({
  method: 'GET',
  path: '/pdf',
  handler: async (request, h) => {
    const data = {
      header: 'Hello World',
      footer: 'Micheal Co,LTD',
      logo:
        'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      fruits: [
        {
          title: 'Apple',
          price: 400,
        },
        {
          title: 'Banana',
          price: 199,
        },
        {
          title: 'CanCab',
          price: 89,
        },
        {
          title: 'Durian',
          price: 9999,
        },
        {
          title: 'CoConut',
          price: 120,
        },
        {
          title: 'Peanut',
          price: 399,
        },
      ],
    }

    let html = await ejsUtil.toHTML('./templates/index.ejs', data)
    const options = { format: 'A4', base: './assets' }
    const fileName = `PDFDemo-${Date.now()}`
    const output = `./pdf/${fileName}.pdf`

    let pdfResult = await pdfUtil.toPDF(html, options, output)

    return h.file(pdfResult.filename)
    // return h.view('index', data)
  },
})

const init = async () => {
  await server.register(Vision)
  await server.register(Inert)
  await server.start()

  server.views({
    engines: { ejs: Ejs },
    relativeTo: __dirname,
    path: 'templates',
  })

  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
