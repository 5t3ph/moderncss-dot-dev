---
title: "Generating `font-size` CSS Rules and Creating a Fluid Type Scale"
topics: Design,Responsive Design,Typography
episode: 12
description: "Let's take the mystery out of sizing type. Learn recommended units for `font-size`, how to generate ratio-based fluid sizes with Sass, and how to handle overflow."
templateEngineOverride: njk, md
date: 2020-05-28
updatedOn: 2021-06-06
---

Let's take the mystery out of sizing type. Typography is both foundational to any stylesheet and the quickest way to elevate an otherwise minimal layout from drab to fab. If you're looking for type design theory or how to select a font, that's outside the scope of this article. The goal for today is to give you a foundation for developing essential type styles in CSS, and terms to use if you wish to explore any topics deeper.

This episode covers:

- recommended units for `font-size`
- generating ratio-based `font-size` values with Sass
- recommended properties to prevent overflow from long words/names/URLs
- defining viewport-aware fluid type scale rules with `clamp()`
- additional recommendations for dealing with type

{% carbonAd %}

## Defining "Type Scale"

The simplified definition: "type scale" for the web refers to properties such as `font-size`, `line-height`, and often `margin`, that work together to create _vertical rhythm_ in your design. These can be arbitrarily selected ("it just looks good"), or be based on the idea of a "modular scale" that employs ratio-based sizing.

At a minimum, it involves setting a base `font-size` and `line-height` on `body` which elements such as paragraphs and list items will inherit by default.

Then, set `font-size` and `line-height` on heading elements, particularly levels `h1`-`h4` for general use.

#### What about `h5` and `h6`?

Certain scenarios might make it beneficial to care about levels 5 and 6 as well, but **it's important to not use a heading tag when it's really a visual style that's desired**. Overuse of heading tags can cause noise or generally impart poor information hierarchy for assistive tech when another element would be better suited for the context.

## Selecting a Unit for `font-size`

`px`, `%`, `rem`, and `em`, oh my!

The first upgrade is to forget about `px` when defining typography. It is not ideal due to failure to scale in proportion to the user's default `font-size` that they may have set as a browser preference or by using zoom.

Instead, it's recommended that your primary type scale values are set with `rem`.

Unless a user changes it, or you define it differently with `font-size` on an `html` rule, the default `rem` value is 16px with the advantage of responding to changes in operating system zoom level.

In addition, the value of `rem` will not change no matter how deeply it is nested, which is largely what makes it the preferred value for typography sizing.

A few years ago, you might have started to switch your `font-size` values to `em`. Let's learn the difference.

`em` will stay proportionate to the element or nearest ancestor's `font-size` rule. One `em` is equal to the `font-size`, so by default, this is equal to `1rem`.

Compared to `rem`, `em` can compound from parent to child, causing adverse results. Consider the following example of a list where the `font-size` is set in `em` and compounds for the nested lists:

{% codepen "rNVeLdM" %}

