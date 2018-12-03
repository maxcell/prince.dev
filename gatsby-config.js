module.exports = {
  siteMetadata: {
    title: 'Prince Wilson - Developer',
    twitter: 'https://twitter.com/maxcell',
    url: 'https://maxcell.me',
    description: 'An organically growing notebook of thoughts and learnings!'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: `>`,
              showLineNumbersGlobal: false,
              noInlineHighlight: false,
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src`
      }
    },
  ],
}
