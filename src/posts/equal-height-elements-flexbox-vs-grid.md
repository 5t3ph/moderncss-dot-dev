---
title: "Equal Height Elements: Flexbox vs. Grid"
topics: Grid,Flexbox,Layout
episode: 2
description: "Review solutions using both Flexbox and CSS grid and learn when you might choose one over the other."
templateEngineOverride: njk, md
date: 2020-04-09
---

Once upon a time (approximately 2013), I wrote a jQuery plugin to calculate equal height columns. It ensured that the very specific scenario of a row with three columns would keep the content boxes equal height no matter the length of the content they contained. The dominant layout method at the time - floats - did not handle this problem.

{% carbonAd %}

## Flexbox Solution

When flexbox arrived on the scene, this became possible with:

```css
.flexbox {
  display: flex;
}
```

Amazing! By default, direct children line up in a row and have a "stretch" applied so they are equal height 🙌

But then you add two `.column` divs as children and... the contents of the columns appear unequal again 😔

The fix is:

```css
.flexbox {
  display: flex;

  // Ensure content elements fill up the .column
  .element {
    height: 100%;
  }
}
```

Now the columns will appear equal height and grow with the content of `.element`.

{% newsletterPromo %}

## Grid Solution

With grid, we encounter similar behavior:

```css
.grid {
  display: grid;
  // Essentially switch the default axis
  grid-auto-flow: column;
}
```

Similar to flexbox, direct children will be equal height, but their children need the height definition added just like in the flexbox solution:

```css
.grid {
  display: grid;
  grid-auto-flow: column;

  // Ensure content elements fill up the .column
  .element {
    height: 100%;
  }
}
```

Here's a demo of both solutions, as well as additional demos for defining a set amount of columns per row as described below:

{% codepen "BaoamwO" %}

## Which is Better?

For purely solving for equal height elements, the advantage of flexbox is the default axis immediately enables side-by-side columns, whereas grid needs to be explicitly set. However, elements will not inherently be equal-width as well (which may be an advantage depending on type of content, for example navigation links).

The advantage of grid is inherently equal-width elements if that is desirable. An additional advantage is when you don't want auto-flow but instead want to define a set max number of columns per "row". In this case, grid layout easily handles the math to distribute the columns vs. a flexbox solution requiring defining the calculation to restrict the number of columns.

Updating our `.grid` solution to handle for defining a max number of 3 `.column` per row is as simple as:

```css
&.col-3 {
  grid-gap: $col_gap;
  grid-template-columns: repeat(3, 1fr);
}
```

Whereas one (very basic) option for flexbox would be:

```css
$col_gap: 1rem;

.flexbox.col-3 {
  // Explicitly needs to be defined to wrap
  // overflow items to the next virtual row
  flex-wrap: wrap;

  .column {
    // "hack" for no gap property
    margin: $col_gap/2;
    // define calculation for browser to use on the width
    max-width: calc((100% / 3) - #{$col_gap});
  }
}
```

You would also need to consider how these solutions are handled responsively, but that's a bit out of scope of this article :)
