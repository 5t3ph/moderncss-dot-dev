---
title: "Solutions to Replace the 12-Column Grid"
topics: Flexbox,Grid,Layout,Responsive Design
episode: 8
description: "Create simplified responsive grid systems using both CSS grid and flexbox. Using both, we'll create just two classes to handle from 1-4 columns of content that responsively resizes."
templateEngineOverride: njk, md
date: 2020-05-03
---

Let's create simplified responsive grid systems using both CSS grid and flexbox and ditch the bulk of 12-column grid systems from heavy frameworks.

If you haven't really looked into grid, or rely on frameworks to think about flexbox for you, this will help you level up your understanding 🚀

{% carbonAd %}

Looking across the web, you will often see content laid out in a few select flavors:

- fullwidth of its container
- two equal-width columns
- three equal-width columns
- four equal-width columns

Usually, this is accomplished by a considerable amount of utility classes setting widths across breakpoints.

Between CSS grid and flexbox, and with the aforementioned layouts in mind, we can greatly reduce the setup of responsive grid columns.

For both solutions, we will create just two classes and be able to handle from 1-4 columns of content that responsively resizes equally 🙌

> **Note**: These solutions as-is work best for defining primary page layout containers, but we'll end with some suggestions on filling the gap for other layout alignment needs.

## The Grid Solution

Grid excels at grids, as the name would imply. Here, the terms "column" and "row" are inherent to the way you work with CSS grid, which can make defining your solution more clear.

In particular are the following useful features:

- `grid-gap` - defines equal space between grid items, whether columns or rows
- `repeat()` - quickly define rules for every row or column, or a set number of rows or columns
- `fr` unit - the available "fraction" of space that is left to distribute to that column or row
- `minmax()` - define a minimum and maximum accepted column width or row height

### `.grid-wrap`

First, we create a wrapping class. This is only to apply the equivalent of our `grid-gap` value as padding and is totally optional. You may want this because the `grid-gap` property does not apply the gap spacing to the outside of the grid. Perhaps padding is already applied to your containing element which may be the `body`, or you may actually want your grid columns to touch edge-to-edge of the viewport.

```scss
$gridGap: 2rem;

.grid-wrap {
  padding: $gridGap;
}
```

### `.grid`

This is it - the one class that can quickly turn any element into a grid container where it's immediate children then become equal-width, responsive columns.

Here's the full rule, and then we'll break it down:

```scss
$minColWidth: 15rem;

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax($minColWidth, 1fr));
  grid-gap: 2rem;

  & + .grid {
    margin-top: $gridGap;
  }
}
```

