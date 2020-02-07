---
title: 'Digging Deeper with React Context'
date: '2020-02-12'
slug: 'reuse-context'
tags: ['learning', 'react', 'context']
---

A lot of blog posts will talk about context as something you can use to pass along data to your components so you can display information or hide certain views without having to drill down several components. In this blog post, we'll talk about using Context to provide consistent patterns for your peers, refactor your application, and create a great user experience.

## Reinventing the Wheel Everywhere

Sometimes in your React codebase, you'll notice that there are patterns of code that happen over and over again. And if you work on a team or go through stages of places where things get rewritten, you might notice certain patterns copied and used again but changed slightly. In a codebase I was working on I noticed us reimplementing code in several places for notifying our users about some successful/erronous interaction. It would look generally something like:

```jsx
class Assignment extends React.Component {
	state = {
		// ... A bunch of other state pieces
		isOpen: false,
		message: null,
		statusColor: null
	}

	handleSave() {
		this.setState({
			isOpen: true,
			message: 'This worked successfully',
			statusColor: 'success'
		})
	}

	handleError() {
		this.setState({
			isOpen: true,
			message: 'This failed',
			statusColor: 'error'
		})
	}

	render() {
		{this.renderAssignment()}
		<Snackbar
			autoHideDuration={2000}
			open={this.state.isOpen},
			message={this.state.message}
			status={this.state.statusColor}
			/>
	}
}
```

This isn't a bad approach at all! However, as we create more interactions across the site, we have to remain consistent on how and when it should open and for how long. When thinking about accessibility this is crucial! So how can we provide standardization while still providing flexibility? Well this is where Context can help us out!

## Building Out our Reusable Notification

We'll start with building out the Notification Component since it is the smallest and then we'll dive into how we want to use Context to make it appear! We will be using [Material UI's Snackbar](https://material-ui.com/components/snackbars/) which will handle the appearance and determining the location on the page. The main properties we want to look at are: `open`, `message`, `anchorOrigin`, `status`, `autoHideDuration`, and `onClose`.

For our developers, we just care about them telling us what the `message` is and what kind of `status` does it require. The other properties should be consistent no matter what, so we won't expose a way to change them. Let's start a new file called `notification-context.js`:

```jsx
// in notification-context.js
import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab' // used to style our Snackbar

function Notification({ text, status }) {
  const [open, setOpen] = useState(true)

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={open}
      autoHideDuration={3500}
      onClose={() => setOpen(false)}
    >
      <Alert variant="filled" severity={status}>
        {text}
      </Alert>
    </Snackbar>
  )
}
```

With just this component alone, we have solved the issue of consistency issue. No matter where you are in the application, you will always be presented the snackbar in the same location and for a predetermined time. For our developers they can also use this component to put in whatever text/status they feel is necessary. The status is limited to predefined colors we want to represent feedback, so people aren't putting random magentas.

Now while having a single component to present rather than declaring them adhoc is nice, it doesn't quite yet solve the problem of the localized state issue. Somehow we have to get these components to get rendered after an interaction. This is where context will help us expose functions to launch the snackbar.

## Thinking about Context

Since notifications can be used across any part of the application, it helps us to think about creating the Provider at the highest level of the component tree and just having our notifications rendered there. We might have a bunch of these on the page, but we won't expose how many notifications there are outside of the interals of our component.

```jsx
// in notification-context.js
import React, { useState, useContext } from 'react'

// ... Our notification component

const NotificationContext = React.createContext()

function NotificationProvider({ children }) {}
```
