---
title: 'React Router - Using Location State for Custom UI Navigation'
date: '2020-01-21'
slug: 'location-state'
tags: ['react', 'react-router', 'javascript']
---

When we write our code, we have to think about designing it in a way such that
it can handle the current requirements and create opportunity for other developers to
come in to change the code whenever the requirements change. An example of this
came up when I was dealing with code that handles navigational flow within our
application.

We wanted to have a back button on some pages that would return users to the p
revious page they were looking at. Originally, we handled this through inserting
a redirect path inside a query parameter.

```js
// You'll notice at the end we have a query parameter (?redirect_url=)
// that says where we came from and so we would use that param
// to send us to the previous page
const currentUrl = 'http://somecoolwebsite.com/posts/12341?redirect_url=/posts'

// Parse out the redirect_url
// ...

// Send us to the previous page
history.push(redirectUrl) // i.e. "/posts"
```

This worked! Closed ticket, shut laptop and let's call it a day -- not quite.

At the last second, the requirements changed and now you gotta handle more cases.
In our redirect url, we can't pass in any previous query parameters that were there,
so all context would be removed from the page. In addition, conceptually "going back"
shouldn't add more history (such as `history.push()` does). This was an excellent
time to figure out how to tidy everything up.

## Links to the rescue!

In [React Router][react router], the `Link` component is commonly used with a `to`
prop as a string:

```jsx
function BlogPostLink({ post }) {
  const { slug, title } = post

  return <Link to={`/post/${slug}`}>{title}</Link>
}
```

You can instead use an object for `to`! If we wanted to recreate the same
behavior, the code would look like this:

```jsx {5}
function BlogPostLink({ post }) {
  const { slug, title } = post

  // `pathname` value is equivalent to the string form `to`
  return <Link to={{ pathname: `/post/${slug}` }}>{title}</Link>
}
```

Now, you can pass in additional context through the key `state`.
This optional key allows you to pass in information that can be used for things
such as location-based rendering. It should take the shape of an object.
It is intentionally something we have to set for it to appear in the location object.

```jsx {7-9}
function BlogPostLink({ post }) {
  const { slug, title } = post
  return (
    <Link
      to={{
        pathname: `/post/${slug}`,
        state: {
          fromBlogRoll: true,
        },
      }}
    >
      {title}
    </Link>
  )
}
```

## Location-based rendering

Now that we have this state being inserted into our location object, where does
the actual **magic** happen? It all happens on the back button. Let's
say we want to have special text when we are coming directly from the blog
roll vs. any other page:

```jsx {10}
function BackButton(props) {
  // See documentation about React Router's Hook API
  // https://reacttraining.com/react-router/web/api/Hooks
  const history = useHistory()
  const location = useLocation()

  // Here we're checking to see if state exists for our location, it will
  // always have the key but we want to 1) verify it was set and 2) that
  // the state we received is something we've intentionally set
  const fromBlogRoll = location.state && location.state.fromBlogRoll

  return fromBlogRoll ? (
    <button onClick={() => history.goBack()}>Back to Blog Roll</button>
  ) : (
    <button onClick={() => history.push('/home')}>Home</button>
  )
}
```

Now we have a nice back button for our needs. This will take advantage of the history
object, so if we want to go back (`history.goBack()`) and still have all our query parameters, they will be there as well as any other things we've stored in our app's state.

This handles for the case of what if a user directly shares the link to someone else
and instead of seeing a back button, they should see a home button. So if we have
unauthenticated users, they cannot navigate through the app like other users. It will
fallback and present a home button.

An important note is we want to make sure to use the `location` object and **not**
the `history` object for determining the **current location** state.
The [history object can be mutated][history documentation] and
makes it not a good source of truth.

## Last Thoughts

Every time a bug is raised into a codebase I work on, I think about how can I make
something a bit better than when I found it. Of course this is super subjective.
I like to try to reduce down complexities where I can and how to take advantage
of tools that are closer within reach. With React Router, the tools were there for
me and it is a bit easier to manage the complexities of the UI logic.

### References and Additional Readings

- [React Training - React Router][react router]
- [React Training - API Hooks](https://reacttraining.com/react-router/web/api/Hooks)
- [React Training - Link API](https://reacttraining.com/react-router/web/api/Link/to-object)
- [React Training - Modal Example](https://reacttraining.com/react-router/web/example/modal-gallery)

[history documentation]: https://reacttraining.com/react-router/web/api/history/history-is-mutable
[react router]: https://reacttraining.com/react-router/web/guides/quick-start
