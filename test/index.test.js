import path from 'path'
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

test('next', async t => {
  const routes = await collectRoutes(options)
  const routesString = renderRoutes(
    [
      ...routes,
      {
        path: '/404',
        component: path.relative(
          process.cwd(),
          path.join(__dirname, '../404.vue')
        )
      }
    ],
    {
      componentPrefix: '',
      next: true
    }
  )

  t.snapshot(JSON.stringify(routes), 'collect routes')
  t.snapshot(routesString, 'render routes')
})
