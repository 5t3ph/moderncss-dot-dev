---
title: "The 3 CSS Methods for Adding Element Borders"
topics: Design,Layout
episode: 23
description: "In CSS, sometimes a `border` is not really a `border`. In this episode, we'll cover the differences between `border`, `outline`, and `box-shadow` and when to choose each."
templateEngineOverride: njk, md
date: 2020-12-11
---

When it comes to CSS, sometimes a `border` is not really a `border`.

In this episode, we'll cover the differences between:

- `border`
- `outline`
- `box-shadow`

We'll also discuss when you might use one over the other.

{% carbonAd %}

## Refresher on the CSS Box Model

A key difference between our three border methods is _where_ they are placed on an element and _how_ they affect its dimensions. This behavior is controlled by the CSS box model.

![An illustration of the CSS box model, with the relevant parts described following this image](https://dev-to-uploads.s3.amazonaws.com/i/4f0uy1wh7h3brj8361h4.png)

- the `border` is precisely the boundary of the element, sitting between its padding and margin, and it's width will impact the computed element dimensions
- the `outline` is next to but outside of the `border`, overlapping both `box-shadow` and `margin`, but not affecting the element's dimensions
- by default, `box-shadow` extends out from edge of the border covering the amount of space in the direction(s) defined, and it will also not affect the element's dimensions

## `border` Syntax and Usage

Borders have been a standard in design since the beginning of the web.

An important difference compared to the other two methods we're going to cover is that _by default_ borders are included in the computed dimensions of an element. Even if you set `box-sizing: border-box` the borders still figure into the calculation.

The most essential syntax for a border defines it's width and style:

```css
border: 3px solid;
```

If not defined, the default color will be `currentColor` which means it will use the nearest definition for `color` in the cascade.

But there are more styles available for border, and using `border-style` you can define a different style for each side if you'd like.

> Visit [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) to review all available `border-style` values and see examples.

### When to Use `border`

Border is a solid choice (pun intended) for when it's acceptable for the style to be computed in the element's dimensions. And the default styles give a lot of design flexibility.

> Keep reading for a **bonus tip** about something only `border` can do!

## `outline` Syntax and Usage

For outlines, the only required property to make it visible is to provide a style since the default is `none`:

```css
outline: solid;
```

Like border, it will gain color via `currentColor` and it's default width will be `medium`.

The typical application of `outline` is by native browser styles on `:focus` of interactive elements like links and buttons.

This particular application should _be allowed to occur_ for purposes of accessibility unless you are able to provide a custom `:focus` style that meets the [WCAG Success Criterion 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html).

For design purposes, an often noted issue with `outline` is that it is unable to inherit the curve from any `border-radius` styles.

### When to Use `outline`

Use of `outline` may be desirable when you don't want to impact the element's dimensions, and you don't need it to follow a `border-radius.` It happens to use [the same style values as border](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style) so you can achieve a similar look.

## `box-shadow` Syntax and Usage

The minimal required properties for `box shadow` are values for the `x` and `y` axis and a color:

```css
box-shadow: 5px 8px black;
```

Optionally, add a third unit to create `blur`, and a fourth to add `spread`.

> Check out [my 4.5 minute video demo on egghead](https://5t3ph.dev/box-shadow) to learn more about the expanded syntax as well as tips on using `box-shadow`.

To use it to create a border, we set the `x` and `y` axis values as well as the `blur` to `0`. Then set a positive number for `spread`:

```css
box-shadow: 0 0 0 3px blue;
```

This will create the appearance of a border around the element _and_ it can even follow an applied `border-radius`:

![an element using box-shadow in place of a border for the effect of a rounded blue border](https://dev-to-uploads.s3.amazonaws.com/i/fcym33w4yzwxjqwpqu0v.png)

### When to Use `box-shadow`

You may prefer `box-shadow` particularly when you want to animate a border without causing layout shift. The next section will demonstrate an example of this context.

And since `box-shadow` can be layered, it's an all-around good tool to get to know to enhance your layouts.

However, it will not be able to fully mimic some of the styles provided by `border` and `outline`.

{% newsletterPromo %}

## Putting It All Together

Here are a few practical scenarios where you may need to use a `border` alternative.

### Button Borders

A common case of the real `border` becoming an issue is when providing styles for both bordered and non-bordered buttons, and the scenario of them lining up next to each other.

![a button using a border which appears visually larger than the second button with a background but no border](https://dev-to-uploads.s3.amazonaws.com/i/0bttmgk48k3vb3dygjr6.png)

A typical solution is usually increasing the non-bordered button dimensions equal to the `border-width`.

An alternate solution with our new knowledge is to use `box-shadow` along with the `inset` keyword to place the pseudo border visually _inside_ the button:

![updated styles using box-shadow on the first button resulting in the buttons appearing equal size](https://dev-to-uploads.s3.amazonaws.com/i/r1phaj5fbfqute0b5gri.png)

_Note that your padding will have to be larger than the `border-width` to prevent overlap of the text content_.

Alternatively, perhaps you want to _add_ a border on `:hover` or `:focus`. Using the real `border`, you will have an undesirable visual jump from layout shift since the `border` will briefly increase the dimensions in those states.

![demo of a border being added on hover and causing the button to jump in place](https://dev-to-uploads.s3.amazonaws.com/i/v5ayfxarp501kawc5tre.gif)

In this case, we can use `box-shadow` to create the pseudo border so that the true dimensions are not increased - plus we can animate it using `transition`:

![demo of the box-shadow border on hover which no longer causes the button to jump](https://dev-to-uploads.s3.amazonaws.com/i/5x1yluygxigo1uan1p5r.gif)

Here's the reduced code for the above example:

```css
button {
  transition: box-shadow 180ms ease-in;
}

button:hover {
  box-shadow: 0 0 0 3px tomato;
}
```

## Upgrading Your CSS Debugging Method

A classic CSS joke is that to figure out CSS issues particularly for overflow scrolling or positioning is to add:

```css
* {
  border: 1px solid red;
}
```

Which will add a red border to every element.

But as we've learned, this will also affect their computed dimensions, thus _potentially_ accidentally causing you additional issues.

Instead, use:

```css
* {
  outline: 1px solid red;
}
```

> _Pop quiz_: where will the `outline` be placed, and why is this a better solution?

One potential consequence of using `border` is _adding_ scrollbars once content is re-drawn. This side-effect will not happen when using `outline`.

Additionally, you're likely to be using `border` for elements already, so universally changing the `border` will cause layout shifts which is certainly likely to introduce new problems.

> _Side note_: Browser DevTools also have evolved more sophisticated methods of helping you identify elements, with [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Debug_Scrollable_Overflow) even adding both a "scroll" and "overflow" tag that is helpful in the case of debugging for overflow. I encourage you to spend some time learning more about DevTool features!

## Ensuring Visible Focus

For accessibility, one scenario you may not be aware of is users of Windows High Contrast Mode (WHCM).

In this mode, your provided colors are stripped away to a reduced high contrast palette. Not all CSS properties are allowed, including `box-shadow`.

One practical impact is that if you have removed `outline` upon `:focus` and replaced it with `box-shadow`, users of WHCM will no longer be given visible focus.

To remove this negative impact, you can apply a `transparent` outline on `:focus`:

```css
button:focus {
  outline: 2px solid transparent;
}
```

> For a bit more context on this specific issue, review [the episode on button styling](https://moderncss.dev/css-button-styling-guide/#focus).

## Pitfalls of `outline` and `box-shadow`

Because `outline` and `box-shadow` sit _outside_ of the border in the box model, one consequence you may encounter is having them disappear under the edges of the viewport. So, you may need to add `margin` to the element or `padding` to the `body` as a countermeasure if you want it to remain visible.

Their placement also means they can be sheared off by properties such as `overflow: hidden` or the use of `clip-path`.

## Bonus Tip: Gradient Borders

As promised, here's a bonus tip about something that - of the methods we've discussed - only `border` can do.

An often forgotten border-related property is `border-image`. [The syntax can be a bit strange](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image) when trying to use it with actual images.

But it has a hidden power - it also allows you to create gradient borders since CSS gradients are technically images:

![preview of an element that has a pastel rainbow gradient applied with the text "Hello World"](https://dev-to-uploads.s3.amazonaws.com/i/jczxtsix50q9exeprh33.png)

This requires defining a regular border width and style (although it will only display as `solid` regardless of style value), followed by the `border-image` property that can use the gradient syntax with one addition. The number after the gradient is the `slice` value which for our gradient we can simply use a value of `1` to essentially not alter the sizing/distortion of the gradient.

```css
div {
  border: 10px solid;
  /* simplified from preview image */
  border-image: linear-gradient(to right, purple, pink) 1;
}
```

To place the border on only one side, be sure to set the other sides to zero first or some browsers will still add it to all sides:

```css
div {
  border-style: solid;
  border-width: 0;
  border-left-width: 3px;
  /* border-image */
}
```

The downside is that these borders do _not_ respect `border-radius`, so if you need a solution that does, you can use Inspector to peek at how the gradients are added for the cards on the [ModernCSS](https://moderncss.dev) home page 😉
