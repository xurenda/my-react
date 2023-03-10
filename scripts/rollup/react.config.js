import { getPackageJSON, getPkgSrcPath, getPkgDistPath, getDefaultRollupPlugins } from './util'
import generatePackageJson from 'rollup-plugin-generate-package-json'

const { name, module } = getPackageJSON('react')
const pkgSrcPath = getPkgSrcPath(name)
const pkgDistPath = getPkgDistPath(name)

export default [
  {
    // react
    input: `${pkgSrcPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name,
      format: 'umd',
    },
    plugins: [
      ...getDefaultRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgSrcPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, version, description, keywords, author, license }) => ({
          name,
          version,
          description,
          main: 'index.js',
          keywords,
          author,
          license,
        }),
      }),
    ],
  },
  {
    // jsx
    input: `${pkgSrcPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx',
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsxDEV',
        format: 'umd',
      },
    ],
    plugins: getDefaultRollupPlugins(),
  },
]
