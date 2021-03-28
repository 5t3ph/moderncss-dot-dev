---
title: "Icon Button CSS Styling Guide"
topics: Accessibility,Buttons,Design,Flexbox
episode: 10
description: "This guide will build on the previous episode 'CSS Button Styling Guide' to explore the use case of icon buttons. We'll cover icon + text as well as icon-only buttons."
templateEngineOverride: njk, md
date: 2020-05-13
---

This guide will build on the previous episode ["CSS Button Styling Guide"](https://moderncss.dev/css-button-styling-guide/) to explore the use case of icon buttons. We'll cover icon + text as well as icon-only buttons.

{% carbonAd %}

> **Note**: With SVG now having excellent support, the preferred practice is to use it for icon systems vs. icon fonts. We will not dive into SVGs specifically, but we will assume SVG icons are in use.

## Icon + Text Button

First, let's do the easier extend from our current buttons, and drop an svg icon next to the text:

```html
<a href="javascript:;" class="button">
  <svg
    class="button__icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"
    ></path>
  </svg>
  Button Link
</a>
```

There are 3 key features about the SVG for the icon + text use case:

1. Use of a new `button__icon` class
2. The `viewBox` value is tight to the icon boundaries, ideally a square for best results across the icon set even if the values have variance (ex. `24` vs. `32`)
3. For accessibility, we apply:

- `aria-hidden="true"` - allows assistive tech to skip the SVG since it's decorative and not providing any semantic value not already provided by the visible button text
- `focusable="false"` - prevents a "double focus" event in some version of IE

> **For more on accessibility of icon buttons**: Read [this excellent article](https://www.sarasoueidan.com/blog/accessible-icon-buttons/) by Sara Soueidan who is an expert on both accessibility and SVGs

### Icon Styling for Icon + Text

Due to `display: inline-flex` applied on the base `.button`, and no `width` attribute on the SVG, by default the icon is not yet visible.

So let's first add dimensions to our new `.button__icon` class, using the `em` unit to keep it relative to the `font-size` in use:

```scss
.button__icon {
  // You may wish to have your icons appear larger
  // or smaller in relation to the text
  width: 0.9em;
  height: 0.9em;
}
```

![button icon with dimensions](https://dev-to-uploads.s3.amazonaws.com/i/00g7uw9dfcb80pq2hikz.png)

According to [the spec default](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill#path), SVG parts including `path` have a `fill` of black. To adjust this, we will use the special keyword `currentColor` which will extend the button's applied text `color` to the SVG:

```scss
.button__icon {
  // ...existing styles
  fill: currentColor;
}
```

![button icon with currentColor as fill](https://dev-to-uploads.s3.amazonaws.com/i/0rs7lk1bmq6hqkcggekq.png)

The last thing to adjust is to add a bit of spacing between the icon and button text, which we will again apply using the `em` unit:

```scss
.button__icon {
  // ...existing styles
  margin-right: 0.5em;
}
```

![button icon with spacing applied](https://dev-to-uploads.s3.amazonaws.com/i/niqz77ol4aaskwjic6dw.png)

We need to add one utility class to allow the icon to be placed after the text, or at the "end" of the button (for right-to-left languages). We zero out the existing margin, and flip it to the left:

```scss
.button__icon {
  // ... existing styles

  &--end {
    margin-right: 0;
    margin-left: 0.5em;
  }
}
```

```html
<a href="javascript:;" class="button">
  Button Link
  <svg
    class="button__icon button__icon--end"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"
    ></path>
  </svg>
</a>
```

![icon placed at the end of the button](https://dev-to-uploads.s3.amazonaws.com/i/xj30apl4rbcnzs1vjs8r.png)

{% newsletterPromo %}

## Icon-Only Buttons

We're going to make the assumption that we want both regular buttons (with or without icons) in addition to icon-only buttons. This is important because we will reuse the `.button` class in addition to a new class so that we don't have to redefine the resets and base visual styles. The overrides are minimal.

```html
<a href="javascript:;" class="button icon-button" aria-label="Icon-only Button">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    class="icon-button__icon"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"
    ></path>
  </svg>
</a>
```

Changes from the icon + text button:

1. Addition of the `icon-button` class to the `a`
2. Addition of `aria-label="Icon-only Button"` to provide an accessible text alternative since we have removed the visual text
3. Swap of the class on the SVG to `icon-button__icon`

> **Important**: the value of the `aria-label` should describe _what the button does_ **not** _what the icon is_. For further reading and other ways to provide a text alternative, see [Sara Soueidan's article](https://www.sarasoueidan.com/blog/accessible-icon-buttons/)

Here's what we get before adjustments - an empty-looking button because we're back to the no-width problem:

![pre-styled icon button](https://dev-to-uploads.s3.amazonaws.com/i/09pnf9xm2pectdy9ug6j.png)

First, let's create our new class. Due to [the "C" in CSS](https://dev.to/5t3ph/intro-to-the-css-cascade-the-c-in-css-1kh0), this rule needs to be placed after the `.button` rule:

```scss
.icon-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  padding: 0.35em;

  &__icon {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}
```

We define a new `width` and `height` which is completely adjustable based on your design requirements, but it should equate to a square. This allows creation of a "circle" appearance when `border-radius: 50%` is applied.

Then, we add a touch of padding (again to your tastes/design requirements) to add some breathing room between the SVG icon and the button boundary.

Next, we define our `icon-button__icon` class. The difference here is that we want the `width` and `height` to match that of the container, so we set this to `100%`. This allows extending to multiple size icon-only buttons by only redefining the `font-size` property on the `.icon-button` class.

Here's the progress:

![icon-only button styles](https://dev-to-uploads.s3.amazonaws.com/i/tdnn9ug4rcpmn45czqb1.png)

It's not quite what we want, but we can fix it by adjusting the following properties within the `.button` class. We'll use the `:not()` selector to exclude the properties meant only for regular buttons:

```scss
.button {
  // ...existing styles

  // Find these styles and update, not duplicate:
  &:not(.icon-button) {
    padding: 0.25em 0.75em;
    min-width: 10ch;
    min-height: 44px;
  }
}
```

Now we have what we're after:

![completed icon-only button](https://dev-to-uploads.s3.amazonaws.com/i/aqknn8adugm9vn63c091.png)

## Demo

Includes use of the `.button--small` class created in the previous episode, as well as a "real button" to validate that styles work just as well for both elements:

{% codepen "ExVpVJa" %}

> **[Try out ButtonBuddy to create accessible button colors](https://buttonbuddy.dev)**. This web app I created will help get all the vectors of contrast right across your button color palette.
