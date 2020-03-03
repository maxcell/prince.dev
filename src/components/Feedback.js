import React, { useState } from 'react'

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default function FeedbackForm(props) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', response: value }),
    })
      .then(() => alert('Success!'))
      .catch(error => alert(error))
  }

  function handleChange(e) {
    setValue(e.target.value)
  }

  return (
    <form name="feedback" method="post" onSubmit={handleSubmit}>
      <input type="hidden" name="feedback" value="feedback" />
      <input
        id="yes"
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
