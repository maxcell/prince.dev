---
title: 'Reducing Boilerplate With React Context'
date: '2020-02-12'
slug: 'reuse-context'
tags: ['react', 'context']
---

A lot of blog posts I have read highlight React Context as a way to pass data to components without needing to <a target="_blank" rel="noopener noreferrer" href="https://kentcdodds.com/blog/prop-drilling">prop drill</a>. They tend to use an example like passing along user information or creating a light/dark theme. I wanted to showcase another way to think about Context. Instead of just passing along data, we'll use Context to refactor our application's management of notifications. We'll expose a function to allow developers to have a consistent pattern to follow, reduce some of the boilerplate, while also improving the user experience.

## Background - Reinventing the Wheel Everywhere

Across your codebase, you might notice certain chunks of code being repeated.
And if you work on a team where things get rewritten, you might notice certain patterns copied and used again but changed slightly. In our example codebase, we notice code being reimplemented in several places for notifying our users about the state of an interaction in our app. It generally looks like this:

```jsx
// in AssignmentForm.jsx
import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'

/**
 * Returns a form that will be used for creating an assignment.
 * An assignment represents a piece of work that would be given to a student.
 * An assignment in this example will only have a title and description.
 */
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
  
  function renderForm() {
    // Displays the form which would have labels/inputs 
    // for title and description
    // ...
  }

  return (
    <React.Fragment>
      {renderForm()}
      <Snackbar
        autoHideDuration={2000}
        open={open}
        message={message}
        status={status} />
    </React.Fragment>
  )
}
```

While this isn't a bad approach, as we create more interactions across the site, we weren't being consistent about how long it should remain open and sometimes there were custom colors that it should display. Some interactions even didn't launch because of how hard it was to manage the state. We thought, "how can we provide standardization while still providing flexibility?" This is where Context gave us some help!

## Building Out Our Reusable Notification

We'll start with building out a `Notification` component. This will be presentational and just take in a bunch of props. It will be using the <a target="_blank" rel="noopener noreferrer" href="https://material-ui.com/components/snackbars/">Material UI's `<Snackbar />`</a>, so it already has patterns for how to handle displaying it. The main props we want to look at are: `open`, `message`, `anchorOrigin`, `status`, `autoHideDuration`, `onClose`, `onExited`.

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
      autoHideDuration={3500} //calls onClose after 3500ms (3.5secs)
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

Developers using this component at least need to tell us the `message` they want to display and the `status` which determines the colors we want the `<Snackbar />` in. The other properties will be consistent no matter what, so we won't expose a way to change them outside of our file. With just this component, we already solve the issue of consistency!

While having a single component to present rather than declaring them adhoc is nice, it doesn't quite yet solve the problem of the localized state in every component. We have to get this component to get rendered after an interaction. We'll have React Context expose a function to make the `<Snackbar />` appear.

## Thinking with Context

Since notifications can be used across any part of the application, it helps us to think about creating the Provider at the highest level of the component tree and only rendering our notifications there.

We'll place the logic for making the Notification appear/disppear, using `setOpen` and `handleClose`, inside of the Provider and pass them down to our `Notification` component. We'll also have `messageData` represent what should be displayed to the user.

```jsx {2,6,8-10,12-19,21-27}
// in notification-context.js
import React, { useState } from 'react'

// ... Our notification component

export const NotificationContext = React.createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [messageData, setMessageData] = useState(undefined)

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      // To make sure that the notification stays on
      // the page no matter if we click somewhere else
      return
    }
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

```jsx {2,11,20-24,27}
// in notification-context.js
import React, { useState, useRef } from 'react'

// ... Our notification component

export const NotificationContext = React.createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [messageData, setMessageData] = useState(undefined)
  const queueRef = useRef([])

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  // This should take the shape of an object
  // with two keys, message and status
  function createNotification(notification) {
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

```jsx {20-25,27-29,34-40}
// in notification-context.js
import React, { useState, useRef } from 'react'

// ... Our notification component

export const NotificationContext = React.createContext()

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [messageData, setMessageData] = useState(undefined)
  const queueRef = useRef([])

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  function processQueue() {
    if (queueRef.current.length > 0) {
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

Now, the only thing left to do is rewrite the places that we were using our `<Snackbar />`s in our application. **Make sure that our topmost component is wrapped with our `NotificationProvider` before using it anywhere.**

We can change our original example to something like this:

```jsx {2-3,12}
// in AssignmentForm.jsx
import React, { useContext } from 'react';
import { NotificationContext } from './notification-context'

/**
 * Returns a form that will be used for creating an assignment.
 * An assignment represents a piece of work that would be given to a student.
 * An assignment in this example will only have a title and description.
 */
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
  
  function renderForm() {
    // Displays the form which would have labels/inputs 
    // for title and description
    // ...
  }

	return (
		{renderForm()}
	)
}
```

Now our form is consuming our context and we can just call our `createNotification` any time we need it! Here a CodeSandbox of it in application:

<iframe
     src="https://codesandbox.io/embed/intelligent-bush-3sq60?autoresize=1&fontsize=14&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="notification-example"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>

## Conclusion

This was just an example of how Context can be used to surface patterns across an application. It does not need to be only used for exposing data or a theme to the entirety of an application. There are times where we want to bring reusability to our application to avoid adhoc cases that cannot be their own component. The great thing about this solution is that this makes sure to separate the concerns of our application so a component doesn't need to worry about maintaining the logic for launching the `<Snackbar />` when it doesn't need to.

P.S. Shoutout to a few folks who helped with this blog post!
- [Adam McNeilly](https://twitter.com/AdamMc331) for coming up with the title.
- [Sylwia Vargas](https://twitter.com/SylwiaVargas), [Zade Kaakarni](https://twitter.com/_xadeka), and [Joe Previte](https://twitter.com/jsjoeio) for reading through it and giving me their amazing feedback.
-  [Ryan Harris](https://twitter.com/ryan_c_harris) and [Ryan Warner](https://twitter.com/ryanwarnercodes) for cheering me on!
