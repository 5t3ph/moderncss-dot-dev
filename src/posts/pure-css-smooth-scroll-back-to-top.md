---
title: 'Pure CSS Smooth-Scroll  "Back to Top "'
topics: Animation,Design,Layout
episode: 4
description: '"Back to top" links may not be in use often these days, but there are two modern CSS features that the technique demonstrates well: `position: sticky` and `scroll-behavior: smooth`.'
templateEngineOverride: njk, md
date: 2020-04-16
---

"Back to top" links may not be in use often these days, but there are two modern CSS features that the technique demonstrates well:

- `position: sticky`
- `scroll-behavior: smooth`

I first fell in love with "back to top" links - and then learned how to do them with jQuery - on one of the most gorgeous sites of 2011: [Web Designer Wall](https://web.archive.org/web/20110413163553/https://webdesignerwall.com/tutorials/animated-scroll-to-top).

The idea is to provide the user with a "jump link" to scroll back to the top of the website and was often used on blogs of yore.

Here's what we will learn to achieve:

![demo of "back to top" link](https://dev-to-uploads.s3.amazonaws.com/i/e5vl0sijw6j0zrmiddc6.gif)

{% carbonAd %}

## About `position: sticky`

This newer position value is described as follows on [caniuse](https://caniuse.com/#search=position%3A%20sticky):

> Keeps elements positioned as "fixed" or "relative" depending on how it appears in the viewport. As a result, the element is "stuck" when necessary while scrolling.

The other important note from caniuse data is that you will need to offer it prefixed for the best support. Our demo will fallback to `position: fixed` which will achieve the main goal just a bit less gracefully.

## About `scroll-behavior: smooth`

This is a very new property, and [support is relatively low](https://caniuse.com/#search=scroll-behavior). This exact definition requests that scrolling behavior, particularly upon selection of an anchor link, has a smoothly animated appearance versus the default, more jarring instant jump.

Using it offers "progressive enhancement" meaning that it will be a better experience for those whose browsers support it, but will also work for browsers that don't.

Surprisingly, Safari is behind on supporting this, but the other major browsers do.

## Set the Stage: Basic content HTML

First, we need to setup some semantic markup for a basic content format:

```html
<header id="top">Title</header>
<main>
  <article>
    <!-- long form content here -->
  </article>
  <!-- Back to Top link -->
  <div class="back-to-top-wrapper">
    <a href="#top" class="back-to-top-link" aria-label="Scroll to Top">🔝</a>
  </div>
</main>
```

We place our link after the `article`, but within `main`. It isn't specifically part of the article, and we also want it to be last in focus order.

We also add `id="top"` to the `<header>` and use that anchor as the `href` value for the back to top link. If you only wanted to scroll to the top of `<main>` you can move the id, or also attach it to an existing id near the top of your page.

## Add smooth-scrolling

The first part of our objective is easy peasy and is accomplished by the following CSS rule:

```css
/* Smooth scrolling IF user doesn't have a preference due to motion sensitivities */
@media screen and (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

_h/t to @mhlut for pointing out that the original solution was not accounting for `prefers-reduced-motion`_

Previously, I had this [CSS-Tricks article](https://css-tricks.com/snippets/jquery/smooth-scrolling/) bookmarked to accomplish this with jQuery and vanilla JS. The article has been around a while, and kudos to that team for continually updating articles like that when new methods are available 👍

I have found some oddities, such as when you visit a page that includes an `#anchor` in the URL it still performs the smooth scroll which may not actually be desirable for your scenario.

{% newsletterPromo %}

## Style the "Back to Top" link

Before we make it work, let's apply some basic styling to the link. For fun, I used an emoji but you can swap for an SVG icon for more control over styling.

```css
.back-to-top-link {
  display: inline-block;
  text-decoration: none;
  font-size: 2rem;
  line-height: 3rem;
  text-align: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #d6e3f0;
  /* emoji don't behave like regular fonts
     so this helped position it correctly */
  padding: 0.25rem;
}
```

This gives us a very basic round button. In the full Codepen, I've added additional "pretty" styles and `:hover` and `:focus` styling, but those aren't essential.

Next, you may wonder why we added a wrapper for this link. The reason is we need to use it to basically create a "scroll track" for the link to live within.

The way `position: sticky` is designed, it picks up the element from where it's positioned in the DOM. Then, it respects a "top" value to place it relative to the viewport. However, we placed the link at the end of the document, so it would essentially never be picked up without some assistance.

We will use the wrapper along with `position: absolute` to alter the link's position to visually higher up on the page. Thankfully, the browser uses this visually adjusted position - aka when it enters the viewport - to calculate when to "stick" the link.

So, our wrapper styles look like this:

```scss
/* How far of a scroll travel within <main> prior to the
   link appearing */
$scrollLength: 100vh;

.back-to-top-wrapper {
  // uncomment to visualize "track"
  // outline: 1px solid red;
  position: absolute;
  top: $scrollLength;
  right: 0.25rem;
  // Optional, extends the final link into the
  // footer at the bottom of the page
  // Set to `0` to stop at the end of `main`
  bottom: -5em;
  // Required for best support in browsers not supporting `sticky`
  width: 3em;
  // Disable interaction with this element
  pointer-events: none;
}
```

The last definition may also be new to you: `pointer-events: none`. This essentially lets interaction events like clicks "fall through" this element so that it doesn't block the rest of the document. We wouldn't want this wrapper to accidentally block links in the content, for example.

With this in place, we now see the link overlapping the content a little bit below the initial viewport content. Let's add some styling to `<main>` to prevent this overlap, and also add `position: relative` which is necessary for best results given the absolute link wrapper:

```scss
main {
  // leave room for the "scroll track"
  padding: 0 3rem;
  // required to make sure the `absolute` positioning of
  // the anchor wrapper is indeed `relative` to this element vs. the body
  position: relative;
  max-width: 50rem;
  margin: 2rem auto;

  // Optional, clears margin if last element is a block item
  *:last-child {
    margin-bottom: 0;
  }
}
```

All that's left is to revisit the link to add the necessary styles for the positioning to full work:

```css
.back-to-top-link {
  // `fixed` is fallback when `sticky` not supported
  position: fixed;
  // preferred positioning, requires prefixing for most support, and not supported on Safari
  // @link https://caniuse.com/#search=position%3A%20sticky
  position: sticky;
  // reinstate clicks
  pointer-events: all;
  // achieves desired positioning within the viewport
  // relative to the top of the viewport once `sticky` takes over, or always if `fixed` fallback is used
  top: calc(100vh - 5rem);

  // ... styles written earlier
}
```

The `fixed` fallback means that browsers that don't support `sticky` positioning will always show the link. When `sticky` is supported, the fully desirable effect happens which is the link will not appear until the `$scrollLength` is passed. With `sticky` position, once the top of the wrapper is in the viewport, the link is "stuck" and scrolls with the user.

Notice we also reinstated `pointer-events` with the `all` value so that interaction with the link actually work.

And here's the final result - view in non-Safari for best results.

{% codepen "OJyyqWR" %}

## Known Issues

If you have short-form content, this doesn't fail very gracefully on a shorter device viewport. You may think - as did I - to use `overflow: hidden`. But that, unfortunately, prevents `position: sticky` from working entirely ☹️ So in a "real world" scenario, you may have to offer an option to toggle this behavior per article, or perform a calculation to determine if an article meets a length requirement before injecting it in the template.

Drop a comment if you know of or find any other "gotchas" with these methods!
