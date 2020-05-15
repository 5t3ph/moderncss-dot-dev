---
title: "The Complete Guide to Centering in CSS"
description: "Description"
permalink: "/complete-guide-to-centering-in-css/"
stylesheet: "centering"
layout: demo.njk
---

<p class="tdbc-h3 tdbc-text-align-center tdbc-ink--primary">Get ready to learn how to approach the age old question faced by many a CSS practitioner:<br/> "How do I center a div?"</p>

## Use Cases Covered

1. [Vertically and Horizontally](#vertically-and-horizontally)
1. [Vertically](#vertically)
1. [Horizontally](#horizontally)

## Vertically and Horizontally

### Grid Solution

The _most modern_ and _easiest_ way is with the following **two lines** of CSS:

```css
display: grid;
place-content: center;
```

<div class="demo gridvh gridpc">
<div>I am centered!</div>
</div>

<div class="demo gridvh gridpc">
<div>We are centered!</div>
<div>We are centered!</div>
</div>

#### Gotchas

**Collapse of child grid** using `auto-fit` or `auto-fill`

Given a child grid that uses the following styles:

```css
grid-template-columns: repeat([auto-fit or auto-fill], minmax(10ch, 1fr));
```

The child grid will collapse in on itself due to the `justify-content` set in the `place-content` shorthand.

<div class="demo gridvh gridpc">
<ul class="gridafc">
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
</div>

The fix is two-fold: switch the grid centering technique to use `place-items` instead of `place-content`, and then to specifically define that the child grid should be:

```css
width: 100%;
```

Or whatever you'd prefer as a width value to create space for the grid columns.

<div class="demo gridvh gridpi">
<ul class="gridafc gridafc--fw">
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
</div>

### Flexbox Solution

Alternatively, you can use the very slightly more verbose Flexbox version:

```css
display: flex;
justify-content: center;
align-items: center;
```

<div class="demo flexvh">
<div>I am centered!</div>
</div>

#### Gotchas

Flexbox has a slightly different behavior when a second item is added since flex items default to placement along the x-axis:

<div class="demo flexvh">
<div>We are centered!</div>
<div>...Sort of!</div>
</div>

One way to resolve this is by adding:

```css
flex-direction: column;
```

<div class="demo flexvh flexcolumn">
<div>We are centered!</div>
<div>Hooray!</div>
</div>

Alternatively, wrap the children in a single element, especially if you don't want them to be affected by the outer flexbox alignment.

If a child element uses grid with `auto-fit` or `auto-fill` it will encounter the same issue as when the parent container is grid as described previously.
