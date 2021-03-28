---
title: "Guide to Advanced CSS Selectors - Part Two"
topics: Design,Layout,Pseudo Elements,Selectors
episode: 25
description: "Continuing from part one, this episode will focus on the advanced CSS selectors categorized as pseudo classes and pseudo elements and practical applications for each."
templateEngineOverride: njk, md
date: 2020-12-30
---

[Continuing from part one](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/), this episode will focus on the advanced CSS selectors categorized as pseudo classes and pseudo elements and practical applications for each. We'll especially try to make sense of the syntax for `nth-child`.

## Part Two (this article):

- [Pseudo classes](#pseudo-classes) - ex: `:checked / :focus`
- [Pseudo elements](#pseudo-elements) - ex: `::before / ::after`
- [Additional resources](#additional-resources)

### Part One:

- [CSS Specificity and the Cascade](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/#css-specificity-and-the-cascade)
- [Universal selector](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/#universal-selector) - `*`
- [Attribute selector](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/#attribute-selector) - `[attribute]`
- [Child combinator](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/#child-combinator) - `>`
- [General sibling combinator](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/#general-sibling-combinator) - `~`
- [Adjacent sibling combinator](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/#adjacent-sibling-combinator) - `+`

{% carbonAd %}

## Pseudo Classes

This is the largest category, and also the most context-dependent.

Pseudo classes are keywords that are applied when they match the selected state or context of an element.

These vastly increase the capabilities of CSS and enable functionality that in the past was often erroneously relegated to JavaScript.

Some selectors are stateful:

- `:focus`
- `:hover`
- `:visited`
- `:target`
- `:checked`

While others attach to the order of elements:

- `:nth-child()` / `:nth-of-type()`
- `:first-child` / `:first-of-type`
- `:last-child` / `:last-of-type`
- `:only-child` / `:only-of-type`

Then there's the highly useful pseudo class `:not()`, the newly supported `:is()`, as well as the `:root` pseudo class that has come to the forefront as CSS custom properties (variables) have risen in support.

> Review the MDN docs for the [full list of available pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) including available options specific to form inputs, `video` captions, and language, as well as some currently in progress towards implementation.

### Practical Applications For Pseudo Classes

#### Zebra Striped Table Rows

The `nth` series of selectors has endless applications. Use them for anything you want to occur in any sort of repetitive pattern using a 1-based index.

An excellent candidate for this is zebra striping of table rows.

The `nth-child` selector can use an integer, be defined using [functional notation](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child#Functional_notation), or the keywords of `even` or `odd`. We'll use the keywords to most efficiently produce our zebra striping rule:

```css
tbody tr:nth-child(odd) {
  background-color: #ddd;
}
```

Which will produce the following:

![a two-column table where rows in the table body have a light grey background for every other (odd) table row background](https://dev-to-uploads.s3.amazonaws.com/i/wjr035afx1qgkanwnuxe.png)

#### Apply Alternating Background Colors

Using the functional notation for `nth-child` we can alternate through a series of background colors and ensure the pattern repeats in the defined order no matter how many elements exist. So a pattern of `rebeccapurple`, `darkcyan`, `lightskyblue` will repeat in that order.

The way this works is to define the total number of colors - `3` - alongside `n`, which represents all positive numbers starting from 0, and which will be multiplied by the associated number, in this case, `3`. So by itself, `3n` would select the 3rd item, the 6th item, the 9th item, and so on. It would not select the first in the list because `3 x 0 = 0`.

For our repetitive pattern, we want the first item selected to be the first color in our palette.

So, we extend the notation to be `3n + (integer corresponding to color order)`, therefore our first color rule becomes:

```css
li:nth-child(3n + 1) {
  background-color: rebeccapurple;
}
```

And this selects every third element, starting with the first one:

![5 stacked items where the first and fourth have the background-color: rebeccapurple applied](https://dev-to-uploads.s3.amazonaws.com/i/a2smgktrsc6b7o182irc.png)

Essentially, that `+ [number]` shifts the starting index.

To complete our pattern we define the following rules, incrementing the added number to be the order of the color in the repeating pattern:

```css
li:nth-child(3n + 2) {
  background-color: darkcyan;
}

li:nth-child(3n + 3) {
  background-color: lightskyblue;
}
```

Producing the following completed result:

{% codepen "rNMpBjY" %}

For an extended guide to `nth-child` checkout the [recipe reference](https://css-tricks.com/useful-nth-child-recipies/) from CSS-Tricks and the [nth-child tester](https://css-tricks.com/examples/nth-child-tester/) to explore constructing these selectors.

> **Enjoying this guide and finding some useful solutions**? I'd appreciate a coffee to help keep me motivated to create more resources! I also offer front-end reviews and mentoring sessions, [choose an option to support me](https://www.buymeacoffee.com/moderncss).

#### Removing Extra Spacing From Child Elements

If you are not using a reset that starts all elements with zero margin, you may encounter typography elements creating extra unwanted margins that unbalance spacing within a visual container.

Pseudo classes do not always need to be directly attached to an element, meaning we can do the following rule which attaches to _any_ element that happens to be the last child of any parent and ensures it has no `margin-bottom`:

```css
:last-child {
  margin-bottom: 0;
}
```

#### Excluding Elements From Selectors

Careful application of `:not()` is very useful for excluding elements from being selected.

We explored a few uses of `:not()` within the attribute selector section, notably `a:not([class])` for targeting links that have no other classes applied.

`:not()` is excellent for use in utility frameworks or design systems to increase specificity on classes that have the potential to be applied to anything and for which there are known issues on certain combinations.

An extended example of excluding it for classes with links is when you are adjusting contrast for text, possibly in a dark mode context, and want to apply the contrast adjustment to text links as well:

```css
/* Non dark mode application */
a:not([class]) {
  color: blue;
}

/* Update text color for dark mode */
.dark-mode {
  color: #fff;
}

/* Extend the color update to links via `inherit` */
.dark-mode a:not([class]) {
  color: inherit;
}
```

You can also chain `:not()` selectors, so perhaps you want to create a rule for form field inputs, but not of certain types:

```css
input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])
```

It's also possible to include other pseudo selectors within `:not()` such as to exclude the `:disabled` state for buttons:

```css
button: not(: disabled);
```

This allows you to have tidier rules by defining a reset of `button` styles first, then _only_ apply coloration styles, borders, etc to non-disabled buttons instead of _removing_ those styles for `button:disabled` later.

#### Efficiently Select Groups of Elements

The [newly supported](https://caniuse.com/css-matches-pseudo) `:is()` pseudo class:

> "...takes a selector list as its argument, and selects any element that can be selected by one of the selectors in that list." - [MDN docs on `:is()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)

One way this can make a big impact is more compactly selecting typography elements such as:

```css
:is(h1, h2, h3, h4) ;
```

Or to scope layout styles more succinctly, such as:

```css
:is(header, main, footer) ;
```

We can even combine `:is()` with `:not()` and really trim down our selectors, in this case selecting elements that are _not_ headlines:

```css
:not(:is(h1,h2,h3,h4))
```

> To see this selector in context, check out the [Smol Composable Card Component](https://smolcss.dev/#smol-card-component) from the ModernCSS companion project, SmolCSS.dev.

For the immediate future, you'll want to include at least the `webkit` prefix version if you want to start using this selector. Due to a quirk in how browsers use selectors, you'll want to make this a unique rule separate from `is()` to avoid the browser throwing _both_ rules out.

```css
:-webkit-any(header, main, footer) ;
```

{% newsletterPromo %}

#### Style the Current Anchor Linked Element

When an element is the target of an anchor link (document fragment identifier) - `https://url.com/#anchor-here` - you can style it using `:target`.

I rely on anchor links for my project 11ty.Rocks, such as can be seen visiting this link to the [CSS Houdini Worklet Generator](https://11ty.rocks/#11ty-css-houdini-worklet-generator).

The `:target` pseudo class should be placed on the element that contains the `id` attribute. However, you can chain it with descendent selectors to affect nested elements - maybe you want to give `article:target h2` a larger size or something like that.

Leveraging `:target` I add a little extra message by combining with the pseudo element `::before` to help indicate to the visitor which item they were provided a link for, which appears as follows ("It's me you're looking for...")

![the :target style as applied to an article on 11ty.Rocks which has the message as described prior to this image](https://dev-to-uploads.s3.amazonaws.com/i/76zuti0pqhsih2zr8peg.png)

**Bonus tip**: ensure a bit of spacing prior to the top of the element on scroll by using `scroll-margin-top: 2em;` (or another value of your choosing). This should be considered a progressive enhancement, be sure to [review browser support for `scroll-margin-top`](https://caniuse.com/mdn-css_properties_scroll-margin-top).

#### Visually Indicate Visited Archive Links

The `:visited` pseudo class is very unique because of [the potential to be exploited in terms of user's privacy](https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector). To resolve this, browser makers have limited which CSS styles are allowed to be applied using `:visited`.

Una Kravets has a much more [in-depth reference exploring how to create useful `:visited` styles](https://una.im/hacking-visited/), but here's the reduced version which I have in use [for visitors of Style Stage to track which styles they have already viewed](https://stylestage.dev/styles/).

A key gotcha is that styles applied via `:visited` will always use the parent's alpha channel - meaning, you cannot use `rgba` to go from invisible to visible, you must change the whole color value.

So, to hide the initial state, you need to be able to use a solid color, such as the page background color.

Additionally, for accessibility, it may not be desirable for the pseudo element content to be read out if it's an icon or emoji since we cannot supply an accessible name for `content` values. There is inconsistencies between assistive technology in whether pseudo element content is read, so we can try to ensure it's ignored with the use of `aria-hidden="true"`.

Our first step then is to add a span within links and that is what we will ultimately apply the `:visited` stylings to:

```html
<a href="#">Article Title <span aria-hidden="true"></span></a>
```

The default styling (non-visited) adds the pseudo element, and makes the color the same as the page background to hide it visually:

```css
a span[aria-hidden]::after {
  content: "✔";
  color: var(--color-background);
}
```

Then, when the link has been visited, we update the color to make it visible:

```css
a:visited span[aria-hidden]::after {
  color: var(--color-primary);
}
```

#### Advanced Interactions With `:focus-within`

An up and coming pseudo class is `:focus-within` for which a polyfill is available, but otherwise it should be used with caution or as a progressive enhancement.

The `:focus-within` pseudo class as described by [MDN docs:](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)

> The `:focus-within` CSS pseudo-class represents an element that has received focus or contains an element that has received focus. In other words, it represents an element that is itself matched by the `:focus` pseudo-class or has a descendant that is matched by `:focus`.

For a practical way to use `:focus-within` review the tutorial for a [CSS-Only Accessible Dropdown Navigation Menu](https://moderncss.dev/css-only-accessible-dropdown-navigation-menu/).

## Pseudo Elements

Pseudo elements allow you to style a specific part of the selected element. They vary quite widely in application, with the (currently) best supported ones being the following:

- `::after`
- `::before`
- `::first-letter`
- `::first-line`
- `::selection`

### Practical Applications For Pseudo Elements

#### Extra Visual Elements For Styling Benefits

The `::before` and `::after` pseudo elements create an additional element that visually appears to be part of the DOM, but is not part of the real HTML DOM. They are as fully style-able as any real DOM element.

I have used these elements for all sorts of embellishments. Since they act like real elements, they are computed as child elements when using flexbox or CSS grid layout, which has greatly increased their functionality in my toolbox.

A few key concepts for using `::before` and `::after`:

- Requires the `content` property before being made visible, but this property can be set to a blank string - `content: "";`
- Critical text content should not be included in the `content` value since it's inconsistently accessed by assistive technology
- Unless positioned otherwise, `::before` will display prior to the main element content, and `::after` will display after it.

Here's a demo of the default behavior of these with just a little bit of styling applied:

![A short paragraph showing the the text of "Before" in sitting prior to the paragraph content and the text of "After" sitting after the paragraph content](https://dev-to-uploads.s3.amazonaws.com/i/h66jvp0e6svmbbw09sh1.png)

Notice they act like inline elements by default, and follow the wrapping behavior as well for longer content:

![A slightly longer paragraph that has wrapping lines showing the the text of "Before" in sitting prior to the paragraph content and the text of "After" sitting after the paragraph content](https://dev-to-uploads.s3.amazonaws.com/i/o01fjpavgllxqlcbubrk.png)

And here's with the singular adjustment to add `display: flex` to the paragraph:

![The same multiline paragraph but the "Before" appears as a column to the left of the paragraph content, and "After" appears as a column after the paragraph content](https://dev-to-uploads.s3.amazonaws.com/i/15693mr4uufc3hhxdbor.png)

And here's with swapping that to `display: grid`:

![The same multiline paragraph but the "Before" appears as a row on top of the paragraph content, and "After" appears as a row below the paragraph content](https://dev-to-uploads.s3.amazonaws.com/i/n3trrnffml62n7oudlsl.png)

The `::before` and `::after` elements are quick ways to add simple, consistent typography flourishes, a few of which can be seen in this CodePen demo:

{% codepen "PoGEwzB" %}

Did you catch the trick in the emoji one?

We can retrieve the value of any attribute on the element to use in the `content` property via the `attr()` function:

```css
/*
<h2 class="emoji" data-emoji="😍">
*/
.emoji::before {
  content: attr(data-emoji);
}
```

Here's a gist of [how to display element `id` and `class` values in pseudo elements](https://gist.github.com/5t3ph/d44a1677d68cf86eb0683d5050a84692) using this same idea. [You can also share the tweet with this tip >](https://twitter.com/5t3ph/status/1335566409355575297)

#### Emphasize an Article Lead

The "lede" (pronounced "lead") is a newsprint term for the first paragraph within a news article and is intended to be a summary of the key point of the article (you may have heard the phrase "Don't bury the lede!").

We can combine the pseudo class of `:first-of-type` with the pseudo element of `:first-line` to emphasize the first line of paragraph copy. Interestingly, this is dynamic and will change as the viewport size changes.

```css
article p:first-of-type:first-line {
  font-weight: bold;
  font-size: 1.1em;
  color: darkcyan;
}
```

Producing the following inherently responsive result:

![gif demo of resizing the viewport when the previously described rule is applied and seeing that as the number of words in the first line of the paragraph changes the style continues to only affect the very first line](https://dev-to-uploads.s3.amazonaws.com/i/50ym2bam1ic7frl913fh.gif)

#### Ensure Accessible Contrast For Text Selection

A frequently missed style is for text selection, despite it being an interaction many of us engage in multiple times a day.

While browsers try to handle styling this event, it is possible to lose contrast. I encountered this when styling [ModernCSS.dev](http://moderncss.dev) due to the darker theme in use.

To resolve, we can use the `::selection` pseudo element to supply a custom text color and background color:

```css
::selection {
  background: yellow;
  color: black;
}
```

#### Custom List Bullet Styles

An up and coming pseudo element specifically for styling list bullets is `::marker`.

For the browser support link and an example of how to use it, check out the section in my tutorial on [Totally Custom List Styles](https://moderncss.dev/totally-custom-list-styles/#upgrading-to-css-marker).

#### Discover More Pseudo Element Uses on ModernCSS.dev

How many other examples can you find by inspecting [ModernCSS.dev](https://moderncss.dev)? I'd love to hear what you find, what you've learned, and any other feedback! [Reach out to me on Twitter](https://twitter.com/5t3ph) or tag `@5t3ph` when you share this or other articles from ModernCSS.dev!

## Additional Resources

- [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) on CSS selectors
- [Selectors Explained](https://hugogiraudel.github.io/selectors-explained/) - enter any selector to learn what is being affected
- [CSS specificity calculator by Polypane](https://polypane.app/css-specificity-calculator/) - discover the level of specificity of a selector
- [CSS Diner](https://flukeout.github.io/) - a game to test your ability to create CSS selectors
- [Style Stage](https://stylestage.dev) - a great place to practice your new selector knowledge is my other project, [Style Stage](https://stylestage.dev), which is a modern CSS showcase styled by community contributions. A limitation is the inability to add new classes or IDs, so you will need to exercise your selector abilities to successfully create your stylesheet submission!

> **[Head back to part one to learn about five other categories of advanced CSS selectors](https://moderncss.dev/guide-to-advanced-css-selectors-part-one/)**. And, if you learned something from this guide and you're able, [I'd appreciate a coffee](https://www.buymeacoffee.com/moderncss) to help me bring you more tutorials and resources!
