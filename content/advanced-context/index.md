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
function AssignmentForm(props) {
	// Bunch of other state stuff...
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState('')


	function handleSave() {
		// Handle saving your assignment, used within renderAssignment
		// ...

		function onSuccess() {
			setOpen(true)
			setMessage('This worked successfully')
			setStatus('success')
		}

		function onError() {
			setOpen(true)
			setMessage('This failed. Oops.')
			setStatus('error')
		}
	}

	return (
		{this.renderAssignment()}
		<Snackbar
			autoHideDuration={2000}
			open={this.state.isOpen},
			message={this.state.message}
			status={this.state.statusColor}
			/>
	)
}
```

This isn't a bad approach at all! However, as we create more interactions across the site, we have to remain consistent on how and when it should open and for how long. When thinking about accessibility this is crucial! So how can we provide standardization while still providing flexibility? Well this is where Context can help us out!

## Building Out our Reusable Notification

We'll start with building out the Notification Component since it is the smallest and then we'll dive into how we want to use Context to make it appear! We will be using [Material UI's Snackbar](https://material-ui.com/components/snackbars/) which will handle the appearance and determining the location on the page. The main properties we want to look at are: `open`, `message`, `anchorOrigin`, `status`, `autoHideDuration`, `onClose`, `onExited`.

For our developers, we just care about them telling us what the `message` is and what kind of `status` does it require. The other properties should be consistent no matter what, so we won't expose a way to change them. Let's start a new file called `notification-context.js`:

```jsx
// in notification-context.js
import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab' // used to style our Snackbar

function Notification({ message, status, open, handleClose, handleExited }) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={open}
      autoHideDuration={3500} // Automatically calls onClose after 1000ms (3.5secs)
      onClose={handleClose}
      onExited={handleExited}
    >
      <Alert variant="filled" severity={status}>
        {message}
      </Alert>
    </Snackbar>
  )
}
```

With just this component alone, we have solved the issue of consistency issue. No matter where you are in the application, you will always be presented the snackbar in the same location and for a predetermined time. For our developers they can also use this component to put in whatever text/status they feel is necessary. The status is limited to predefined colors we want to represent feedback, so people aren't putting random magentas.

Now while having a single component to present rather than declaring them adhoc is nice, it doesn't quite yet solve the problem of the localized state issue. Somehow we have to get these components to get rendered after an interaction. This is where context will help us expose functions to launch the snackbar.

## Thinking about Context

Since notifications can be used across any part of the application, it helps us to think about creating the Provider at the highest level of the component tree and just having our notifications rendered there.

We'll place the logic for making the Notification appear/disppear, `setOpen` and `handleClose`, inside of the Provider and pass them down to our `Notification`. We'll also have `messageData` represent what should be displayed to the user, such as the message and the color.

```jsx
// in notification-context.js
import React, { useState } from 'react'

// ... Our notification component

export const NotificationContext = React.createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = React.useState(false)
  const [messageData, setMessageData] = React.useState(undefined)

  function handleClose() {
    setOpen(false)
  }

  return (
    <NotificationContext.Provider>
      {children}
      <Notification {...messageData} open={open} handleClose={handleClose} />
    </NotificationContext.Provider>
  )
}
```

This will control what the page looks like so far, but it currently doesn't have the crux which is adding notifications onto the screen.

Since there can be multiple notification updates, we'd like to make sure only one appears at a time. We'll need to incorporate a queue, for our case we'll use a `ref` to store it since we want to maintain our transitions.

```jsx
// in notification-context.js
import React, { useState, useRef } from 'react'

// ... Our notification component

export const NotificationContext = React.createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = React.useState(false)
  const [messageData, setMessageData] = React.useState(undefined)
  const queueRef = useRef([])

  function handleClose() {
    setOpen(false)
  }

  function createNotification(notificationData) {
    queueRef.current.push(notification)
  }

  return (
    <NotificationContext.Provider value={{ createNotification }}>
      {children}
      <Notification
        {...messageData}
        open={open}
        handleClose={handleClose}
        handleExited={handleExited}
      />
    </NotificationContext.Provider>
  )
}
```

If you take a gander, you'll notice our value is our `createNotification` function! This is going to be exposed to all children that consume our context. This means that if we were to set this up in our app right now, we'd have a bunch of objects being added to our `queueRef`.

The last piece will be is the logic to display everything on the page and handle processing our notifications! We'll need to write a function that essentially knows hwo to process our notifications and just update our `createNotification` function so it knows to process them instead of only adding more!

```jsx
// in notification-context.js
import React, { useState, useRef } from 'react'

// ... Our notification component

export const NotificationContext = React.createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = React.useState(false)
  const [messageData, setMessageData] = React.useState(undefined)
  const queueRef = useRef([])

  function handleClose() {
    setOpen(false)
  }

  function processQueue() {
    if (queueRef.curren.length > 0) {
      setMessageData(queueRef.current.shift())
      setOpen(true)
    }
  }

  function handleExited() {
    processQueue()
  }

  function createNotification(notification) {
    queueRef.current.push(notification)

    if (open) {
      setOpen(false)
    } else {
      processQueue()
    }
  }

  return (
    <NotificationContext.Provider value={{ createNotification }}>
      {children}
      <Notification
        {...messageData}
        open={open}
        handleClose={handleClose}
        handleExited={handleExited}
      />
    </NotificationContext.Provider>
  )
}
```

Everything is finally tidyed up with our snackbar. The only thing left to do is rewrite the places that we were using them before in our application. Make sure that our topmost component is wrapped with our `NotificationProvider` before using it anywhere.

Now we can change our original example to something like this:

```jsx
import React, { useContext } from 'react';
import { NotificationContext } from './notification-context'

function AssignmentForm(props) {

	const { createNotification } = useContext(NotificationContext)

	function handleSave() {
		// Handle saving your assignment, used within renderAssignment
		// ...
		function onSuccess() {
			props.createNotification({
				message: 'This worked successfully',
				status: 'success',
			})
		}

		function onError() {
			props.createNotification({
				message: 'This failed',
				status: 'error',
			})
		}
	}

	return (
		{this.renderAssignment()}
	)
}
```

## Conclusion

Now this is just a small example of how Context can be used to surface patterns across your application. It does not always need to be used for simply exposing your user data or your theme to the entirety of your application. There are times where you want to bring reusability and patterns to your application that allows for discoverability without rewriting adhoc cases. Sometimes your team will need to do something over and over again and this is a way to make it easier for them to utilize pre-existing patterns since they don't have to change up their own components work.
