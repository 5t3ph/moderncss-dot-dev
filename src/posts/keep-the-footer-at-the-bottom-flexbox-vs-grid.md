---
title: "Keep the Footer at the Bottom: Flexbox vs. Grid"
topics: Flexbox,Grid,Layout
episode: 1
description: "Floating footers can occur for many reasons, but modern CSS methods using either flexbox or CSS grid let us plan a future-proof solution for any size layout."
templateEngineOverride: njk, md
date: 2020-04-09
---

For many years, I constantly referred to [this article](https://matthewjamestaylor.com/bottom-footer) by Matthew James Taylor for a method to keep a webpage footer at the bottom of the page regardless of the main content length. This method relied on setting an explicit footer height, which is not scalable but a very good solution BF (Before Flexbox).

If you mostly deal with SPA development, you may be confused about why this problem is still around, but it's still a possibility to find your footer floating up for:

- login pages
- blog/news articles (with no ads...)
- interstitial pages of a flow like confirming actions
- product listing pages
- calendar event details

There are two ways to handle this with modern CSS: flexbox and grid.

Here's the demo, defaulted to the flexbox method. If you open the full Codepen, you can swap the `$method` variable to `grid` to view that alternative.

Read on past the demo to learn about each method.

{% codepen "abvboxz" %}

{% carbonAd %}

## Flexbox Method

This method is accomplished by defining:

```css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

footer {
  margin-top: auto;
}

/* Optional */
main {
  margin: 0 auto;
  /* or: align-self: center */
  max-width: 80ch;
}
```

{% newsletterPromo %}

### How it Works

First, we ensure the `body` element will stretch to at least the full height of the screen with `min-height: 100vh`. This will not trigger overflow if content is short (exception: [certain mobile browsers](https://css-tricks.com/some-things-you-oughta-know-when-working-with-viewport-units/)) and it will allow content to continue stretching the height as needed.

Setting `flex-direction: column` keeps the behavior of normal document flow in terms of retaining stacked block-elements (which assumes direct children of `body` are all indeed block elements).

The advantage of flexbox is in leveraging the `margin: auto` behavior. This one weird trick will cause the margin to fill any space between the item it is set on and its nearest sibling in the corresponding direction. Setting `margin-top: auto` effectively pushes the footer to the bottom of the screen.

### Gotcha

In the demo, I've added an `outline` to `main` to demonstrate that in the flexbox method the `main` element doesn't fill the height. Which is why we have to use the `margin-top: auto` trick. This is not likely to matter to you, but if it does, see the grid method which stretches the `main` to fill the available space.

## Grid Method

This method is achieved by setting:

```css
body {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

// Optional
main {
  margin: 0 auto;
  max-width: 80ch;
}
```

### How it Works

We retain the `min-height: 100vh` for this method, but we then use of `grid-template-rows` to space things correctly.

This method's weird trick is using the special grid unit `fr`. The `fr` means "fraction" and using it requests that the browser computes the available "fraction" of space that is left to distribute to that column or row. In this case, it fills all available space between the header and footer, which also solves the "gotcha" from the flexbox method.

## Which is Better?

After seeing grid, you may have a moment of thinking it's clearly superior. However, if you add more elements between the header and footer you need to update your template (or ensure there's always a wrapping element such as a `div` to not affect any nested semantics/hierarchy).

On the other hand, the flexbox method is usable across various templates with multiple block elements in the midsection - for example, a series of `<article>` elements instead of a single `<main>` for an archive page.

So as with all techniques, it depends on the project :) But we can all agree it's amazing to have these modern CSS layout methods!
