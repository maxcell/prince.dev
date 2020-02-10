---
title: 'Digging Deeper with React Context'
date: '2020-02-12'
slug: 'reuse-context'
tags: ['learning', 'react', 'context']
---

A lot of blog posts highlight React Context as a way to pass data to components without needing to prop drill. They tend to use an example like passing along user information or creating a light/dark theme. I wanted to showcase another way to think about React Context. Instead of just passing along data, we'll use Context to refactor our application's management of notifications. We'll expose a function so that way developers can have a consistent pattern to follow and users will have a great experience.

## Background - Reinventing the Wheel Everywhere

Across your codebase, you might notice certain chunks of code being repeated.
And if you work on a team where things get rewritten, you might notice certain patterns copied and used again but changed slightly. In a codebase I was working on I noticed us reimplementing code in several places for notifying our users about the state of an interaction in our app. It would generally look like this:

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

While this isn't a bad approach, as we create more interactions across the site, we weren't being consistent about how long it should remain open and sometimes there were custom colors that it should display. Some interactions even didn't launch because of how hard it was to manage the state. We thought, "how can we provide standardization while still providing flexibility?" This is where Context gave us some help!

## Building Out our Reusable Notification

We'll start with building out a `Notification` component. This will be presentational and just take in a bunch of props. It will be using the [Material UI's Snackbar](https://material-ui.com/components/snackbars/), so it already has patterns for how to handle displaying it. The main props we want to look at are: `open`, `message`, `anchorOrigin`, `status`, `autoHideDuration`, `onClose`, `onExited`.

Let's start a new file called `notification-context.js`:

```jsx
// in notification-context.js
import React from 'react'
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

Developers using this component at least need to tell us the `message` they want to display and the `status` which determines the colors we want the `Snackbar` in. The other properties will be consistent no matter what, so we won't expose a way to change them outside of our file. With just this component, we already solve the issue of consistency!

While having a single component to present rather than declaring them adhoc is nice, it doesn't quite yet solve the problem of the localized state in every component. We have to get this component to get rendered after an interaction. We'll have React Context expose a function to make the Snackbar appear.

## Thinking with Context

Since notifications can be used across any part of the application, it helps us to think about creating the Provider at the highest level of the component tree and only rendering our notifications there.

We'll place the logic for making the Notification appear/disppear, using `setOpen` and `handleClose`, inside of the Provider and pass them down to our `Notification` component. We'll also have `messageData` represent what should be displayed to the user.

```jsx{2,6,8-22}
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

This will lay the foundation for our notification to be presented, but doesn't yet have the logic of adding any notifications. Since there can be multiple notification updates, we need to make sure only one appears at a time. We'll need to incorporate a queue. For our case, we'll use a `ref` to store it since we want to maintain our transitions.

```jsx{2,11,17-21,24}
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

  // This should take the shape of an object
  // with a key of message and status
  function createNotification(notificationData) {
    queueRef.current.push(notification)
  }

  return (
    <NotificationContext.Provider value={{ createNotification }}>
      {children}
      <Notification {...messageData} open={open} handleClose={handleClose} />
    </NotificationContext.Provider>
  )
}
```

If you take a gander, you'll notice our `value` prop on our `NotificationContext.Provider` is our `createNotification` function! This is going to be exposed to all children that consume our context. If we were to set this up in our app right now, we'd have a bunch of objects being added to our `queueRef` any time we called `createNotification`.

Finally, we need to add the logic to handle processing our notifications! This function essentially will be called any time we create a notification and when a notification exits from view, our `handleExited`.

```jsx{17-26,31-37}
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
      // If it is already open, close it, calls handleExited.
      setOpen(false)
    } else {
      // If not opened already, process your notification.
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

Now, the only thing left to do is rewrite the places that we were using our `Snackbar`s in our application. **Make sure that our topmost component is wrapped with our `NotificationProvider` before using it anywhere.**

We can change our original example to something like this:

```jsx
import React, { useContext } from 'react';
import { NotificationContext } from './notification-context'

function AssignmentForm(props) {

	const { createNotification } = useContext(NotificationContext)

	function handleSave() {
		// Handle saving your assignment, used within renderAssignment
		// ...
		function onSuccess() {
			createNotification({
				message: 'This worked successfully',
				status: 'success',
			})
		}

		function onError() {
			createNotification({
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

Now this is just a small example of how Context can be used to surface patterns across your application. It does not need to be only used for exposing your user data or your theme to the entirety of your application. There are times where you want to bring reusability to your application to avoid adhoc cases that cannot just be their own component. The great thing about this solution is that this makes sure to separate the concerns of our application so a component doesn't need to worry about maintaining the logic for launching the `Snackbar` when it doesn't need to.
