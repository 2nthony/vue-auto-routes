import path from 'path'
import test from 'ava'
import {
  renderRoutes,
  collectRoutes,
  renderRoutesMap
} from '../lib/collect-fs-routes'
import Plugin from '../lib/plugin'

const dir = path.join(__dirname, 'views')
const options = {
  dir,
  match: 'vue,js'
}

test('main', async t => {
  const routes = await collectRoutes(options)

  const routesString = renderRoutes(routes)
  const routesMap = renderRoutesMap(routes)

  t.snapshot(JSON.stringify(routes), 'collect routes')
  t.snapshot(routesString, 'render routes')
  t.snapshot(routesMap, 'render routes map')
})

test('plugin routes file', async t => {
  const plugin = new Plugin(options)

  t.snapshot(await plugin.handleRoutesString(), 'plugin routes file')
})
