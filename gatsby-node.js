/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const talks = require('./talk-source.json')

const slugify = require('@sindresorhus/slugify')
const path = require('path')
const _ = require('lodash')

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {

  talks.forEach(talk => {
    const node = {
      id: createNodeId(`Talk-${talk.title}`),
      internal: {
        type: "Talk",
        contentDigest: createContentDigest(talk)
      },
      title: talk.title,
      type: talk.type,
      url: talk.url
    }

    actions.createNode(node)
  })
}


exports.onCreateNode = ({ node, getNode, actions }) => {
  const parent = getNode(node.parent)
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark' || node.internal.type === 'Mdx') {
    let slug = node.frontmatter.slug || slugify(parent.name)
    createNodeField({
      node,
      name: 'slug',
      value: `/${slug}`,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const mdxblogPostTemplate = path.resolve('./src/templates/mdx-blog-post.js')
  const tagTemplate = path.resolve('./src/templates/tags.js')

  return graphql(`
    {
      mdxRemark: allMdx(
        limit: 2000
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node { 
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
      tagsGroup: allMdx(
        limit: 2000
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `).then(result => {
    if (result.error) {
      return Promise.reject(result.errors)
    }

    const mdxPosts = result.data.mdxRemark.edges

    mdxPosts.forEach(({ node }) => {
      const post = {
        path: node.fields.slug,
        component: mdxblogPostTemplate,
        context: {
          slug: node.fields.slug,
        },
      }

      createPage(post)
    })

    let tags = result.data.tagsGroup.group

    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag.fieldValue)}`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
        },
      })
    })
  })
}
