/** @jsx jsx */
import { jsx } from '@emotion/core'

export default function (props) {
  return (
    <code {...props} css={{
      color: '#c5c8c6',
      whiteSpace: 'pre',
      backgroundColor: '#1d1f21',
      borderRadius: '.3em',
      padding: '.1em'
    }} />
  )
}