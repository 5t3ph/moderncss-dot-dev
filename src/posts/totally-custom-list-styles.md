---
title: "Totally Custom List Styles"
topics: Custom Properties,Design,Pseudo Elements,Responsive Design,Selectors
episode: 5
description: "This tutorial will show how to use CSS grid layout for easy custom list styling. We'll cover CSS counters, CSS custom properties, and responsive multi-column lists, as well as the new `::marker` pseudo selector."
templateEngineOverride: njk, md
date: 2020-04-18
---

This tutorial will show how to use CSS grid layout for easy custom list styling in addition to:

- Data attributes as the content of pseudo elements
- CSS counters for styling ordered lists
- CSS custom variables for per-list item styling
- Responsive multi-column lists

> **Update**: The `::marker` pseudo selector is now well supported in modern browsers. While this tutorial includes handy CSS tips for the items listed above, you may want to [jump to the `::marker` solution](#upgrading-to-css-marker)

{% carbonAd %}

## List HTML

First we'll setup our HTML, with one `ul` and one `li`. I've included a longer bullet to assist in checking alignment, spacing, and line-heihgt.

```html
<ul role="list">
  <li>Unordered list item</li>
  <li>Cake ice cream sweet sesame snaps dragée cupcake wafer cookie</li>
  <li>Unordered list item</li>
</ul>

<ol role="list">
  <li>Ordered list item</li>
  <li>Cake ice cream sweet sesame snaps dragée cupcake wafer cookie</li>
  <li>Ordered list item</li>
</ol>
```

Note the use of `role="list"`. At first, it may seem extra, but we are going to remove the inherent list style with CSS. While CSS doesn't often affect the semantic value of elements, `list-style: none` can remove list semantics for some screen readers. The easiest fix is to define the `role` attribute to reinstate those semantics. You can learn more from [this article](https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html) from Scott O'Hara.

## Base List CSS

First we add a reset of list styles in addition to defining them as a grid with a gap.

```css
ol,
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-gap: 1rem;
}
```

The `grid-gap` benefit is adding space between `li`, taking the place of an older method such as `li + li { margin-top: ... }`.

Next, we'll prepare the list items:

```css
li {
  display: grid;
  grid-template-columns: 0 1fr;
  grid-gap: 1.75em;
  align-items: start;
  font-size: 1.5rem;
  line-height: 1.25;
}
```

We've also set list items up to use grid. And we've upgraded an older "hack" of using `padding-left` to leave space for an absolute positioned pseduo element with a combo of a `0` width first column and `grid-gap`. We'll see how that works in a moment. Then we use `align-items: start` instead of the default of `stretch`, and apply some type styling.

## UL: Data attributes for emoji bullets

Now, this may not exactly be a scalable solution, but for fun we're going to add a custom data attribute that will define an emoji to use as the bullet for each list item.

First, let's update the `ul` HTML:

```html
<ul role="list">
  <li data-icon="🦄">Unordered list item</li>
  <li data-icon="🌈">Cake ice cream sweet sesame snaps dragée cupcake wafer cookie</li>
  <li data-icon="😎">Unordered list item</li>
</ul>
```

And to apply the emojis as bullets, we use a pretty magical technique where data attributes can be used as the value of the `content` property for pseudo elements:

```css
ul li::before {
  content: attr(data-icon);
  /* Make slightly larger than the li font-size
  but smaller than the li grid-gap */
  font-size: 1.25em;
}
```

Here's the result, with the `::before` element inspected to help illustrate how the grid is working:

![ul styled list elements](https://dev-to-uploads.s3.amazonaws.com/i/lr1hu2lcffytfcb9d0vk.png)

The emoji still is allowed to take up width to be visible, but effectively sits in the grid-gap. You can experiment with setting the first `li` grid column to `auto` which will cause grid-gap to fully be applied between the emoji column and the list text column.

## OL: CSS counters and CSS custom variables

[CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters) have been a viable solution [since IE8](https://caniuse.com/#search=counter), but we're going to add an extra flourish of using [CSS custom variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to change the background color of each number as well.

We'll apply the CSS counter styles first, naming our counter `orderedlist`:

```css
ol {
  counter-reset: orderedlist;
}

ol li::before {
  counter-increment: orderedlist;
  content: counter(orderedlist);
}
```

This achieves the following, which doesn't look much different than the default `ol` styling:

![ol with counter](https://dev-to-uploads.s3.amazonaws.com/i/wb46m4n76s7p4tomridj.png)

Next, we can apply some base styling to the counter numbers:

```css
/* Add to li::before rule */
font-family: "Indie Flower";
font-size: 1.25em;
line-height: 0.75;
width: 1.5rem;
padding-top: 0.25rem;
text-align: center;
color: #fff;
background-color: purple;
border-radius: 0.25em;
```

First, we apply a Google font and bump up the `font-size`. The `line-height` is half of the applied `line-height` of the `li` (at least that's what worked for this font, it may be a bit of a magic number). It aligns the number where we would like in relation to the main `li` text content.

{% newsletterPromo %}

Then, we need to specify an explicit width. If not, the background will not appear even though the text will.

Padding is added to fix the alignment of the text against the background.

Now we have this:

![ol with additional styles](https://dev-to-uploads.s3.amazonaws.com/i/kcz28nyz3ly8fuvg57n9.png)

That's certainly feeling more custom, but we'll push it a bit more by swapping the `background-color` to a CSS custom variable, like so:

```css
ol {
  --li-bg: purple;
}

ol li::before {
  background-color: var(--li-bg);
}
```

It will appear the same until we add inline styles to the second and third `li` to update the variable value:

```html
<ol role="list">
  <li>Ordered list item</li>
  <li style="--li-bg: darkcyan">Cake ice cream sweet sesame snaps dragée cupcake wafer cookie</li>
  <li style="--li-bg: navy">Ordered list item</li>
</ol>
```

And here's the final `ul` and `ol` all put together:

{% codepen "WNQwEjz" %}

## Upgrade your algos: Multi-column lists

Our example only had 3 short list items, but don't forget we applied grid to the base `ol` and `ul`.

Whereas in a previous life I have done fun things with modulus in PHP to split up lists and apply extra classes to achieve evenly divided multi-column lists.

With CSS grid, you can now apply it in three lines with inherent responsiveness, equal columns, and respect to content line length:

```css
ol,
ul {
  display: grid;
  /* adjust the `min` value to your context */
  grid-template-columns: repeat(auto-fill, minmax(22ch, 1fr));
  grid-gap: 1rem;
}
```

Applying to our existing example (be sure to remove the `max-width` on the `li` first) yields:

![multi-column lists](https://dev-to-uploads.s3.amazonaws.com/i/z9ty6z0n1fe1gu78tbis.png)

You can toggle this view by updating the `$multicolumn` variable in Codepen to `true`.

## Gotcha: More than plain text as `li` content

If you have more than plain text inside the `li` - including something like an innocent `<a>` - our grid template will break.

However, it's a very easy solve - wrap the `li` content in a `span`. Our grid template doesn't care what the elements are, but it does only expect two elements, where the pseudo element counts as the first.

## Upgrading to CSS Marker

During the months after this article was originally posted, support for `::marker` became much better across all modern browsers.

The `::marker` pseudo selector allows directly changing and styling the `ol` or `ul` list bullet/numerical.

We can fully replace the solution for `ul` bullets using `::marker` but we have to downgrade our `ol` solution because there are only a few properties allowed for `::marker`:

- `animation-*`
- `color`
- `content`
- `direction`
- `font-*`
- `transition-*`
- `unicode-bidi`
- `white-space`

### Unordered List Style With `::marker`

Since `content` is still an allowed property, we can keep our `data-icon` solution for allowing custom emoji markers 🎉

We just need to swap `::before` to `::marker`:

```css
ul li::marker {
  content: attr(data-icon);
  font-size: 1.25em;
}
```

Then remove the no longer needed grid properties from the `li` and add back in some `padding` to replace the removed `grid-gap`:

```css
li {
  /* replace the grid properties with: */
  padding-left: 0.5em;
}
```

Finally, we previously removed `margin` but we need to add back in some left margin to ensure space for the `::marker` to prevent it being cut off due to overflow:

```css
/* update in existing rule */
ol,
ul {
  margin: 0 0 0 2em;
  /* ...existing styles */
}
```

And the visual results is identical to our previous solution, as you can see in [the demo](#::marker-demo).

### Ordered List Style With `::marker`

For our ordered list, we can now switch and take advantage of the built-in counter.

We also have to drop our `background-color` and `border-radius` so we'll swap to using our custom property for the `color` value. And we'll change our custom property name to `--marker-color` for clarity.

So our reduced styles are as follows:

```css
ol {
  --marker-color: purple;
}

li::marker {
  content: counter(list-item);
  font-family: "Indie Flower";
  font-size: 1.5em;
  color: var(--marker-color);
}
```

_Don't forget to update the CSS custom property name in the HTML, too!_

> **Watch out for this gotcha**: Changing the `display` property for `li` will _remove_ the `::marker` pseudo element. So if you need a different display type for list contents, you'll need to apply it by nesting an additional wrapping element.

## `::marker` Demo

Here's our updated custom list styles that now use `::marker`.

Be sure to check for [current browser support](https://caniuse.com/?search=marker) to decide which custom list style solution to use based on your unique audience! You may want to choose to use `::marker` as a progressive enhancement from one of the previously demonstrated solutions.

{% codepen "KKgqeNB" %}

> For more details on using `::marker`, check out [this excellent article](https://web.dev/css-marker-pseudo-element/) by Adam Argyle.
