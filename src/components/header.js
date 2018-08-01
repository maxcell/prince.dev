import React from 'react'
import Link from 'gatsby-link'


const ListLink = (props) => {
 return (
  <li style={{ display: 'inline-block', marginRight: '1rem'}}>
    <Link to={props.to}>
      {props.children}
    </Link>
  </li>
  )
}


const Header = ({ siteTitle }) => (
  <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <ul style={{ listStyle: 'none', float: 'right' }} >
        <ListLink to="/">Home</ListLink>
        <ListLink to="/blog">Blog</ListLink>
      </ul>
    </div>
  </div>
)

export default Header
