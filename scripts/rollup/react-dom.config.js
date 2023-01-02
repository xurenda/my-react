import { getPackageJSON, getPkgSrcPath, getPkgDistPath, getDefaultRollupPlugins } from './util'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import alias from '@rollup/plugin-alias'

const { name, module } = getPackageJSON('react-dom')
const pkgSrcPath = getPkgSrcPath(name)
const pkgDistPath = getPkgDistPath(name)

export default [
  {
    // react-dom
    input: `${pkgSrcPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'ReactDOM',
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'ReactDOM',
        format: 'umd',
      },
    ],
    plugins: [
      ...getDefaultRollupPlugins(),
      alias({
        entries: {
          hostConfig: `${pkgSrcPath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: pkgSrcPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, version, description, keywords, author, license }) => ({
          name,
          version,
          description,
          main: 'index.js',
          peerDependencies: {
            react: version,
          },
          keywords,
          author,
          license,
        }),
      }),
    ],
  },
]
