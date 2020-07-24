/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link as GatsbyLink } from 'gatsby';

export default function StyledLink(props) {

  const linkStyles = {
    '&,&:visited,&:link': {
      fontWeight: 500,
      color: '#772073',
    }
  }

  const isInternal = /^\/(?!\/)/.test(props.to)

  if (isInternal) {
    return (
      <GatsbyLink
        {...props}
        sx={linkStyles}
        activeStyle={{ backgroundColor: 'white', borderBottom: '2px solid #5E0887' }}
      >
        {props.children}
      </GatsbyLink>
    )
  } else {
    // If we're using the component directly, we might be using
    // `to` whereas the MDX might be piping href
    const url = props.to ? props.to : props.href;
    return (
      <a {...props} href={url} sx={linkStyles}>
        {props.children}
      </a>
    )
  }
}