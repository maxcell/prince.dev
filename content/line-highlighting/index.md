---
title: 'Adding Line Highlighting to your Code Examples using Prism.js'
date: '2019-11-28'
slug: 'line-highlighting'
tags: ['javascript', 'blog']
draft: false
---

Company blogs, tutorials, and many other websites have code examples on them to help users learn about
their product, perform some cool integration, or highlight some specific problem they found and solved.
These code examples help tell a story for the reader. They also serve as nice snippets to just take with
you to solve your own coding-related issues. Heck that's how StackOverlow finds itself doing the best work.
So how can we improve the experiences of code examples? We are going to introduce line highlighting!

## Prerequisite

For context, I use Prism with Gatsby to make all of my code examples. If you want to:

- Make sure you have `gatsby-transformer-remark`, `gatsby-remark-prismjs`, and `prismjs` installed
- Add them to your `gatsby-config.js` under the `plugins`

If you want to read more about adding Prism or customizing the finer details, take a gander in at [documentation on Gatsby's plugin site][gatsby-prismjs].

## Line Highlighting with Prism

Let's start with building our own code example. Below we have a wonderful code block:

```js
class Doggo {
  constructor(name) {
    this.name = name
  }

  bark() {
    console.log(`${this.name} barks and wags their tag!`)
  }
}
```

In order to get the nice syntax highlighting we need to make sure to distinguish the language by three ticks (\`) and the language's name,
such as` ```js ` or ` ```javascript `. Now to highlight specific line(s), we need to list out the line number(s). For example, we want
to discuss the parameter list of the constructor we could write ` ```js{3} ` and this would produce:

```js {3}
class Doggo {
  constructor(name) {
    this.name = name
  }

  bark() {
    console.log(`${this.name} barks and wags their tag!`)
  }
}
```

Let's say we wanted to indicate a new function being introduced, we could highlight the lines that represent that function. So that way the
reader can tell, "Oh this is the new code they added!"

```js {10-12}
class Doggo {
  constructor(name) {
    this.name = name
  }

  bark() {
    console.log(`${this.name} barks and wags their tag!`)
  }

  hide() {
    console.log(`${this.name} hides!`)
  }
}
```

In the way we would do this here, we would have ` ```js{10-12} ` so that way it highlights multiple lines! You can also mix and match these two syntaxes
by just separating them by commas (` ```js{3,10-12} ` ).

```js {3,10-12}
class Doggo {
  constructor(name) {
    this.name = name
  }

  bark() {
    console.log(`${this.name} barks and wags their tag!`)
  }

  hide() {
    console.log(`${this.name} hides!`)
  }
}
```

If you're not a fan on how the highlighting looks, feel free to also adjust `.gatsby-highlight-code-line` class. So if you want the lines to be thicker or a different background color just change what you feel is right for you! For instance this is what I use for my highlighting:

```css
.gatsby-highlight-code-line {
  background-color: rgb(53, 59, 69);
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid #f99;
}
```

I personally love it when people who are writing documentation or tutorials outline how code is changing.
It is important to distinguish what is old code, how is it being updated, or what lines are important to put
your focus towards. While you might find it easy to digest as the writer, the audience you're writing to might
be a variety of different folks! Understanding their needs will help you craft your narrative as well as how to
get them to excel.

[gatsby-prismjs]: https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/
