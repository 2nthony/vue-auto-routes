// Modified from @ream/collect-fs-routes
// https://github.com/ream/collect-fs-routes

const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const sortby = require('lodash.sortby')

const readDir = promisify(fs.readdir)
const readStat = promisify(fs.stat)

const pathExists = fp =>
  new Promise(resolve => {
    fs.access(fp, err => {
      resolve(!err)
    })
  })

class FileCollector {
  constructor() {
    this.records = []
    this.lookup = {}
  }

  add(path, props) {
    if (!this.lookup[path]) {
      this.lookup[path] = {
        path: solveRoutePath(path)
      }
      this.records.push(this.lookup[path])
    }
    Object.assign(this.lookup[path], props)
  }

  sortedRecords() {
    return sortby(this.records, record => [
      record.path.indexOf(':') >= 0, // Dynamic routes go last
      record.path
    ])
  }
}

const solveRoutePath = path => path.replace('index', '').replace(/_/g, ':')

const filenamify = str =>
  path
    .relative(process.cwd(), str)
    .replace(/[^a-zA-Z0-9\-_]/g, '-')
    .replace(/^-+/, '')

function renderRoutes(routes, {chunkPrefix = ''} = {}) {
  return `
  [
    ${routes
      .map(
        route => `
    {
      path: ${JSON.stringify(route.path)},
      component: () => import(/* webpackChunkName: "${chunkPrefix}${filenamify(
          route.component
        )}" */ ${JSON.stringify(route.component)}),
      ${route.children ? `children: ${renderRoutes(route.children)}` : ''}
    }
    `
      )
      .join(',')}
  ]
  `
}

function renderRoutesMap(routes) {
  const routesMap = new Set()

  function _renderRoutesMap(_routes, {routePrefix = ''} = {}) {
    _routes.forEach(route => {
      if (!route.path.startsWith(':')) {
        if (route.children) {
          _renderRoutesMap(route.children, {
            routePrefix: path.join(routePrefix, route.path)
          })
        }
        routesMap.add(path.join(routePrefix, route.path))
      }
    })
  }

  _renderRoutesMap(routes)

  return JSON.stringify([...routesMap])
}

async function collectRoutes({
  pagesDir,
  match = 'vue, js',
  basePath = '/',
  statCache
} = {}) {
  if (!(await pathExists(pagesDir))) return []

  const collector = new FileCollector()

  const matchExts =
    typeof match === 'string'
      ? new RegExp(`.(${match.replace(/,\s*/, '|')})$`, 'i')
      : match

  for (const name of await readDir(pagesDir)) {
    // eslint-disable-next-line no-await-in-loop
    const stats = await readStat(path.join(pagesDir, name))
    if (stats.isDirectory()) {
      collector.add(name, {dir: name})
    } else if (stats.isFile()) {
      if (name.match(matchExts)) {
        if (statCache) {
          statCache[name] = stats
        }
        collector.add(path.basename(name, path.extname(name)), {file: name})
      }
    }
  }

  const routes = []

  for (const record of collector.sortedRecords()) {
    const routePath = basePath ? path.join(basePath, record.path) : record.path

    if (record.file) {
      const route = {
        path: routePath,
        component: path.join(pagesDir, record.file)
      }
      if (record.dir) {
        // eslint-disable-next-line no-await-in-loop
        route.children = await collectRoutes({
          pagesDir: path.join(pagesDir, record.dir),
          basePath: '',
          match: matchExts
        })
      }

      routes.push(route)
    } else if (record.dir) {
      routes.push(
        // eslint-disable-next-line no-await-in-loop
        ...(await collectRoutes({
          pagesDir: path.join(pagesDir, record.dir),
          basePath: routePath,
          match: matchExts
        }))
      )
    }
  }

  return routes
}

exports.collectRoutes = collectRoutes
exports.renderRoutes = renderRoutes
exports.renderRoutesMap = renderRoutesMap
