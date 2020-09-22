/** @jsx jsx */
import React, { Fragment } from 'react'
import { jsx } from '@emotion/core';
import { StaticQuery, graphql } from 'gatsby'
import Link from '../components/Link'

const EngagementSection = () => {
  return <StaticQuery
    query={graphql`
        query EngagementQuery {
          allTalk(
            limit: 5
          ) {
              nodes {
                title,
                type,
                url
              }
            }
          }
      `}
    render={data => {
      const nodes = (data.allTalk.nodes);
      return (
        <Fragment>
          <ol class="blog-list">
            {
              nodes.map(node => {
                return (
                  <li>
                    <a
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
                      href={node.url}>
                      {node.title} ({node.type})
                    </a>
                  </li>
                )
              })
            }
          </ol>
        </Fragment>
      )
    }}
  />
}

export default EngagementSection