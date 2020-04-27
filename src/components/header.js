import React from 'react'
import { css } from '@emotion/core'
import Link from './Link'


const ListLink = (props) => {
  return (
    <li style={{ display: 'inline-block' }}>
      <Link to={props.to}
        css={{ '&:hover': { backgroundColor: 'white', borderBottom: '2px solid #5E0887' } }}
        style={{ color: 'black', textDecoration: 'none', fontWeight: 600, opacity: 0.75 }}>
        {props.children}
      </Link>
    </li >
  )
}


const Header = () => (
  <div>
    <div
      style={{
        margin: '0 auto',
        paddingTop: '1.45rem'
      }}
    >
      <h3 style={{ display: 'inline' }}>
        <Link to="/" css={{ '&:hover': { backgroundColor: 'white', borderBottom: '2px solid #5E0887' } }} style={{ textDecoration: 'none', color: '#772073', opacity: 0.75 }}>Prince</Link>
      </h3>
      <ul style={{ listStyle: 'none', float: 'right' }} >
        <ListLink to="/about">About</ListLink>
      </ul>
    </div>
  </div>
)

export default Header
