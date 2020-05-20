/* @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';

export default function Callout({ variant = 'info', children }) {
  const colorStyles = {
    info: {
      borderLeft: '5px solid rgb(119, 32, 115)',
      backgroundColor: 'hsla(303, 74%, 92%, 0.4)',
    },
    danger: {
      borderLeft: '5px solid #f44336',
      backgroundColor: 'rgb(253, 236, 234)'
    }
  }
  return (
    <aside
      css={{
        padding: '1rem 2rem',
        margin: '1.5rem auto',
        ...colorStyles[variant],
        '> *:last-child': {
          marginBottom: 0
        }
      }}>
      {children}
    </aside>
  );
}