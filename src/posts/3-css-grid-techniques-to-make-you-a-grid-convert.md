---
title: "3 CSS Grid Techniques to Make You a Grid Convert"
topics: Custom Properties,Grid,Layout,Responsive Design
episode: 15
description: "Learn three powerful techniques for using grid that don't involve counting columns, including changing the default axis, centering, and responsive layout without media queries."
templateEngineOverride: njk, md
date: 2020-06-27
---

CSS grid layout can feel daunting. In fact, I avoided it for several years and was a _diehard_ flexbox fan.

Then I found the following 3 powerful properties/techniques in grid that completely changed my tune.

Spoiler, here's a tweet with all of them. Keep reading to learn a bit more!

{% twitter "1276898582113681409" %}

{% carbonAd %}

## 1: Switch the Grid Flow Axis

I first desired this behavior when I wanted X-axis alignment of variable width items, and also desired to leverage `grid-gap`.

### The Code

```css
grid-auto-flow: column;
```

### What it does

Default grid flow is oriented to "row" layout, which is complementary to block layout, where items flow down the page along the Y-axis.

This switches that default behavior to "column" which means items default to flowing along the X-axis.

### Things to note

- items will take as much room as needed to contain their content _up until_ the max width of the container, at which point text will break to new lines
- there is a risk of overflow because of lack of "wrapping" behavior in grid, which means assigning this property will flow things along the X-axis into infinity
  - this can be solved by only applying this behavior above a certain viewport width via a media query

> **Note**: once flexbox `gap` is fully supported, it will likely be the better method for this outcome due to also having wrapping behavior

### When to use

For short content where variable widths are desirable, such as a navbar or list of icons, and when wrapping either isn't a concern or a media query can be used to flip this property.

## 2. XY Center Anything

Literally the thing everyone makes fun of when CSS comes up as a topic:

> "How do you center a div?"

Grid has the easiest answer!

> Psst - interested in _lots_ of solutions to centering? Check out the "[The Complete Guide to Centering in CSS](https://moderncss.dev/complete-guide-to-centering-in-css/)"

### The code

```css
place-content: center;
```

### What it does

Centers any child content both vertically (Y) and horizontally (X) 🙌

### Things to note

- there are some [gotchas](https://moderncss.dev/complete-guide-to-centering-in-css/#xy-grid-solution) related to the behavior assigned to the children
- the visual appearance may be only that it's centered horizontally if the container's height doesn't exceed the height of the children

### When to use

Anytime you want to center something vertically and horizontally.

## 3. Intrinsically Responsive Grid Columns

### The code

```scss
:root {
  --grid-col-breakpoint: 15rem;
}

.grid-columns {
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-col-breakpoint), 1fr));
}
```

### What it does

The unique-to-grid functions of `repeat()` and `minmax()` along with the `auto-fit` keyword work together to create an outcome where immediate children become equal-width, responsive columns.

As the grid container resizes, upon hitting the supplied value for `--grid-col-breakpoint`, the columns begin to drop to a new virtual row.

Use of the `--grid-col-breakpoint` CSS variables allows altering this "breakpoint" via inline style to accommodate various content within a layout or across components with only a single class.

### Things to note

- columns will always be equal width, growing and shrinking to remain equal as the container also flexes in size
- it's possible for orphan columns to exist at certain container widths

> Check out a more comprehensive explanation of what's happening in "[Solutions to Replace the 12-Column Grid](https://moderncss.dev/solutions-to-replace-the-12-column-grid/#grid)"

### When to use

If you're in need of an intrinsically responsive grid with equal-width columns.

This behavior is also one of two viable "container query" methods that we currently have available since it responds to container width instead of being controlled by media queries.

> Learn more about the idea of using [grid for container queries](https://moderncss.dev/container-query-solutions-with-css-grid-and-flexbox/#grid-solution) >

{% newsletterPromo %}

## Demo

This CodePen demonstrates all 3 techniques:

{% codepen "gOPxxNO" %}

> Check out my [egghead lessons](https://5t3ph.dev/egghead) which further explore these grid techniques