First, we define a minimum width for our content columns. I recommend using `rem` for this value so that it is consistent throughout your experience. If we set it based on `em` it would be altered with any change in base element font-size. [Learn more about working with units >](https://dev.to/5t3ph/guide-to-css-units-for-relational-spacing-1mj5)

Then, the magic comes from how we define `grid-template-columns`.

We use the `repeat` function to say that we want the same parameters applied across all columns that exist.

Then, instead of an absolute number, we use the `auto-fit` value which is responsible for ensuring the columns stay equal-width by stretching columns to fill any available space.

After that, we use `minmax()` to set the minimum allowed column width, and then use `1fr` as the max which ensures the content fills the column as much as room allows.

Then we add our gap, and an optional rule to apply the same value between consecutive `.grid` containers.

Here's the solution altogether:

{% codepen "VwvrZVx" %}

_Note_: You could technically add many more than 4 columns within `.grid`, they will just become more narrow up until the minimum width even on larger viewports.

> Check out my [egghead video lesson](https://egghead.io/lessons/css-create-a-basic-responsive-grid-system-with-css-grid) on how this technique comes together.

### Drawbacks

In the case of a 3-column + grid, while it does respond nicely, you will end up with an "orphan" column on some viewport widths.

You can overcome this with media queries, but they will be brittle.

If it is essential to the design to prevent orphan columns, you may want to opt for the flexbox solution instead.

{% newsletterPromo %}

## Flexbox Solution

Our flexbox solution will mimic grid in that the priority is equal-width columns.

However, there is not yet a fully supported flexbox gap property (one is [on the way](https://twitter.com/argyleink/status/1254794309263491072)!), so we have to do some trickery to accomplish the same effect.

## `.flex-grid-wrap`

Same intention as the grid solution:

```scss
$gridGap: 2rem;

.flex-grid-wrap {
  padding: $gridGap;
}
```

## `.flex-grid`

Inherent flexbox behavior places items in a row where each item grows with content length and as it grows it bumps the next item over.

So, we must add a bit of extra logic to create equal-width behavior.

We define the rule with `display: flex`, and then we add a rule that directs immediate children to use `flex` behavior that evaluates to:

- `flex-grow: 0` - prevents growing beyond an equitably shared amount of space
- `flex-shrink: 1` - directs elements to "shrink" at the same rate
- `flex-basis: 100%` - counteracts the `flex-grow` directive to still expand items to fill available space

```scss
.flex-grid {
  display: flex;

  & > * {
    flex: 0 1 100%;

    &:not(:first-child) {
      margin-left: $gridGap;
    }
  }
}
```

And to make up for no gap rule, we define `margin-left` on all but the first item.

## Handle for small viewports

Great start, but this will never break down for small viewports:

![current flex column behavior on small viewport](https://dev-to-uploads.s3.amazonaws.com/i/v9c82kc506hbcx09qcj9.png)

As noted at the start, since this grid solution is intended to be used for primary page layout containers, we will bring in media queries to insert a breakpoint by allowing for `flex-wrap: wrap`, and switching our margin "gap hack" to a top instead of left margin.

To determine when to add wrapping, the baseline solution multiplies our minimal acceptable width by 3. The logic here is that once 3 columns individual widths are less than our acceptable minimum, we break and toss everything full-width instead. Depending on your acceptable minimum, you may alter this rule.

```scss
.flex-grid {
  // ...existing styles
  @media (max-width: ($minColWidth * 3)) {
    flex-wrap: wrap;

    & > * {
      margin: 2rem 0 0 !important;
    }
  }

  @media (min-width: ($minColWidth * 3)) {
    & + .flex-grid {
      margin-top: $gridGap;
    }
  }
}
```

We also added a `min-width` query so that we have the top margin "gap" on larger viewports. If we had it on small as well, we would end up with double the margin between groups of content, which is possibly a desirable outcome.

Here's the flexbox solution demo:

{% codepen "eYpeNxd" %}

### Drawbacks

Applying this grid to sub-containers within your page may cause undesirable breakpoint issues since it's a manual media query that is looking at the viewport width and not the container width.

**Possible remedy**: Instead of always applying the `max-width` query, you may apply that with a class. That would enable using this base grid idea for sub-containers with less undesirable results.

## Which Is Better?

The solutions proposed are very general but have wide application.

The intent of each is to be applied to direct children of the `body`, or one layer deep such as to a `main` component that limits overall `max-width` of the content spread but still responds downward in sync with the viewport.

### Choose Grid if:

- you want to take advantage of `auto-fit` + `minmax` behavior to automatically bump items to a new row once the minimum acceptable width is hit
- you plan to use in sub-containers since media queries are not required to apply breakpoints (you could extend the idea to apply to components like navbars or card action items by setting a smaller min-width)
- you'd like to _almost_ achieve container queries since items respond according to their content length

### Choose Flexbox if:

- the only place you need "grid" behavior is to layout primary page containers, such as to define rows of cards or create two-column text content
- you want to prevent "orphan" columns

## If You _Really_ Want A 12-Column Grid

Here it is - but you're responsible for placing items on it how you'd like which means more custom CSS rules :)

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2rem;
}
```

Alternatively, create just a handful of targeted classes to more clearly define column expectations. Note that this type of usage means that columns will take up precisely the fraction of space that would equal 1/2, or 1/3, or 1/4. So if you have only one column in the `2cols` grid, it will still only span half the total width, not fill up available space.

```scss
.grid {
  display: grid;
  grid-gap: 2rem;

  &--2cols {
    grid-template-columns: repeat(2, 1fr);
  }

  &--3cols {
    grid-template-columns: repeat(3, 1fr);
  }

  &--4cols {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

> If you're interested in a light-weight starting place for a basic HTML/Sass solution that includes minimal, general application layout containers and utilities, check out my [jumpstart >](https://5t3ph.github.io/html-sass-jumpstart/)
