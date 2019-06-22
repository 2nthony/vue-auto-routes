import test from 'ava'
import { renderRoutes, collectRoutes } from '../lib/collect-fs-routes'

const dir = 'test/views'
const options = {
  dir,
  match: 'vue,js'
}

test('main', async t => {
  const routes = await collectRoutes(options)
  const routesString = renderRoutes(routes, {
    componentPrefix: ''
  })

  t.snapshot(JSON.stringify(routes), 'collect routes')
  t.snapshot(routesString, 'render routes')
})
