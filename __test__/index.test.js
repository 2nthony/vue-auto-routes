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

test('collect routes', async t => {
  const routes = await getCollectRoutes()

  t.snapshot(JSON.stringify(routes))
})

test('routes string', async t => {
  const routes = await getCollectRoutes()
  const routesString = renderRoutes(routes)

  t.snapshot(routesString)
})

test('routes map', async t => {
  const routes = await getCollectRoutes()
  const routesMap = renderRoutesMap(routes)

  t.snapshot(routesMap)
})

test('plugin routes file', async t => {
  const plugin = new Plugin(options)

  t.snapshot(await plugin.handleRoutesString())
})

async function getCollectRoutes() {
  return collectRoutes(options)
}
