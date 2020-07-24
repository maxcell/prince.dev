/** @jsx jsx */
import React, { Fragment } from 'react'
import { Link as GatsbyLink } from 'gatsby';
import Link from '../components/Link'
import Layout from './layout'
import { jsx } from '@emotion/core';
import { StaticQuery, graphql } from 'gatsby'

const BlogList = ({ edges }) =>
  edges.map(markdown => {
    return (
      <li>
        <GatsbyLink
          css={{
            display: 'block',
            borderRadius: '5px',
            fontWeight: '700',
            padding: '0.5rem 1rem',
            '&:link,&:visited': {
              color: '#222426',
            },
            '&:hover,&:focus': {
              transition: 'background 0.1s ease-in-out 0s',
              backgroundColor: 'hsla(303,74%,92%,0.4)',
              textDecoration: 'none'
            }
          }}
          to={markdown.node.fields.slug}>
          {markdown.node.frontmatter.title}
        </GatsbyLink>
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
                  date
                }
                fields {
                  slug
                }
                timeToRead
                html
              }
            }
          }
          allMdx(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { draft: { ne: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  title
                  date
                }
                fields {
                  slug
                }
                timeToRead
                body
              }
            }
          }
        }
      `}
      render={data => {

        const edges = data.allMarkdownRemark.edges.concat(data.allMdx.edges).sort((a, b) => (
          -a.node.frontmatter.date.localeCompare(b.node.frontmatter.date)
        ))

        return (
          <ol class="blog-list">
            <BlogList edges={edges} />
          </ol>
        )
      }}
    />
  )
}

const SocialList = () => {
  return (
    <Fragment>
      <ul>
        {/*<li>Read my <a target="_blank" rel="noopener noreferrer" href="http://bit.ly/prince-wilson">resume</a> and let's do work together!</li>*/}
        <li>Follow me on <Link target="_blank" rel="noopener noreferrer" to="https://twitter.com/maxcell">Twitter</Link></li>
        <li>Connect with me on <Link target="_blank" rel="noopener noreferrer" to="https://linkedin.com/in/maxcell">LinkedIn</Link></li>
        <li>See my code on <Link target="_blank" rel="noopener noreferrer" to="https://github.com/maxcell">GitHub</Link></li>
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

export default IndexPage;