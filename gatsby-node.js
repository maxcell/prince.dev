/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

 // You can delete this file if you're not using it

 const { createFilePath } = require('gatsby-source-filesystem')
 const path = require('path')
 const _ = require('lodash')

 exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
     const { createNodeField } = boundActionCreators
     if(node.internal.type === "MarkdownRemark"){
         const slug = createFilePath({ node, getNode, basePath: 'pages' })
        //  console.log("Here's the slug:", slug)
         createNodeField({
             node,
             name: 'slug',
             value: slug
         })
     }
    //  console.log(node.internal.type)
 }

 exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators

    return graphql(`
        {
          allMarkdownRemark(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC}
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  path
                  tags
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.error) {
          return Promise.reject(result.errors)
        }
        debugger
        console.log(result)
        const posts = result.data.allMarkdownRemark.edges

        posts.forEach(({node}) => {
            createPage({
                path: node.fields.slug,
                component: path.resolve('./src/templates/blog-post.js'),
                context: {
                    slug: node.fields.slug
                }
            })
        })

        let tags = []

        posts.forEach(edge => {
          if(edge.node.frontmatter.tags){
            tags = [...tags, ...edge.node.frontmatter.tags]
          }
        })

        tags = [...new Set(tags)]

        tags.forEach(tag => {
          createPage({path: `/tags/${_.kebabCase(tag)}`,
          component: path.resolve('./src/templates/tags.js'),
          context: {
            tag
          }})
        })

      })
}
