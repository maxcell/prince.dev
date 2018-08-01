module.exports = {
  siteMetadata: {
    title: 'Prince Wilson - Developer',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js'
      }
    }
  ],
}
