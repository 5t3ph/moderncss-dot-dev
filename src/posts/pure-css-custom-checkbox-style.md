---
title: "Pure CSS Custom Checkbox Style"
topics: Accessibility,Custom Properties,Forms,Grid,Pseudo Elements,Selectors
episode: 19
description: "We'll create custom, cross-browser, theme-able, scalable checkboxes in pure CSS. We'll use `currentColor`, the `em` unit, SVG, and CSS grid layout."
templateEngineOverride: njk, md
date: 2020-07-27
---

We'll create custom, cross-browser, theme-able, scalable checkboxes in pure CSS with the following:

- `currentColor` for theme-ability, including of the SVG
- `em` units for relative sizing
- use of SVG for the `:checked` indicator
- CSS grid layout to align the input and label

> Many of the concepts here overlap with our [custom styled radio buttons](https://moderncss.dev/pure-css-custom-styled-radio-buttons/) from episode 18, with the addition of using an SVG for the `:checked` state and including styling for the `:disabled` state

{% carbonAd %}

> **Now available**: my egghead video course [Accessible Cross-Browser CSS Form Styling](https://5t3ph.dev/a11y-forms). You'll learn to take the techniques described in this tutorial to the next level by creating a themable form design system to extend across your projects.

## Checkbox HTML

In the [radio buttons](https://moderncss.dev/pure-css-custom-styled-radio-buttons/) article, we explored the two valid ways to markup input fields. Much like then, we will select the method where the label wraps the input.

For our checkboxes, we're going to make use of an inline SVG as well for our custom control, so here's our base HTML for testing both an unchecked and checked state:

```html
<label class="checkbox">
  <span class="checkbox__input">
    <input type="checkbox" name="checkbox" />
    <span class="checkbox__control">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          d="M1.73 12.91l6.37 6.37L22.79 4.59"
        />
      </svg>
    </span>
  </span>
  <span class="radio__label">Checkbox</span>
</label>

<label class="checkbox">
  <span class="checkbox__input">
    <input type="checkbox" name="checked" checked />
    <span class="checkbox__control">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          d="M1.73 12.91l6.37 6.37L22.79 4.59"
        />
      </svg>
    </span>
  </span>
  <span class="radio__label">Checkbox - Checked</span>
</label>
```

Note the use of `aria-hidden="true"` and `focusable="false"`, since we're going to treat this SVG like a decorative icon. In this case, the underlying checkbox is still available to provide the semantics of the checked state for accessibility.

## Common Issues With Native Checkboxes

As with the radio buttons, the checkbox appearance varies across browsers.

Here's the base styles across (in order from left) Chrome, Firefox, and Safari:

![default checkboxes in Chrome, Firefox, and Safari](https://dev-to-uploads.s3.amazonaws.com/i/hd8limqlb7v3wqf197e3.png)

Also like with radio buttons, the checkbox doesn't scale along with the `font-size`.

Our solution will accomplish the following goals:

- scale with the `font-size` provided to the label
- gain the same color as provided to the label for ease of theme-ability
- achieve a consistent, cross-browser design style, including `:focus` state
- maintain keyboard accessibility

> Our styles will begin with the same variable and reset as used for the [radio buttons](https://moderncss.dev/pure-css-custom-styled-radio-buttons/#theme-variable-and-box-sizing-reset)

## Label Styles

Our label uses the class of `.checkbox`. The base styles we'll include here are the `font-size` and `color`. Recall from earlier that the `font-size` will not yet have an effect on the visual size of the checkbox input.

We're using an abnormally large `font-size` just to emphasize the visual changes for purposes of the tutorial demo.

Our label is also the layout container for our design, and we're going to set it up to use CSS grid layout to take advantage of grid-gap.

```scss
.checkbox {
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: 0.5em;
  font-size: 2rem;
  color: var(--color);
}
```

Here's our progress as captured in Chrome, with Inspector revealing grid lines:

![base styles applied to the label](https://dev-to-uploads.s3.amazonaws.com/i/w7iz1juhtw4iljnvp08t.png)

Since we defined the `stroke` color of our SVG to be `currentColor` it has picked up the `rebeccapurple` value as well.

{% newsletterPromo %}

## Custom Checkbox Style

To prepare for this, we have wrapped our `input` in a `span` with the class `checkbox__input`. Then, we have also added a `span` as a sibling of the `input` with the class `checkbox__control`. The control span also contains the checkmark SVG.

Order here matters as we'll see when we style for `:checked`, `:focus`, and `:disabled`.

### Step 1: Hide the Native Checkbox

We need to hide the native checkbox, but keep it technically accessible to enable proper keyboard interaction and also to maintain access to the `:checked`, `:focus` state.

To accomplish this, we'll use `opacity` to visually hide it, and set its width and height to `1em`. We will retain width and height to ensure discoverability by users of touch devices.

```scss
.checkbox__input {
  input {
    opacity: 0;
    width: 1em;
    height: 1em;
  }
}
```

> I highly recommend [this article from Sara Soueidan](https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/) which goes in-depth on the options for inclusively hiding both radio buttons and checkboxes, and also offers a slightly different take on custom styling of these inputs.

### Step 2: Custom Unchecked Checkbox Styles

For our custom checkbox, we'll attach styles to the `span.checkbox__control` that is the sibling following the `input`.

We'll define it as an `inline-grid` element that is sized using `em` to keep it relative to the `font-size` applied to the `label`. We also use `em` for the `border-width` value to maintain the relative appearance. We then use `border-radius` to softly round the corners.

```scss
.checkbox__control {
  display: inline-grid;
  width: 1em;
  height: 1em;
  border-radius: 0.25em;
  border: 0.1em solid currentColor;
}
```

Here's our progress after hiding the native input and defining these base styles for the custom checkbox control:

![progress of styling the custom checkbox control](https://dev-to-uploads.s3.amazonaws.com/i/jhuzuyc0s4ag3fwo63bj.png)

Well, the `display: inline-grid` performed its magic to nicely contain the SVG checkmark, but what the deal with the alignment of the custom control vs. the label?

Since we retained a `width` and `height` on the checkbox input and only hide it with opacity, it's still taking up space.

To resolve this, we'll use CSS grid layout to define the `.checkbox__input` as a single grid template area, and direct its children to all occupy that area. This technique is the modern replacement for `position: absolute`.

```scss
.checkbox__input {
  display: grid;
  grid-template-areas: "checkbox";

  > * {
    grid-area: checkbox;
  }
}
```

![progress after resolving the alignment of the control vs the label](https://dev-to-uploads.s3.amazonaws.com/i/cp831nlcfhmxilc4b5ha.png)

> If you find that you have a bit of vertical misalignment between the control and label due to the font in use, see the related section for the [radio buttons](https://moderncss.dev/pure-css-custom-styled-radio-buttons/#step-3-improve-input-vs-label-alignment) for a solution using `transform`

### Step 3: Styling `:checked` vs Unchecked State

Our use of `opacity: 0` has kept the native checkbox input accessible for keyboard interaction as well as click/tap interaction.

It has also maintained the ability to detect its `:checked` state with CSS.

Remember how I mentioned order matters? Thanks to our custom control following the native input, we can use the adjacent sibling combination - `+` - to style our custom control when the native control is `:checked` 🙌

However - since we are using an inline SVG to display the `:checked` indicator, we actually need to set it up so that the SVG is initially hidden and only shown when in the `:checked` state.

We'll add a `transition` to provide an animated effect upon switching between states, and use `transform: scale(0)` to do the initial hiding:

```scss
.checkbox__control svg {
  transition: transform 0.1s ease-in 25ms;
  transform: scale(0);
  transform-origin: bottom left;
}
```

Next, we need to add the `:checked` styles to scale it back up into view:

```scss
.checkbox__input input:checked + .checkbox__control svg {
  transform: scale(1);
}
```

Here's a demo of the animated `:checked` interaction:

![gif of the checkbox being checked and unchecked](https://dev-to-uploads.s3.amazonaws.com/i/583xmuir07bsel4nu53y.gif)

### Step 4: The `:focus` state

For the `:focus` state, we're going to use the same double `box-shadow` technique as we used for the radio buttons. This lets us leverage `currentColor` but ensure distinction between the base custom checkbox and the `:focus` style.

```scss
.checkbox__input input:focus + .checkbox__control {
  box-shadow: 0 0 0 0.05em #fff, 0 0 0.15em 0.1em currentColor;
}
```

The order of box-shadow definitions means we are first creating the appearance of a thin white border, which appears above a feathered out shadow that takes on the value from `currentColor`.

Here's a demo of the `:focus` appearance:

![gif of the checkbox focus state](https://dev-to-uploads.s3.amazonaws.com/i/tgh2633m1qb3s79n876y.gif)

### Step 5: Styles For `:disabled` Checkboxes

One step we missed in the radio buttons tutorial was styling for the `:disabled` state.

This will follow a similar pattern as for our previous states, with the change here mostly being to update the color to a grey. Since all of our colors are tied to the `currentColor` value, this is an easy update for the custom control:

```scss
:root {
  --disabled: #959495;
}

.checkbox__input input:checkbox:disabled + .checkbox__control {
  color: var(--disabled);
}
```

But we've hit a snag. Since the label is the parent element, we don't currently have a way in CSS alone to style it based on the `:disabled` state.

For a CSS-only solution, we need to create an add an extra class to the label when it is known that the checkbox is disabled. Since this state can't be changed by the user, this will generally be an acceptable additional step.

We'll create the class of `.checkbox--disabled` to be added to the HTML label element.

```scss
.checkbox--disabled {
  color: var(--disabled);
}
```

## Demo

Here's a demo that includes the `:disabled` styles, and also shows how the power of CSS variables + the use of `currentColor` means we can re-theme an individual checkbox with a simple inline style. This is very useful for things like a quick change to an error state.

{% codepen "RwrOygP" %}
