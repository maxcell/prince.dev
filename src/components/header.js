import React from 'react'
import Link from 'gatsby-link'


const ListLink = (props) => {
 return (
  <li style={{ display: 'inline-block', marginRight: '1rem'}}>
    <Link to={props.to} style={{ color: 'black', textDecoration: 'none', fontWeight: 600, opacity: 0.75 }}>
      {props.children}
    </Link>
  </li>
  )
}


const Header = ({ siteTitle }) => (
  <div>
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem 0  1.0875rem',
      }}
    >
    <h3 style={{ display: 'inline'}}>
      <Link to="/" style={{ textDecoration: 'none', color: '#772073', opacity: 0.75 }}>Prince</Link>
    </h3>
      <ul style={{ listStyle: 'none', float: 'right'  }} >
        <ListLink to="/about">About</ListLink>
      </ul>
    </div>
  </div>
)

export default Header
