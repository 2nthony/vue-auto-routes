import path from 'path'
import test from 'ava'
import { renderRoutes, collectRoutes } from '../lib/collect-fs-routes'

const dir = 'test/views'
const options = {
  dir,
  match: 'vue,js'
}

const route404 = {
  path: '/404',
  component: path.relative(process.cwd(), path.join(__dirname, '../404.vue'))
}

test('main', async t => {
  const routes = await collectRoutes(options)
  const routesString = renderRoutes([...routes, route404], {
    componentPrefix: ''
  })

  t.snapshot(JSON.stringify(routes), 'collect routes')
  t.snapshot(routesString, 'render routes')
})

test('v4', async t => {
  const routes = await collectRoutes(options)
  const routesString = renderRoutes([...routes, route404], {
    componentPrefix: '',
    v4: true
  })

  t.snapshot(JSON.stringify(routes), 'collect routes')
  t.snapshot(routesString, 'render routes')
})
