import React, { useState } from 'react'

export default function FeedbackForm(props) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    fetch('/.netlify/functions/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating: value,
        date: Date.now(),
        text: 'empty text for now',
        visitorId: localStorage.getItem('visitorId')
      }),
    })
      .then(res => res.json())
      .then((msg) => console.log(msg))
      .catch(error => console.log(error))
    e.preventDefault()
  }

  function handleChange(e) {
    setValue(e.target.value)
  }

  return (
    <form
      name="feedback"
      method="post"
      onSubmit={handleSubmit}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
    >
      <input
        id="yes"
        name="response"
        checked={value === 'positive'}
        type="radio"
        value="positive"
        onChange={handleChange}
      />
      <label aria-label="Positively rated" for="yes">
        Helpful{' '}
        <span role="img" aria-hidden="true">
          👍🏽
        </span>
      </label>
      <input
        id="no"
        type="radio"
        name="response"
        checked={value === 'negative'}
        value="negative"
        onChange={handleChange}
      />
      <label aria-label="Negatively rated" for="no">
        Not helpful{' '}
        <span role="img" aria-hidden="true">
          👎🏽
        </span>
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}
