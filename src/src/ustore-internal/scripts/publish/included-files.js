const xmpieIncludedFiles = [
  { name: 'config-overrides.js' },
  { name: 'rewire' },
  { name: '.gitignore' },
  { name: '.npmrc' },
  { name: 'public', rename: 'public', ignore: ['public/connect.html','public/sso.html', ] },
  { name: 'out' },
  { name: 'npm_packages' },
  { name: 'src', ignore: ['src/ustore-internal', 'src/{themeName}', 'src/package.json'] },
  { name: 'package-lock.json', rename: 'package-lock.json' },
  { name: '.env', rename: '.env' },
  { name: 'src/{themeName}', rename: 'src', ignore: ['/skin', '/config.json', '/features.json', '/assets'] },
  { name: 'src/{themeName}/skin', rename: '../skin' },
  { name: 'src/{themeName}/thumbnail.png', rename: '../thumbnail.png' },
  { name: 'src/{themeName}/assets', rename: 'src/assets' },
  { name: 'src/ustore-internal/static', rename: 'out/static-internal' },
  { name: 'src/ustore-internal', ignore: ['/publish-xmpie.js', '/compileSharedScssOnExport.js'] },
]

const userIncludedFile = [
  {name: 'thumbnail.png', dest: ''},
  {name: 'src', dest: '', ignore: ['src/node_modules', 'src/dev.config.js', 'src/package.json', 'src/src/ui.config.js', 'src/assets/images']},
  {name: 'skin', dest: ''},
]

const prepareFiles = l => l.map(include => ({
    ...include,
    dest: include.dest || include.dest === '' ? include.dest : 'src',
    root: include.root || '/',
    ignore: ['/__mocks__/', ...(include.ignore || [])]
  }))

module.exports = {
  xmpieIncludedFiles:  prepareFiles(xmpieIncludedFiles),
  userIncludedFile: prepareFiles(userIncludedFile),
}