> Learn more about units including `rem` and `em` in my [Guide to CSS Units for Relative Spacing](https://dev.to/5t3ph/guide-to-css-units-for-relational-spacing-1mj5)

`em` shines when the behavior of spacing relative to the element is the desired effect.

One use case is for [buttons](https://moderncss.dev/css-button-styling-guide/) when sizing an icon relative to the button text. Use of `em` will scale the icon proportionate to the button text without writing custom icon sizes if you have variants in the button size available.

Percentages have nearly equivalent behavior to `em` but typically `em` is still preferred when relative sizing is needed.

### Calculating `px` to `rem`

I've spent my career in marketing and working with design systems, so I can relate to those of you being given px-based design specs :)

You can create calculations by assuming that `1rem` is `16px` - or use an [online calculator](http://pxtorem.com/) to do the work for you!

## Baseline Type Styles

A solid starting point is to define:

```scss
body {
  line-height: 1.5;
}
```

Older recommendations may say to use `100%`, and this article previously recommended `1rem`. However, the only element the `body` can inherit from is `html` which is where the `rem` unit takes its value and so defining it here is redundant.

So, we'll only add one rule which is for accessibility. It is recommended to have a minimum of 1.5 `line-height` for legibility. This can be affected by various factors, particularly font in use, but is the recommended starting value.

### Preventing Text Overflow

We can add some future-proof properties to help prevent overflow layout issues due to long words, names, or URLs.

This is optional, and you may prefer to scope these properties to component-based styles or create a utility class to more selectively apply this behavior.

We'll scope these to headings as well as `p` and `li` for our baseline:

```scss
p,
li,
h1,
h2,
h3,
h4 {
  // Help prevent overflow of long words/names/URLs
  word-break: break-word;

  // Optional, not supported for all languages
  hyphens: auto;
}
```

As of testing for this episode, `word-break: break-word;` seemed sufficient, whereas looking back on articles over the past few years seem to recommend more properties for the same effect.

The `hyphens` property is still [lacking in support](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens#Browser_compatibility), particularly when you may be dealing with multi-language content. However, it gracefully falls back to simply no hyphenation in which case `word-break` will still help. More testing may be required for certain types of content where long words are the norm, ex. scientific/medical content.

[This CSS-Tricks article](https://css-tricks.com/snippets/css/prevent-long-urls-from-breaking-out-of-container/) covers additional properties in-depth if you do find these two properties aren't quite cutting it.

## Ratio-based Type Scales

While I introduced this episode by saying we wouldn't cover type design theory, we will use the concept of a "type scale" to efficiently generate `font-size` values.

Another term for ratio-based is "modular", and here's a great article introducing the term by [Tim Brown on A List Apart](https://alistapart.com/article/more-meaningful-typography/).

There are some named ratios available, and our Codepen example creates a Sass map of them for ease of reference:

```scss
$type-ratios: (
  "minorSecond": 1.067,
  "majorSecond": 1.125,
  "minorThird": 1.2,
  "majorThird": 1.25,
  "perfectFourth": 1.333,
  "augmentedFourth": 1.414,
  "perfectFifth": 1.5,
  "goldenRatio": 1.618,
);
```

_These ratios were procured from the really slick online calculator [Type Scale](https://type-scale.com/)_

{% newsletterPromo %}

### Generating `font-size` Using a Selected Ratio

Stick with me - I don't super enjoy math, either.

The good news is we can use Sass to do the math and output styles dynamically in relation to any supplied ratio 🙌

> Unfamiliar with Sass? It's a preprocessor that gives your CSS superpowers - like variables, array maps, functions, and loops - that compile to regular CSS. [Learn more about Sass >](https://sass-lang.com/guide)

There are two variables we'll define to get started:

```scss
// Recommended starting point
$type-base-size: 1rem;

// Select by key of map, or use a custom value
$type-size-ratio: type-ratio("perfectFourth");
```

The `$type-size-ratio` is selecting the `perfectFourth` ratio from the map previewed earlier, which equals `1.333`.

_The CodePen demo shows how the `type-ratio()` custom Sass function is created to retrieve the ratio value by key. For use in a single project, you can skip adding the map entirely and directly assign your chosen ratio decimal value to_ `$type-size-ratio`.

Next, we define the heading levels that we want to build up our type scale from. As discussed previously, we will focus on `h1`-`h4`.

We create a variable to hold a list of these levels so that we can loop through them in the next step.

```scss
// List in descending order to prevent extra sort function
$type-levels: 4, 3, 2, 1;
```

These are listed starting with `4` because `h4` should be the smallest - and closest to the body size - of the heading levels.

Time to begin our loop and add the math.

First, we create a variable that we will update on each iteration of the loop. To start with, it uses the value of `$type-base-size`:

```scss
$level-size: $type-base-size;
```

If you are familiar with Javascript, we are creating this as essentially a `let` scoped variable.

Next, we open our `@each` loop and iterate through each of the `$type-levels`. We compute the `font-size` value / re-assign the `$level-size` variable. This compounds `$level-size` so that is scales up with each heading level and is then multiplied by the ratio for the final `font-size` value.

```scss
@each $level in $type-levels {
  $level-size: $level-size * $type-size-ratio;

  // Output heading styles
  // Assign to element and create utility class
  h#{$level} {
    font-size: $level-size;
}
```

Given the `perfectFourth` ratio, this results in the following `font-size` values:

```bash
h4: 1.333rem
h3: 1.776889rem
h2: 2.368593037rem
h1: 3.1573345183rem
```

![preview of 'perfectFourth' type sizes](https://dev-to-uploads.s3.amazonaws.com/i/j42cx5vf0fm9ucp0nqnc.png)

_Example phrase shamelessly borrowed from Google fonts 🙃_

_h/t to this David Greenwald article on [Modular Scale Typography](https://www.rawkblog.com/2018/05/modular-scale-typography-with-css-variables-and-sass/) which helped connect the dots for me on getting the math correct for ratio-based sizing. He also shows how to accomplish this with CSS `var()` and `calc()`_

### `line-height` and Vertical Spacing

At a minimum, it would be recommended to include a `line-height` update within this loop. The preview image already included this definition, as without it, large type generally doesn't fare well from inherits the `1.5` rule.

[A recent article](https://hugogiraudel.com/2020/05/18/using-calc-to-figure-out-optimal-line-height/) by Jesús Ricarte is very timely from our use case, which proposes the following clever calculation:

```scss
line-height: calc(2px + 2ex + 2px);
```

The `ex` unit is intended to be equivalent to the `x` height of a font. Jesús tested a few solutions and devised the `2px` buffers to further approach an appropriate `line-height` that is able to scale. It even scales with fluid - aka "responsive" type - which we will create next.

As for vertical spacing, if you are using a CSS reset it may include clearing out all or one direction of margin on typography elements for you.

Check via Inspector to see if your type is still inheriting margin styles from the browser. If so, revisit the rule where we handled overflow and add `margin-top: 0`.

Then, in our heading loop, my recommendation is to add:

```scss
margin-bottom: 0.65em;
```

As we learned, `em` is relative to the `font-size`, so by using it as the unit on `margin-bottom` we will achieve space that is essentially 65% of the `font-size`. You can experiment with this number to your taste, or explore the vast sea of articles that go into heavier theory on vertical rhythm in type systems to find your preferred ideal.

## Fluid Type - aka Responsive Typography

If you choose a ratio that results in rather large `font-size` on the upper end, you are likely to experience overflow issues on small viewports despite our earlier attempt at prevention.

This is one reason techniques for "fluid type" have come into existence.

Fluid type means defining the `font-size` value in a way that responds to the viewport size, resulting in a "fluid" reduction of size, particularly for larger type.

There is a singular modern CSS property that will handle this exceptionally well: `clamp`.

The `clamp()` function takes three values. Using it, we can set a minimum allowed font size value, a scaling value, and a max allowed value. This effectively creates a range for each `font-size` to transition between, and it will work thanks to viewport units.

> [Learn more about `clamp()` on MDN](<https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()>), and [check browser support](https://caniuse.com/css-math-functions) (currently 90.84%)

We'll leave our existing loop in place because we still want the computed ratio value. And, the `font-size` we've set will become the fallback for browsers that don't yet understand `clamp()`.

But - we have to do more math 😊

In order to correctly perform the math, we need to do a bit of a hack (thanks, Kitty at [CSS-Tricks](https://css-tricks.com/snippets/sass/strip-unit-function/)!) to remove the unit from our `$level-size` value:

```scss
// Remove unit for calculations
$level-unitless: $level-size / ($level-size * 0 + 1);
```

Next, we need to compute the minimum size that's acceptable for the font to shrink to.

```scss
// Set minimum size to a percentage less than $level-size
// Reduction is greater for large font sizes (> 4rem) to help
// prevent overflow due to font-size on mobile devices
$fluid-reduction: if($level-size > 4, 0.5, 0.33);
$fluid-min: $level-unitless - ($fluid-reduction * $level-unitless);
```

You can adjust the if/else values for the `$fluid-reduction` variable to your taste, but this defines that for `$level-size` greater than `4rem`, we'll allow a reduction of `0.5` (50%) - and smaller sizes are allowed a `0.33` (33%) reduction.

In pseudo-math, here's what's happening for the `h4` using the `perfectFourth` ratio:

```scss
$fluid-min: 1.33rem - (33% of 1.33) = 0.89311;
```

The result is a 33% allowed reduction from the base `$level-size` value.

The pseudo-math actually exposes an issue: this means that the `h4` _could_ shrink below the `$type-base-size` (reminder: this is the base `body` font size).

Let's add one more guardrail to prevent this issue. We'll double-check the result of `$fluid-min` and if it's going to be below `1` - the unitless form of `1rem` - we just set it to `1` (adjust this value if you have a different `$type-base-size`):

```scss
// Prevent dropping lower than 1rem (body font-size)
$fluid-min: if($fluid-min > 1, $fluid-min, 1);
```

We're missing one value which I have taken to calling the "scaler" - as in, the value that causes the fluid scaling to occur. It needs to be a value that by it's nature will change in order to trigger the transition between our min and max values.

So, we'll be incorporating viewport units - specifically `vw`, or "viewport width". When the viewport width changes, then this value will also update it's computed value. When it approaches our minimum value, it won't shrink further, and the true in the opposite direction for our max value. This creates the "fluid" type sizing effect.

In order to retain accessible sizing via zooming, we'll also add `1rem` alongside our `vw` value. This helps alleviate (but not entirely rule out) side effects of using viewport units only. This is because as was mentioned earlier, the `rem` unit will scale with the user's zoom level as set via either their operating system _or_ with in-browser zoom. To meet [WCAG Success Criterion 1.4.4: Resize text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html), a user must be able to increase font-size by up to 200%.

Let's create our scaler value:

```scss
$fluid-scaler: ($level-unitless - $fluid-min) + 4vw;
```

The logic applied here is to get the difference between the upper and lower limit, and add that value to a viewport unit of choice, in this case `4vw`. A value of 4 or 5 seems to be common in fluid typography recommendations, and testing against the `$type-ratios` seemed to surface `4vw` as keeping the most definition between heading levels throughout scaling. Please get in touch if you have a more formulaic way to arrive at the viewport value!

Altogether, our fluid type `font-size` rule becomes:

<!-- prettier-ignore -->
```scss
font-size: clamp(
        #{$fluid-min}rem,
        #{$fluid-scaler} + 1rem,
        #{$level-size}
      );
```

## In Closing...

If you really read this whole episode, thank you _so much_ for sticking with it. I look forward to your feedback, please reach out on [DEV](https://dev.to/5t3ph/generating-font-size-css-rules-and-creating-a-fluid-type-scale-2553) or [Twitter](https://twitter.com/5t3ph). Typography has so many angles and the "right way" is very project-dependent. It may be the set of properties with the most stakeholders and the most impact on any given layout.

## Demo

The demo includes all things discussed, and an extra bit of functionality which is that a map is created under the variable `$type-styles` to hold each generated value with `h[x]` as the key.

Following the loop is the creation of the `type-style()` function that can retrieve values from the map based on a key such as `h3`. This can be useful for things like design systems where you may want to reference the `h3` font-size on the component level for visual consistency when perhaps a heading is semantically incorrect.

{% codepen "rNOgeYv" %}
