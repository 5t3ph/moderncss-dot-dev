---
title: "Guide to Advanced CSS Selectors - Part One"
topics: Design,Layout,Selectors
episode: 24
description: "Whether you choose to completely write your own CSS, or use a framework, understanding selectors, the cascade, and specificity are critical to developing CSS and modifying existing style rules."
templateEngineOverride: njk, md
date: 2020-12-28
---

Whether you choose to completely write your own CSS, or use a framework, or be required to build within a design system - understanding selectors, the cascade, and specificity are critical to developing CSS and modifying existing style rules.

You're probably quite familiar with creating CSS selectors based on IDs, classes, and element types. And you've likely often used the humble space character to select descendants.

In this two-part mini-series, we'll explore some of the more advanced CSS selectors, and examples of when to use them.

## Part One (this article):

- [CSS Specificity and the Cascade](#css-specificity-and-the-cascade)
- [Universal selector](#universal-selector) - `*`
- [Attribute selector](#attribute-selector) - `[attribute]`
- [Child combinator](#child-combinator) - `>`
- [General sibling combinator](#general-sibling-combinator) - `~`
- [Adjacent sibling combinator](#adjacent-sibling-combinator) - `+`

### Part Two:

- [Pseudo classes](https://moderncss.dev/guide-to-advanced-css-selectors-part-two/#pseudo-classes) - ex: `:checked / :focus`
- [Pseudo elements](https://moderncss.dev/guide-to-advanced-css-selectors-part-two/#pseudo-elements) - ex: `::before / ::after`
- [Additional resources](https://moderncss.dev/guide-to-advanced-css-selectors-part-two/#additional-resources)

{% carbonAd %}

## CSS Specificity and the Cascade

A key concept to successfully setting up CSS selectors is understanding what is known as CSS specificity, and the "C" in CSS, which is the cascade.

> Specificity is a weight that is applied to a given CSS declaration, determined by the number of each selector type in the matching selector. When multiple declarations have equal specificity, the last declaration found in the CSS is applied to the element. Specificity only applies when the same element is targeted by multiple declarations. As per CSS rules, directly targeted elements will always take precedence over rules which an element inherits from its ancestor. - [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

Proper use of the cascade and selector specificity means you should be able to entirely avoid the use of `!important` in your stylesheets.

Increasing specificity comes with the result of overriding inheritance from the cascade.

As a small example - what color will the `.item` be?

```html
<div id="specific">
  <span class="item">Item</span>
</div>
```

```css
#specific .item {
  color: red;
}

span.item {
  color: green;
}

.item {
  color: blue;
}
```

The `.item` will be _red_ because the specificity of including the `#id` in the selector wins against the cascade and over the element selector.

This doesn't mean to go adding `#ids` to all your elements and selectors, but rather to be aware of their impact on specificity.

> **Key concept**: The higher the specificity, the more difficult to override the rule.

Every project will be unique in its needs in terms of reusability of rules. The desire to share rules with low specificity has lead to the rise of CSS utility-driven frameworks such as Tailwind and Bulma.

On the other hand, the desire to tightly control inheritance and specificity such as within a design system makes naming conventions like BEM popular. In those systems, a parent selector is tightly coupled with child selectors to create reusable components that create their own specificity bubble.

If you're thinking "I don't need to learn these because I use a framework/design system" then you are greatly limiting yourself in terms of using CSS to its fullest extent.

The beauty of the language can be found in constructing elegant selectors that do _just enough_ and enable tidy small stylesheets.

## Universal Selector

The universal selector - `*` - is so named because it applies to all elements universally.

There used to be recommendations against using it, particularly as a descendent, because of performance concerns, but that is no longer a valid consideration. In fact, it hasn't been a concern in over a decade. Instead, worry about your JS bundle size and ensuring your images are optimized rather than finessing CSS selectors for performance reasons 😉

A better reason to only use it sparingly is that it has zero specificity when used by itself, meaning it can be overridden by a single id, class, or element selector.

### Practical Applications For the Universal Selector

#### CSS Box Model Reset

My most common usage is as my very first CSS reset rule:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

This means that we want all elements to _include_ padding and borders in the box model calculation instead of _adding_ those widths to any defined dimensions. For example, in the following rule, the `.box` will be `200px` wide, not `200px + 20px` from the padding:

```css
.box {
  width: 200px;
  padding: 10px;
}
```

#### Vertical Rhythm

Another very useful application was recommended by Andy Bell and Heydon Pickering in their [Every Layout](https://every-layout.dev/) site and book and is called "[The Stack](https://every-layout.dev/layouts/stack/)" which in it's most simple form looks like this:

```css
* + * {
  margin-top: 1.5rem;
}
```

When used with a reset or parent rule that reduces all element margins to zero, this applies a top margin to all elements _that follow another element_. This is a quick way to gain vertical rhythm.

If you do want to be a little more - well, selective - then I enjoy using it as a descendent in specific circumstances such as the following:

```css
article * + h2 {
  margin-top: 4rem;
}
```

This is similar to the stack idea, but more targeted towards the headline elements to provide a bit more breathing room between content sections.

## Attribute Selector

This is an exceedingly powerful category and yet often not used to its full potential.

Did you know you can achieve matching results similar to regex by leveraging CSS attribute selectors?

This is exceptionally useful for modifying BEM styled systems or other frameworks that use related class names but perhaps not a single common class name.

Let's see an example:

```css
[class*="component_"]
```

This selector will select all elements which have a class that _contains_ the string of "component\_", meaning it will match "component_title" and "component_content".

And you can ensure the match is case insensitive by including `i` prior to closing the attribute selector:

```css
[class*="component_" i]
```

But you don't have to specify an attribute value, you can simply check if it's present, such as:

```css
a[class]
```

Which would select _all_ `a` (link elements) that have _any_ class value.

> Review the MDN docs for [all the possible ways to match values within attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).

### Practical Applications For Attribute Selectors

#### Assist in Accessibility Linting

These selectors can be wielded to perform some basic accessibility linting, such as the following:

```css
img:not([alt]) {
  outline: 2px solid red;
}
```

This will add an outline to all images that do not include an `alt` attribute.

{% newsletterPromo %}

#### Attach to Aria to Enforce Accessibility

Attribute selectors can also help enforce accessibility if they are used as the _only_ selector, making the absence of the attribute prevent the associated styling. One way to do this is by attaching to required `aria` attributes

One example is when implementing an accordion interaction where you need to include the following button, whether the aria boolean is toggled via JavaScript:

```html
<button aria-expanded="false">Toggle</button>
```

The related CSS could then use the `aria-expanded` as an attribute selector alongside the adjacent sibling combinator to style the related content open or closed:

```css
button[aria-expanded="false"] + .content {
  /* hidden styles */
}
button[aria-expanded="true"] + .content {
  /* visible styles */
}
```

#### Styling Non-Button Navigation Links

When dealing with navigation, you may have a mix of default links and links stylized as "buttons". In this case, it can be very useful to use the following to select non-"button" links:

```css
nav a:not([class])
```

#### Remove Default List Styling

Another tip I've started incorporating from Andy Bell and his [modern CSS reset](https://piccalil.li/blog/a-modern-css-reset/) is to remove list styling based on the presence of the `role` attribute:

```css
/* Remove list styles on ul, ol elements with a list role, 
which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}
```

## Child Combinator

The child combinator selector - `>` - is very effective at adding just a bit of specificity to reduce scope when applying styles to element descendants. It is the only selector that deals with _levels_ of elements and can be compounded to select nested elements.

The child combinator scopes descendent styling from _any_ descendent that matches the child selector to only _direct descendants_.

In other words, whereas `article p` selects _all_ `p` within `article`, `article > p` selects only paragraphs that are directly within the article, not nested within other elements.

✅ Selected with `article > p`

```html
<article>
  <p>Hello world</p>
</article>
```

🚫 Not selected with `article > p`

```html
<article>
  <blockquote>
    <p>Hello world</p>
  </blockquote>
</article>
```

### Practical Applications For the Child Combinator

#### Nested Navigation List Links

Consider a sidebar navigation list, such as for a documentation site, where there are nested levels of links. Semantically, this means an outer `ul` and also nested `ul` within `li`.

For visual hierarchy, you likely want to style the top-level links differently than the nested links. To target only the top-level links, you can use the following:

```css
nav > ul > li > a {
  font-weight: bold;
}
```

Here's a CodePen where you can [experiment with what happens if you remove any of the child combinators](https://codepen.io/5t3ph/pen/dypZwJd) in that selector.

#### Scoping Element Selectors

I enjoy using element selectors for the foundational things in my page layouts, such as `header` or `footer`. But you can get into trouble since those elements are valid children of certain other elements, such as `footer` within a `blockquote` or an `article`.

In this case, you may want to adjust from `footer` to `body > footer`.

#### Styling Embedded / Third-Party Content

Sometimes you truly do not have control over class names, IDs, or even markup. For example, for ads or other JavaScript-driven (non-iframe) content.

In this case, you may be faced with a sea of divs or spans, in which case the child combinator can be very useful for attaching styles to varying levels of content.

> Note that many of the other selectors discussed can help in this scenario as well, but only the child combinator deals with _levels_ and can affect nested elements.

## General Sibling Combinator

The general sibling combinator - `~` - selects the defined elements that are located _somewhere after_ the preceding (prior defined) element and that are _within the same parent_.

For example, `p ~ img` would style all images that are located _somewhere after_ a paragraph provided they share the same parent.

This means all the following images would be selected:

```html
<article>
  <p>Paragraph</p>
  <h2>Headline 2</h2>
  <img src="img.png" alt="Image" />
  <h3>Headline 3</h3>
  <img src="img.png" alt="Image" />
</article>
```

But **not** the image in this scenario:

```html
<article>
  <img src="img.png" alt="Image" />
  <p>Paragraph</p>
</article>
```

It is likely you would want to be a bit more specific (see also: the adjacent sibling combinator), and this selector tends to be used most in creative coding exercises, such as my [CommitSweeper pure CSS game](https://codepen.io/5t3ph/pen/ExPVEZP).

### Practical Applications For the General Sibling Combinator

#### Visual Indication of A State Change

Combining the general sibling combinator with stateful pseudo class selectors, such as `:checked`, can produce interesting results.

Given the following HTML for a checkbox:

```html
<input id="terms" type="checkbox" />
<label for="terms">I accept the terms</label>
<!-- series of <p> with the terms content -->
```

We can alter the style of the terms paragraphs using the general sibling combinator _only when_ the checkbox has been checked:

```css
#terms:checked ~ p {
  font-style: italic;
  color: #797979;
}
```

#### Low Specificity Variations

If we also pull in the universal selector, we can quickly generate slight variations such as for simple card layouts.

Rather than moving content around and in and out of nested divs with classes to alter the arrangement of the headline and paragraphs, we can use the general sibling combinator instead to produce the following variations.

![Three card layouts including a headline, two paragraphs, and an image. Any content that follows an image gains the style described below.](https://dev-to-uploads.s3.amazonaws.com/i/g4e3fw68cot36qrb9k1p.png)

The rule adds some margin, reduces the font size and lightens the text color for any element that follows the image:

```css
img ~ * {
  font-size: 0.9rem;
  color: #797979;
  margin: 1rem 1rem 0;
}
```

You can [experiment with these general sibling combinator results in this CodePen](https://codepen.io/5t3ph/pen/VwKrqVB).

This rule has extremely low specificity, so you could easily override it by adding a more targeted rule.

Additionally, since it only applies when the elements are shared direct descendants of the image's parent - a `li` in this case - once you wrap the content in another element the rule will only apply up until inheritance is in use by child elements. To better understand this, try wrapping the content in the last card item in a div. The color and margin will be inherited on the `div` and type elements, but the native browser styling on the `h3` prevents the `font-size` from the general sibling combinator from being inherited since the native browser rule has higher specificity than the universal selector which is technically targeting the `div`.

## Adjacent Sibling Combinator

The adjacent sibling combinator - `+` - selects the element that directly follows the preceding (prior defined) element.

We've already used this within the universal selector examples - `* + *` - to apply a top margin to only elements that follow another element - so let's get right to more examples!

### Practical Applications For the Adjacent Sibling Combinator

#### Polyfill For Lack fo Flexbox Gap Support in Navigation

[Flexbox gap support](https://caniuse.com/flexbox-gap) is on the way, but at the time of writing is notably not yet available in Safari outside of their technology preview.

So, in the case of something like website navigation where flex layout is very useful, we can use the adjacent sibling combinator to assist in adding margin as a polyfill for `gap`.

```css
nav ul li + li {
  margin-left: 2rem;
}
```

Which enables a gap effect between list items without needing to clear out an extra margin on the first:

![Result of the previously described rule where the flex inlined link items have space between them provided by margin-left](https://dev-to-uploads.s3.amazonaws.com/i/q92z4bj0yhirnp5w9exh.png)

#### Applying Spacing Between Form Labels and Inputs

The theory being applied in "the stack" that we explored for universal selectors is to only apply margin in one direction.

We can use this idea scoped to form field objects to provide enough spacing to retain visual hierarchy between field types. In this case, we add a much smaller margin between a label and it's input, and a larger margin between inputs and labels:

```css
label + input {
  margin-top: 0.25rem;
}

input + label {
  margin-top: 2rem;
}
```

_Note_: This example works in a limited context. You probably want to enclose field types with a grouping element to ensure consistency between field types, vs. list all field types besides `input` such as `select` and `textarea`. If forms design is of interest to you, check out the mini-series here on ModernCSS and stay tuned for my upcoming [egghead course](https://5t3ph.dev/egghead) about cross-browser form field styling.

> **[Continue to part two where we'll learn about pseudo classes and pseudo elements](https://moderncss.dev/guide-to-advanced-css-selectors-part-two/)**. A great place to practice your new selector knowledge is my other project, [Style Stage](https://stylestage.dev) - a modern CSS showcase styled by community contributions. And, if you learned something from this guide and you're able, [I'd appreciate a coffee](https://www.buymeacoffee.com/moderncss) to help me bring you more tutorials and resources!
