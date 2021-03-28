---
title: "CSS-Only Accessible Dropdown Navigation Menu"
topics: Accessibility,Animation,Grid,Responsive Design,Selectors
episode: 7
description: "This technique explores using: animation with CSS `transition` and `transform`, using the `:focus-within` pseudo-class, CSS grid, and accessibility considerations for dropdown menus."
templateEngineOverride: njk, md
date: 2020-04-23
---

This technique explores using:

- Animation with CSS `transition` and `transform`
- Using the `:focus-within` pseudo-class
- CSS grid for positioning
- dynamic centering technique
- Accessibility considerations for dropdown menus

{% carbonAd %}

If you've ever pulled your hair out dealing with the concept of "hover intent", then this upgrade is for you!

Before we get too far, while our technique 100% uses only CSS, there is a need to add some Javascript for a more comprehensively accessible experience. There is also a [polyfill](https://allyjs.io/api/style/focus-within.html) needed for a key feature to make this work - `:focus-within` - [for the most reliable support](https://caniuse.com/#search=focus-within). But we've still greatly improved from the days of needing one or more jQuery plugins to accomplish the visual effects.

> **Accessibility update - 08/18/20**: A huge thanks to [Michael Fairchild](https://twitter.com/mfairchild365) of Deque (and creator of the excellent resource [a11ysupport.io](https://a11ysupport.io/)) for testing the original solution across various assistive technology. The CSS-only method needs some Javascript to fully meet WCAG 2.1. In particular, javascript needs to be used to offer a non-mouse/non-tab way to dismiss the menu (think escape key) to meet [success criteria 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html). Michael pointed to [this WAI-ARIA Authoring Practices demo](https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation.html) which provides more info on the necessary Javascript features. These are highly recommended additions for your final production solution.

---

If you've not used Sass, you may want to take five minutes to understand [the nesting syntax of Sass](https://sass-lang.com/guide#topic-3) to most easily understand the code samples given.

## Base Navigation HTML

We will enhance this as we continue, but here's our starting structure:

```html
<nav aria-label="Main Navigation">
  <ul>
    <li><a href="#">About</a></li>
    <li class="dropdown">
      <!-- aria-expanded needs managed with Javascript -->
      <button
        type="button"
        class="dropdown__title"
        aria-expanded="false"
        aria-controls="sweets-dropdown"
      >
        Sweets
      </button>
      <ul class="dropdown__menu" id="sweets-dropdown">
        <li><a href="#">Donuts</a></li>
        <li><a href="#">Cupcakes</a></li>
        <li><a href="#">Chocolate</a></li>
        <li><a href="#">Bonbons</a></li>
      </ul>
    </li>
    <li><a href="#">Order</a></li>
  </ul>
</nav>
```

Overlooking the `button` for a minute, this is the semantic standard for navigation links. This structure is flexible to live anywhere on your page, so it could be a table of contents in your sidebar as easily as it is the main navigation.

Right out the gate, we have implemented a few features specifically for accessibility:

1. `aria-label` on the `<nav>` to help identify it's purpose when assistive tech is used to navigate a page by landmarks
2. Use of a `button` as a focusable, discoverable element to trigger the opening of the dropdown
3. `aria-controls` on the `.dropdown__title` that links to the id of the `.dropdown__menu` to associate it with the menu for assistive tech
4. `aria-expanded` on the `button` which in your final solution needs toggled via Javascript as noted in the demo mentioned at the beginning of this article

> As noted by Michael, use of a `button` element also allows Dragon Naturally Speaking users to say something like 'click button' to open the menu.

Our (mostly) default starting appearance is as follows:

![default list of links](https://dev-to-uploads.s3.amazonaws.com/i/ph6ne7veudghpvnajgp6.png)

## Initial Navigation Styles

First, we'll give some container styles to `nav` and define it as a grid container. Then we'll remove default list styles from the `nav ul` and `nav ul li`.

```scss
nav {
  background-color: #eee;
  padding: 0 1rem;
  display: grid;
  place-items: center;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;

    li {
      padding: 0;
    }
  }
}
```

![navigation list with list styles removed](https://dev-to-uploads.s3.amazonaws.com/i/awvgs6rxt2j1787b9lbi.png)

We've lost the hierarchical definition, but we can begin to bring it back with the following:

```scss
nav {
  // ...existing styles

  > ul {
    grid-auto-flow: column;

    > li {
      margin: 0 0.5rem;
    }
  }
}
```

By using the child combinator selector `>` we've defined that the top-level `ul` which is a direct child of `nav` should switch it's `grid-auto-flow` to `column` which effectively updates it to be along the `x-axis`. We then add margin to the top-level `li` elements for a bit more definition. Now, the future dropdown items are appearing contained below the "Sweets" menu and are more clearly its children:

![nav list with direct child styles](https://dev-to-uploads.s3.amazonaws.com/i/y6ikx5v9h84lm44cfksp.png)

Next we'll add a touch of style first to all links as well as the `.dropdown__title`, then to only the top-level links in addition to the `.dropdown__title`. This is also where we clear out the native browser styles inherited for `button` elements.

```scss
// Clear native browser button styles
.dropdown__title {
  background-color: transparent;
  border: none;
  font-family: inherit;
}

nav {
  > ul {
    > li {
      // All links contained in the li
      a,
      .dropdown__title {
        text-decoration: none;
        text-align: center;
        display: inline-block;
        color: blue;
        font-size: 1.125rem;
      }

      // Only direct links contained in the li
      > a,
      .dropdown__title {
        padding: 1rem 0.5rem;
      }
    }
  }
}
```

![updated link styles](https://dev-to-uploads.s3.amazonaws.com/i/pmnd1jz05g8u934r72lk.png)

## Base Dropdown Styles

We have thus far been relying on element selectors, but we will bring in class selectors for the dropdown since there may be multiple in a given navigation list.

{% newsletterPromo %}

We'll first style up the `.dropdown__menu` and its links to help identify it more clearly as we work through positioning and animation:

```scss
.dropdown {
  position: relative;

  .dropdown__menu {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0.15em 0.25em rgba(black, 0.25);
    padding: 0.5em 0;
    min-width: 15ch;

    a {
      color: #444;
      display: block;
      padding: 0.5em;
    }
  }
}
```

![dropdown__menu styles](https://dev-to-uploads.s3.amazonaws.com/i/8fgjgciuge2ts2k0nqbl.png)

One of the clear issues is that the `.dropdown__menu` is affecting the `nav` container, which you can see from the grey `nav` background being present around the dropdown.

We can start to fix this by adding `position: absolute` to the `.dropdown__menu` which takes it out of normal document flow:

![menu with position absolute](https://dev-to-uploads.s3.amazonaws.com/i/jdvoh962drdgg0vu4bze.png)

You can see it's aligned to the left and below of the parent list item. Depending on your design, this may be the desirable location.

We're going to pull out a centering trick to align the menu central to the list item:

```scss
.dropdown__menu {
  // ... existing styles

  position: absolute;

  // Pull up to overlap the parent list item very slightly
  top: calc(100% - 0.25rem);
  // Use the left from absolute position to shift the left side
  left: 50%;
  // Use translateX to shift the menu 50% of it's width back to the left
  transform: translateX(-50%);
}
```

The magic of this centering technique is that the menu could be any width or even a dynamic width and it would center appropriately.

![centered dropdown__menu styles](https://dev-to-uploads.s3.amazonaws.com/i/rgd0anjvrugsq1x8mk9x.png)

## Dropdown Reveal Styles

There are two primary triggers we want used to open the menu: `:hover` and `:focus`.

However, traditional `:focus` will not persist the open state of the dropdown. Once the initial trigger loses focus, the keyboard focus may still move through the dropdown menu, but visually the menu would disappear.

### `:focus-within`

There is an upcoming pseudo-class called `:focus-within` and it is precisely what we need to make it possible for this to be a CSS-only dropdown. As mentioned in the intro, it does require a [polyfill](https://allyjs.io/api/style/focus-within.html) if you need to support IE < Edge 79 ([you do](https://caniuse.com/#search=focus-within)... for now).

[From MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within), italics mine to show the part we're going to benefit from:

> The `:focus-within` CSS pseudo-class represents an element that has received focus _or contains an element that has received focus_. In other words, it represents an element that is itself matched by the `:focus` pseudo-class _or has a descendant that is matched by `:focus`_.

### Hide the dropdown by default

Before we can reveal the dropdown, we need to hide it, so we will use the hidden styles as the default state.

Your first instinct may be `display: none` but that locks us out of gracefully animating the transition.

Next, you might try simply `opacity: 0` which visibly hides it but leaves behind "ghost links" because the element still has computed height.

Instead, we will use a combination of `opacity`, `transform`, and `visibilty`:

```scss
.dropdown__menu {
  // ... existing styles
  transform: rotateX(-90deg) translateX(-50%);
  transform-origin: top center;
  opacity: 0.3;
}
```

We add opacity but not all the way to 0 to enable a bit smoother effect later.

And, we update our `transform` property to include `rotateX(-90deg)`, which will rotate the menu in 3D space to 90 degrees "backwards". This effectively removes the height and will make for an interesting transition on reveal. Also you'll notice the `transform-origin` property which we add to update the point around which the transform is applied, versus the default of the horizontal and vertical center.

Additionally, to meet [success criteria 1.3.2](https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html), the links should be hidden from screen reader users until they are visually displayed. We ensure this behavior by including `visibility: hidden` (thanks again to Michael for this tip!).

Before we do the reveal, we need to add a `transition` property. We add it to the main `.dropdown__menu` rule so that it applies both on and off focus/hover, aka "forwards" and "backwards".

```scss
.dropdown__menu {
  // ... existing styles
  transition: 280ms all ease-out;
}
```

## Revealing the dropdown

With all that prior setup, revealing the dropdown on both hover and focus can be accomplished as succinctly as:

```scss
.dropdown {
  // ... existing styles

  &:hover,
  &:focus-within {
    .dropdown__menu {
      opacity: 1;
      transform: rotateX(0) translateX(-50%);
      visibility: visible;
    }
  }
}
```

First, we reverse the `visibilty` (or the other properties would not work), and then we've reversed the `rotateX` by resetting to 0, and then bring the `opacity` all the way up to `1` for full visibility.

Here's the result:

![demo of reveal on focus and hover](https://dev-to-uploads.s3.amazonaws.com/i/5z5zaa54czp54u7jleca.gif)

The `rotateX` property allows the appearance of the menu swinging in from the back, and `opacity` just makes it a little softer transition overall.

> Once again a note that for full accessibility, there is a need for Javascript to fully handle for keyboard assistive tech events that do not always trigger `:focus`. This means some sighted keyboard users may discover the dropdown links, but without a `:focus` event emitted, they will not see the dropdown menu actually open. Review the [w3c demo](https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation.html) for how to finish incorporating Javascript in this solution.

## Handling Hover Intent

If you've been at this web thing for a while, I'm hoping the following will make you go 🤯

When I first began battling dropdown menus I was creating them primarily for IE7. On a big project, several team members asked something along the lines of "can you stop the menu appearing if I'm just scrolling/mousing over the menu?". The solution I finally found after much Googling (including trying to come up with the right phrase to get what I was after) was the [hoverIntent jQuery plugin](https://briancherne.github.io/jquery-hoverIntent/).

I needed to set that up because since we are using the `transition` property, we can also add a very slight delay. For general purposes, this will prevent the dropdown animation triggering for "drive-by" mouseovers.

Order matters when we're defining all transition properties in one line, and the second numerical value in order will be picked up as the delay value:

```css
.dropdown__menu {
  // ... existing styles
  transition: 280ms all 120ms ease-out;
}
```

Check out the results:

![demo of transition delay with mouseover](https://dev-to-uploads.s3.amazonaws.com/i/mmts717vg1uxyt8mivgq.gif)

It takes a pretty leisurely rollover to trigger the menu, which we can loosely infer as intent to open the menu. The delay is still short enough to not be consciously noticed prior to opening the menu, so it's a win!

You may still choose to use Javascript to enhance this particularly if it's going to launch a "mega menu" that would be more disruptive, but this is still pretty delightful.

## Dropdown Menu Indicator

Hover intent is one thing, but really we need an additional cue to the user that this menu has additional options. An extremely common convention is a "caret" or "down arrow" mimicking the indicator of a native select element.

To add this, we will update the `.dropdown__title` styles. We'll define it as an `inline-flex` container and then create an `:after` element that uses the border trick to create a downward arrow. We use a dash of `translateY()` to optically align it with our text:

```scss
.dropdown {
  // ... existing styles

  .dropdown__title {
    display: inline-flex;
    align-items: center;

    &:after {
      content: "";
      border: 0.35rem solid transparent;
      border-top-color: rgba(blue, 0.45);
      margin-left: 0.25em;
      transform: translateY(0.15em);
    }
  }
}
```

![dropdown caret indicator](https://dev-to-uploads.s3.amazonaws.com/i/t6fj8oode9wkn736dyq7.png)

### Closing the menu on mobile

Here's another place where ultimately you may have to enhance with Javascript.

To keep it CSS-only, and acceptable for non-application websites, you need to apply `tabindex="-1"` on the body, effectively allowing any clicks outside of the menu to remove focus from it and allowing it to close.

This is a bit of a stretch - and it may be a little frustrating to users - so you may want to enhance this to hide on scroll as well with Javascript especially if you define the `nav` to use `position: sticky` and scroll with the user.

## Final Result

Here's the final result with a bit of extra styling including an arrow to more visually connect the menu to the link item, custom focus states on all the nav links, and `position: sticky` on the `nav`:

{% codepen "MWaJePa" %}
