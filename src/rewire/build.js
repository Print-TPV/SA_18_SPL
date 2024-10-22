if (process.argv.length <= 2) {
    require('../src/ustore-internal/scripts/applyFeaturesConfig.js')
}
require('./override-config')
require('../node_modules/react-scripts/scripts/build.js')
