/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

require('./src/assets/css/prism-atom-dark.css')

const { Prism } = require("prism-react-renderer");
(typeof global !== "undefined" ? global : window).Prism = Prism;
require('prismjs/components/prism-rust');