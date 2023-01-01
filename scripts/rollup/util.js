import path from 'node:path'
import fs from 'node:fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'

const srcPath = path.resolve(__dirname, '../../packages')
const distPath = path.resolve(__dirname, '../../dist')

export function getPkgSrcPath(pkgName) {
  return `${srcPath}/${pkgName}`
}

export function getPkgDistPath(pkgName) {
  return `${distPath}/${pkgName}`
}

export function getPackageJSON(pkgName) {
  const url = `${getPkgSrcPath(pkgName)}/package.json`
  const data = fs.readFileSync(url, { encoding: 'utf-8' })
  return JSON.parse(data)
}

export function getDefaultRollupPlugins({ typescript = {} } = {}) {
  return [cjs(), ts(typescript)]
}
