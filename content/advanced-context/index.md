---
title: 'Digging Deeper with React Context'
date: '2020-02-12'
slug: 'reuse-context'
tags: ['learning', 'react', 'context']
---

A lot of blog posts will talk about context as something you can use to pass along data to your components so you can display information or hide certain views without having to drill down several components. In this blog post we'll talk about using context to pass along functions that can help refactor your app and let you expose patterns that give better feedback to your users.

## Reinventing the Wheel Everywhere

Sometimes in your React codebase, you'll notice that there are patterns of code that happen over and over again. And if you work on a team or go through stages of places where things get rewritten, you might notice certain patterns copied and used again but changed slightly. In a codebase I was working on I noticed us reimplementing code in several places for notifying our users about some successful/erronous interaction. It would look generally something like:

```jsx
class Story extends React.Component {
	state = {
		// ... A bunch of other state pieces
		isOpen: false,
		message: null,
		statusColor: null
	}

	handleClick() {
		this.setState(state => {
			isOpen: true,
			message: 'This worked successfully',
			statusColor: 'success'
		})
	}

	render() {
		// TODO: Add more here
		<Snackbar
			open={this.state.isOpen},
			message={this.state.message}
			status={this.state.statusColor}
			/>
	}
}
```
