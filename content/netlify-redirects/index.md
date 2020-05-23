---
title: 'Adding Redirects with Netlify'
date: '2020-05-23'
slug: 'netlify-redirects'
tags: ['netlify', 'web']
---

While sharing out my [twitch stream link on Twitter][twitch tweet], I ended up initially sharing the wrong
user (I was off by one letter). This made me realize I never want to type this out
myself ever again. I went to Netlify to solve this for me!

Netlify offers two ways to configure your redirects:

1. [In your `netlify.toml` file][netlify toml redirect]
2. [In a `_redirects` file][netlify _redirects]

I decided to choose the latter option (#2). In there, we can tell the browser if we see a request from the left
column that it should go to the one on the right:

## Never Share The Wrong Social Link Again

```toml
# in static/_redirects

# If we see prince.dev/twitch change it to https://twitch.tv/maxcellw
/twitch   https://twitch.tv/maxcellw
```

This way I can share out <https://prince.dev/twitch> and that will take you to my Twitch stream!

## Changing The Site Around and Keeping Links Updated

If you've come to my site before, I used to post all my topics under `/blog/<blog-slug>`. However,
I've decided that everything should just live at the top-level so it is just the slug. 
While making the content on my site do this is as easy as changing one line of code, I want
to be also sure that any links to my blog posts aren't broken. This is where we can also use a redirect:

```toml {4}
# in static/_redirects

/twitch   https://twitch.tv/maxcellw
/blog/*   /:splat
```

This uses a **splat** operator(*) that will match to anything following the `/blog/` pattern. That gets saved into
the `:splat` placeholder and then we can just tell our site that it should take us to the top-level verison
like we want.

If any user clicks on a link on any other site that maybe were to take us to `prince.dev/blog/netlify-redirects` 
it will go to `prince.dev/netlify-redirects` instead. Which is what we want!


## What's Next For You?

There are a ton of options that you can look into on Netlify's site as well if you want to 
[learn more about redirects][redirect options]. I know that [Kent C. Dodds](https://kentcdodds.com/) also loves using 
Netlify and [built a tool to support sharing more content with their own URL shortener][url shortener].



[twitch tweet]: https://twitter.com/maxcell/status/1262760502284791808?s=20
[netlify toml redirect]: https://docs.netlify.com/configure-builds/file-based-configuration/#redirects
[netlify _redirects]: https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file
[redirect options]: https://docs.netlify.com/routing/redirects/redirect-options
[url shortener]: https://github.com/kentcdodds/netlify-shortener