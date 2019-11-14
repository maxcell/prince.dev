import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import Layout from './layout'
import { StaticQuery, graphql } from 'gatsby'

const BlogList = ({ edges }) =>
  edges.map(markdown => {
    return (
      <li>
        <Link to={markdown.node.fields.slug}>
          {markdown.node.frontmatter.title}
        </Link>
      </li>
    )
  })

const BlogSection = () => {
  return (
    <StaticQuery
      query={graphql`
        query BlogPageQuery {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { draft: { ne: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  title
                  date(formatString: "MMM Do")
                }
                fields {
                  slug
                }
                timeToRead
                html
              }
            }
          }
        }
      `}
      render={data => (
        <ol class="blog-list">
          <BlogList edges={data.allMarkdownRemark.edges} />
        </ol>
      )}
    />
  )
}

const SocialList = () => {
  return (
    <Fragment>
    <ul>
      <li>Read my <a target="_blank" rel="noopener noreferrer" href="http://bit.ly/prince-resume">resume</a> and let's do work together!</li>
      <li>Connect with me on <a target="_blank" rel="noopener noreferrer" href="https://linkedin.com/in/maxcell">LinkedIn</a></li>
      <li>See my code on <a target="_blank" rel="noopener noreferrer" href="https://github.com/maxcell">GitHub</a></li>
      <li>Follow me on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/maxcell">Twitter</a></li>
    </ul>
    </Fragment>
  )
}

const ShortAbout = () => {
  return (
    <Fragment>
      <h1>Howdy, I'm Prince!</h1>
      <p>
        I am a full-stack web developer based in NYC. I love building things and
        making sure to bring people together around accessibility and security.
        Beyond the work I do, I love corgis.
      </p>

      <SocialList />
    </Fragment>
  )
}

const IndexPage = () => (
  <Layout>
    <ShortAbout />
    <h2>Articles</h2>
    <BlogSection />
  </Layout>
)

export default IndexPage
