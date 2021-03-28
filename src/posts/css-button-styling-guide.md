---
title: "CSS Button Styling Guide"
topics: Accessibility,Buttons,Design,Flexbox
episode: 9
description: "This guide will explore the ins and outs of styling an accessible, extensible button appearance for both link and button elements."
templateEngineOverride: njk, md
date: 2020-05-07
---

This guide will explore the ins and outs of styling an accessible, extensible button appearance for both link and button elements.

Topics covered include:

- reset styles for `a` and `button`
- display, visual, size, and text styles
- accessible styling considerations
- extended styles for common scenarios

{% carbonAd %}

Oh, the button (or is it a link?). I've battled the button since the days of hover delay from waiting for a second image to load, through image sprites, and then was immensely relieved when `border-radius`, `box-shadow` and gradients arrived on the scene.

But... we took button styling too far, and somewhere along the way completely lost sight of what it really means to be a button, let alone an accessible button (or link).

> **STOP!** Go read this excellent article: [Links vs. Buttons in Modern Web Applications](https://marcysutton.com/links-vs-buttons-in-modern-web-applications) to understand when it's appropriate to use `a` versus `button`

We'll look at what properties are required to visually create a button appearance for both `a` and `button`, and additional details required to ensure they are created and used accessibly.

---

## Reset Default Styles

Here's our baseline - native browser styles as rendered in Chrome, with the only changes so far being the link is inheriting the custom font set on the body, and I've bumped the `font-size` as well:

![default link and button styles](https://dev-to-uploads.s3.amazonaws.com/i/1b5duijnf8zdydz1ue1p.png)

The HTML if you're playing along at home is:

```html
<a href="javascript:;">Button Link</a> <button type="button">Real Button</button>
```

I've used the `javascript:;` string for the `href` value so that we could test states without triggering navigation. Similarly, since this button is not for a form submit, it needs the explicit type of `button` to prevent triggering a get request and page reload.

### Reset Styles

> **Note**: Typically I apply the _Normalize_ reset to CodePens, but for this lesson we are starting from scratch to learn what is required to reset for buttons and links. Use of _Normalize_ or other popular resets do some of these things for you.

First, we'll add the class of `button` to both the link and the button just to emphasize where styles are being applied for this lesson.

```html
<a href="javascript:;" class="button">Button Link</a>
<button type="button" class="button">Real Button</button>
```

#### `box-sizing`

Ensure your styles include the following reset - if you don't want it globally (you should) you can scope it to our button class.

```scss
* {
  box-sizing: border-box;
}
```

In a nutshell, this rule prevent things like borders and padding from expanding the expected element size (ex. a 25% width remains 25%, not 25% + border width + padding).

#### `a`

For the link, we only have one reset to do:

```scss
a.button {
  text-decoration: none;
}
```

This simply removes the underline.

#### `button`

Next, we have a few more rules required to reset the button:

```scss
button.button {
  border: none;
  background-color: transparent;
  font-family: inherit;
  padding: 0;
  cursor: pointer;

  @media screen and (-ms-high-contrast: active) {
    border: 2px solid currentcolor;
  }
}
```

There are some differences in the `display` value as well between browsers, but we're going to change it to a unique option shortly.

With these reset styles, we now have this appearance:

![link and button with reset styles](https://dev-to-uploads.s3.amazonaws.com/i/44rie4nuqfk5jwpkk6ff.png)

_Thanks to [@overflowhidden](https://twitter.com/overflowhidden/status/1260837671762571265) for providing a solution to ensure a perceivable button border for users with Windows High Contrast mode enabled_.

## Display Styles

What I have found to work best across many scenarios is `display: inline-flex` which gives us the content alignment power of flexbox but sits in the DOM within `inline-block` behavior.

```scss
a.button,
button.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

Flex alignment comes in handy should you add icons in the future, or impose width restrictions.

## Visual Styles

Next we'll apply some standard visual styles which you can certainly adjust to your taste. This is the most flexible group of styles and you can leave out `box-shadow` and/or `border-radius`.

```scss
$btnColor: #3e68ff;

a.button,
button.button {
  // ... existing styles
  background-color: $btnColor;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.18);
}
```

Now our link and button are starting to look more alike:

![link and button with visual styles](https://dev-to-uploads.s3.amazonaws.com/i/ctowxoi9kaub1bm96bz8.png)

### Button Contrast

There are two levels of contrast involved when creating initial button styles:

1. At least 3:1 between the button background color, and the background it is displayed against
2. At least 4.5:1 (for text less than 18.66px bold or 24px) or 3:1 (for text greater than those measures) between the button text and the button background

Here's an infographic I created to demonstrate how the button colors relate to their contrast relationships:

![An infographic showing a "default" button that is a midrange shade of purple with white letters next to it's "focus" state which is a darker purple. Icons and labels show that the contrast of the default purple to the page background (a light yellow) is 4.17, and contrast of the default purple to the white button text is 4.5. For the focus button, there is a 3.02 contrast between the default purple background and the focus purple background, and 13.62 between focus purple and the white button text, and 12.57 between the focus purple and the page background light yellow.](https://dev-to-uploads.s3.amazonaws.com/i/58an5ksgtys6vhhq1tb4.png)

Assuming a white page background, our button color choice passes with 4.54:1.

> **[Try out ButtonBuddy to create accessible button colors](https://buttonbuddy.dev)**. This web app I created will help get all the vectors of contrast right across your button color palette.

{% newsletterPromo %}

## Size

We intentionally left out one property under the "Visual" categorization that you might have missed upon seeing the progress screenshot: `padding`.

Since `padding` is part of the `box-model`, we left it for the size section.

Let's apply the size values and then discuss:

```scss
a.button,
button.button {
  // ... existing styles
  padding: 0.25em 0.75em;
  min-width: 10ch;
  min-height: 44px;
}
```

We apply `padding` using `em` units, which is a preference that allows the padding to proportionally resize with the applied `font-size`.

Next, we set a `min-width` using the `ch` unit, which is roughly equal to the width of the `0` character of the applied font and `font-size`. This recommendation is a visual rhythm guardrail. Consider the scenario you have two side-by-side buttons with one short and one longer label, ex. "Share" and "Learn More". Without `min-width`, the "Share" button would be abruptly shorter than "Learn More".

The `min-height` is based on ensuring the button is a large enough target on touch devices to meet the WCAG 2.1 success criteria for [2.5.5 - Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html).

The styles are starting to come together, but we're not done yet:

![link and button with size styles](https://dev-to-uploads.s3.amazonaws.com/i/uylx2jbc92mr1bbdksoo.png)

## Text Styles

Based on the last progress screenshot, you might be tempted to skip text styles.

But look what happens when we reduce the viewport size and trigger responsive behavior:

![link and button within reduced viewport](https://dev-to-uploads.s3.amazonaws.com/i/s6rmhllldvvrw5wsgzhy.png)

As you can see, we have different alignment and the `line-height` could be adjusted as well.

I intentionally skipped fixing text alignment in the reset styles, so we'll now make sure it's centered for both. Then we can also reduce the line-height - this may need adjusted depending on the font in use.

```scss
a.button,
button.button {
  // ... existing styles
  text-align: center;
  line-height: 1.1;
}
```

Alright, looking great!

![link and button with text styles](https://dev-to-uploads.s3.amazonaws.com/i/4ub4z1jxoxk3cp8gzg4a.png)

## State Styles

Right now, the only visual feedback a user receives when attempting to interact with the buttons is the cursor changing to the "pointer" variation.

There are three states we need to ensure are present.

### `:hover`

The one that usually gets the most attention is `hover`, so we'll start there.

A typical update on hover is changing the background color. Since we were fairly close to 4.5, we will want to darken the color.

We can take advantage of Sass to compute this color for us using the `$btnColor` variable we defined in the "Visual" section:

```scss
a.button,
button.button {
  // ... existing styles
  &:hover {
    background-color: scale-color($btnColor, $lightness: -20%);
  }
}
```

The effect is a little jarring, but we have another modern CSS tool to soften this, aptly named `transition`. The `transition` property will need to be added outside of the `hover` rule so that it applies both on "over" and "out".

```scss
a.button,
button.button {
  // ... existing styles

  transition: 220ms all ease-in-out;

  // ...&:hover
}
```

![demo of hover transition](https://dev-to-uploads.s3.amazonaws.com/i/0416wpo396xq4tbc5ln2.gif)

### `:focus`

For keyboard users, we need to ensure that the `focus` state is clearly distinguishable.

By default, the browsers apply a sort of "halo" effect to elements that gain focus. A bad practice is simply removing the `outline` property which renders that effect and failing to replace it.

We will replace the outline with a custom focus state that uses `box-shadow`. Like `outline`, `box-shadow` will not change the overall element size so it will not cause layout shifts. And, since we already applied a `transition`, the `box-shadow` will inherit that for use as well for an extra attention-getting effect.

```scss
a.button,
button.button {
  // ... existing styles

  // ...&:hover

  &:focus {
    outline-style: solid;
    outline-color: transparent;
    box-shadow: 0 0 0 4px scale-color($btnColor, $lightness: -40%);
  }
}
```

Once again, we have used the `scale-color` function, this time to go even a bit darker than the `hover` color. This is because a button can be in both the `hover` and `focus` states at the same time.

![demo of link and button focus](https://dev-to-uploads.s3.amazonaws.com/i/03cq806lheglhyn5xf6l.gif)

_Thanks to [@overflowhidden](https://twitter.com/overflowhidden/status/1260837671762571265) for providing a solution to ensure a perceivable `:focus` state for users with Windows High Contrast mode enabled_.

### `:active`

Lastly, particularly for the "real button", it is best to define an `:active` state style.

For links this appears for a brief moment during the "down" of a click/tap.

For buttons, this can be shown for a longer duration given that a button can be triggered with the space key which can be held down indefinitely.

We will append `:active` to our existing `:hover` style:

```scss
&:hover,
&:active {
  background-color: scale-color($btnColor, $lightness: -20%);
}
```

## Style Variations

The topic of outlined ("ghost") buttons is a topic for a different day, but there are two variations that we'll quickly add.

### Small Buttons

Using BEM format, we'll create the `button--small` class to simply reduce font size. Since we set padding to `em`, that will proportionately resize. And our `min-height` will ensure the button remains a large enough touch target.

```scss
&--small {
  font-size: 1.15rem;
}
```

### Block Buttons

There may be times you do want `block` behavior instead of inline, so we'll add `width: 100%` to allow for that option instead of changing the `display` prop since we still want flex alignment on the button contents:

```scss
&--block {
  width: 100%;
}
```

## Gotcha: Child of Flex Columns

Given the scenario the button is a child of a flex column, you may be caught off guard when the button expands to full-width even without the `button--block` class.

To future-proof against this scenario, you can add `align-self: start` to the base button styles, or create utility styles for each of the flex/grid alignment property values: `start`, `center`, and `end`.

## Demo

{% codepen "rNOpgPa" %}
