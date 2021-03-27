---
title: "The Complete Guide to Centering in CSS"
description: "Learn how to finally solve the mystery of centering in CSS using grid, flexbox, and classic block element layout."
permalink: "/complete-guide-to-centering-in-css/"
stylesheet: "centering"
layout: demo.njk
date: "2020-05-17"
---

<p class="tdbc-h3 tdbc-text-align-center tdbc-ink--primary">Get ready to learn how to approach the age old question faced by many a CSS practitioner:<br/> "How do I center a div?"</p>

## Use Cases Covered

1. [Vertically and Horizontally (XY)](#vertically-and-horizontally-xy)
   - [XY Grid Solution](#xy-grid-solution)
   - [XY Flexbox Solution](#xy-flexbox-solution)
   - [XY Alternative Flexbox Solution](#xy-alternative-flexbox-solution)
   - [XY Centering for Block Elements](#xy-centering-for-block-elements)
1. [Vertical Centering (Y)](#vertical-centering-y)
   - [Y Grid Solution](#y-grid-solution)
   - [Y Flexbox Solution](#y-flexbox-solution)
   - [Y Centering for Block Elements](#y-centering-for-block-elements)
1. [Horizontal Centering (X)](#horizontal-centering-x)
   - [X Grid Solution](#x-grid-solution)
   - [X Flexbox Solution](#x-flexbox-solution)
   - [X Centering for Block Elements](#x-centering-for-block-elements)
   - [X Centering for Dynamically Positioned Elements](#x-centering-for-dynamically-positioned-elements)

<div class="tdbc-card tdbc-card--teaser tdbc-card--ad">
	<div class="tdbc-card__content">
		<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CE7I52QE&placement=moderncssdev" id="_carbonads_js"></script>
	</div>
</div>

## Vertically and Horizontally (XY)

The holy grail: vertical and horizontal centering, aka centering along both the `x-axis` and the `y-axis`.

### XY Grid Solution

The _most modern_ and _easiest_ way is with the following **two lines** of CSS:

```css
display: grid;
place-content: center;
```

<div class="demo grid gridpc">
	<div>I am centered!</div>
</div>

<div class="demo grid gridpc">
	<div>We are centered!</div>
	<div>We are centered!</div>
</div>

#### Gotchas

**Collapse of child grid** using `auto-fit` or `auto-fill`

Given a child grid that uses the following styles:

```css
grid-template-columns: repeat([auto-fit or auto-fill], minmax(10ch, 1fr));
```

The child grid will collapse in on itself, in this case down to the `min` part of `minmax`, due to the `justify-content` set in the `place-content` shorthand.

<div class="demo grid gridpc">
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

<div class="demo grid gridpi">
	<ul class="gridafc gridafc--fw">
		<li>Item 1</li>
		<li>Item 2</li>
		<li>Item 3</li>
	</ul>
</div>

{% newsletterPromo %}

### XY Flexbox Solution

Alternatively, you can use the very slightly more verbose Flexbox version:

```css
display: flex;
align-items: center;
justify-content: center;
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

### XY Alternative Flexbox Solution

`margin: auto` is unique for flexbox, and in the case you have only one child item, you can do the following:

```css
.parent {
  display: flex;
}

.child {
  margin: auto;
}
```

<div class="demo flex">
	<div class="ma">Centered</div>
</div>

The `auto` behavior for flex children, unlike childfren of block elements, can also be applied vertically which allows this solution to work.

### XY Centering for Block Elements

If you are unable to switch to grid or flexbox layout, here's a _modern_ solution to this classic problem.

Ensure the child elements are wrapped in a containing element for the following to work:

```css
.parent {
  position: relative;
}

.child-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

<div class="demo blockvh">
	<div>
		<div>I am centered vertically!</div>
		<div>Me too!</div>
	</div>
</div>

This combo works because when a percentage value is supplied to a `translate` definition, it based the percentage on the computed width (`translateX`) or height (`translateY`). In this example, we use shorthand to apply both `x` and `y` values to `translate()`.

Absolute positioning takes an element out of normal document flow after which we can apply precise values (as needed) to control its positioning in the document, or in this case, relative to the parent with the required `position: relative` on the parent element.

After absolutely positioning the child from the top 50% and left 50%, which is 50% of the parent's height and width, respectively, we then use `translate(-50%, -50%)` to pull the child back up 50% of its own height and back left 50% of its own width. This results in a centered appearance that scales with the content.

#### Gotchas

Because we've used absolute posoitioning, there's a chance the content will grow to overflow the parent, even if like in the demo the parent has a `min-width` which typically grows with the content _except_ for absolute children.

The fix for this is: use grid or flexbox :) Or prepare to create #allthemediaqueries.

## Vertical Centering (Y)

Solutions for centering vertically, aka on the `y-axis`.

### Y Grid Solution

We only need one property to vertically align in grid:

```css
align-content: center;
```

<div class="demo grid gridv">
	<div>I am centered vertically!</div>
	<div>Me too!</div>
</div>

Use of `align-content` is scalable for multiple child elements.

It also works if we switch the default grid axis to `x` with:

```css
grid-auto-flow: column;
```

<div class="demo grid gridv gridx">
	<div>I am centered vertically!</div>
	<div>Me too!</div>
</div>

### Y Flexbox Solution

Flexbox items can be vertically aligned with:

```css
align-items: center;
```

<div class="demo flex flexv">
	<div>I am centered vertically!</div>
	<div>Me too!</div>
</div>

#### Gotchas

If you switch the default axis by adding `flex-direction: column` this solution fails.

<div class="demo flex flexv flexcolumn">
	<div>Now I am centered... horizontally?</div>
	<div>Hmm, me too...</div>
</div>

A huge cuplprit of issues when dealing with flexbox is missing that flipping the default axis flips the associated properties.

For `column`, or `y-axis` flex layout, instead of `align-items` we now need to use:

```css
justify-content: center;
```

<div class="demo flex flexvy flexcolumn">
	<div>I am centered vertically!</div>
	<div>Me too!</div>
</div>

### Y Centering for Block Elements

If possible, switch the layout model and use flex or grid.

Otherwise, much like the [XY solution](#xy-centering-for-block-elements), we'll use absolute positioning and transform, but only apply to `translateY` to move the child 50% of its height.

```css
.parent {
  position: relative;
}

.child-wrapper {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

<div class="demo blocky">
	<div>
		<div>I am centered vertically!</div>
		<div>Me too!</div>
	</div>
</div>

See [XY Centering for Block Elements](#xy-centering-for-block-elements) to learn why this works.

## Horizontal Centering (X)

Solutions for centering horizontally, aka on the `x-axis`.

### X Grid Solution

The `justify-` properties are for `x-axis` alignment:

```css
justify-content: center;
```

<div class="demo grid gridh">
	<div>I am centered horizontally!</div>
	<div>Me too!</div>
</div>

Again, this holds up if we switch the default axis with:

```css
grid-auto-flow: column;
```

<div class="demo grid gridx gridh">
	<div>I am centered horizontally!</div>
	<div>Me too!</div>
</div>

### X Flexbox Solution

To center along the `x-axis`, which is the default flexbox axis for child item alignment, use:

```css
justify-content: center;
```

<div class="demo flex flexh">
	<div>I am centered horizontally!</div>
	<div>Me too!</div>
</div>

#### Gotchas

At this point, you know what's coming - this will fail for `flex-direction: column`.

We'll fix it by using the following instead of `justify-content`:

```css
align-items: center;
```

<div class="demo flex flexhy flexcolumn">
	<div>I am centered horizontally!</div>
	<div>Me too!</div>
</div>

### X Centering for Block Elements

This is the classic solution, although it must be placed on each element you wish to center individually.

```css
margin-left: auto;
margin-right: auto;
```

For the demo, I've also set a `max-width` since by default block elements take up the full-width of their container, which visually opposes the centering.

<div class="demo">
	<div class="tdbc-mx-auto max">I am centered horizontally!</div>
	<div class="tdbc-mx-auto max">Me too!</div>
</div>

### X Centering for Dynamically Positioned Elements

The use case here is for components like [dropdown menus](/css-only-accessible-dropdown-navigation-menu/) or tooltips when there is a requirement for centering of items of dynamic/unknown width relative to the associated trigger.

We'll use a method similar to [Y Centering for Block Elements](#y-centering-for-block-elements), but using `left` and `translateX` properties:

```css
.parent {
  position: relative;
}

.child-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

<div class="demo blockh">
	<div>
		<div>I am centered vertically!</div>
		<div>Me too!</div>
	</div>
</div>
