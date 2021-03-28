---
title: "Custom CSS Styles for Form Inputs and Textareas"
topics: Accessibility,Custom Properties,Forms,Selectors
episode: 21
description: "Create custom form input and textarea styles that have a near-identical appearance across the top browsers, and ensure all states meet contrast requirements."
templateEngineOverride: njk, md
date: 2020-08-31
---

We're going to create custom form input and textarea styles that have a near-identical appearance across the top browsers. We'll specifically style the input types of `text`, `date`, and `file`, and style the `readonly` and `disabled` states.

Read on to learn how to:

- reset input styles
- use `hsl` for theming of input states
- ensure all states meet contrast requirements
- retain a perceivable `:focus` state for Windows High Contrast mode

{% carbonAd %}

> **Now available**: my egghead video course [Accessible Cross-Browser CSS Form Styling](https://5t3ph.dev/a11y-forms). You'll learn to take the techniques described in this tutorial to the next level by creating a themable form design system to extend across your projects.

> This is the fourth installment in the Modern CSS form field mini-series. Check out episodes 18-20 to learn how to style other common form field types including [radio buttons](https://moderncss.dev/pure-css-custom-styled-radio-buttons/), [checkboxes](https://moderncss.dev/pure-css-custom-checkbox-style/), and [selects](https://moderncss.dev/custom-select-styles-with-pure-css/).

## Common Issues with Native Input Styles

There is a bit more parity between text input styles than we saw with radios, checkboxes, and selects, but inconsistencies nonetheless.

Here's a screenshot of the unstyled inputs we're going to address today across (from left) Chrome, Safari, and Firefox.

![native input fields including text, date, file, and readonly and disabled states in the aforementioned browsers](https://dev-to-uploads.s3.amazonaws.com/i/7scyr2oalmyn8fce7z6x.png)

We will be looking to unify the initial appearance across browsers and common field types.

> The `date` field is unique in that Chrome and Firefox provide formatting and a popup calendar to select from, while Safari offers no comparable functionality. We cannot create this in CSS either, so our goal here is to get as far as we can with creating a similar initial appearance. Check out the [caniuse for date/time inputs](https://caniuse.com/#feat=input-datetime).

## Base HTML

We're covering a lot of field types, so check the CodePen for the full list. But here is the essential HTML for a text input and a textarea.

```html
<label for="text-input">Text Input</label>
<input class="input" id="text-input" type="text" />

<label for="textarea">Textarea</label>
<textarea class="input" id="textarea"></textarea>
```

To allow simplifying our styles and preparing to work with the cascade, we've only added one CSS class - `input` - which is placed directly on the text input and textarea.

The label is not part of our styling exercise, but its included as a general requirement, notably with the `for` attribute having the value of the `id` on the input.

## Create CSS Variables for Theming

For the tutorial, we're going to try a bit different technique for theming by using `hsl` values.

We'll set a grey for the border, and then break down a blue color to be used in our `:focus` state into its hsl values, including: `h` for "hue", `s` for "saturation", and `l` for "lightness".

```css
:root {
  --input-border: #8b8a8b;
  --input-focus-h: 245;
  --input-focus-s: 100%;
  --input-focus-l: 42%;
}
```

> Each of the tutorials for our form fields has incorporated a bit different method for theming, which can all be extracted and used beyond just forms!

### Accessible Contrast

As per all user interface elements, the input border needs to have _at least_ 3:1 contrast against it's surroundings.

And, the `:focus` state needs to have 3:1 contrast against the _unfocused_ state if it involves something like changing the border color _or_, according to [the WCAG 2.2 draft](https://www.w3.org/TR/WCAG22/#focus-appearance-minimum), a thickness greater than or equal to `2px`.

[The draft for WCAG 2.2](https://www.w3.org/TR/WCAG22/#focus-appearance-minimum) makes some slight adjustments to `:focus` requirements, and I encourage you to review them.

## Reset Styles

As is included in all my tutorials as a modern best practice, we add the following reset first:

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

As seen in the initial state of the fields across browsers, some standout differences were in border type, background color, and font properties.

Interestingly, `font-size` and `font-family` do not inherit from the document like typography elements do, so we need to explicitly set them as part of our reset.

Also of note, an input's `font-size` should compute to at least 16px to avoid zooming being triggered upon interaction in mobile Safari. We can typically assume `1rem` equals `16px`, but we'll explicitly set it as a fallback and then use the newer CSS function [`max`](https://developer.mozilla.org/en-US/docs/Web/CSS/max) to set `16px` as the minimum in case it's smaller than `1em` (h/t to [Dan Burzo](https://dev.to/danburzo/css-micro-tip-make-mobile-safari-not-have-to-zoom-into-inputs-1fc1) for this idea).

```css
.input {
  font-size: 16px;
  font-size: max(16px, 1em);
  font-family: inherit;
  padding: 0.25em 0.5em;
  background-color: #fff;
  border: 2px solid var(--input-border);
  border-radius: 4px;
}
```

We set our `border` to use the theme variable, and also created a slightly rounded corner.

After this update, we're already looking pretty good:

![updated input styles in Chrome, Safari, and Firefox which all show the inputs with unified grey borders and white backgrounds](https://dev-to-uploads.s3.amazonaws.com/i/ljnbom4rejrx08mxsa9s.png)

It may be difficult to notice in that screenshot, but another difference is the height of each field. Here's a comparison of the text input to the file input to better see this difference:

![text input field across browsers compared to file input](https://dev-to-uploads.s3.amazonaws.com/i/elc4gv33zikdjbbvdekc.png)

Let's address this with the following which we are applying to our `.input` class as long as it is not placed on a `textarea`:

```css
.input:not(textarea) {
  line-height: 1;
  height: 2.25rem;
}
```

We included `line-height: 1` since when it's not a `textarea` it's impossible for an input to be multiline. We also set our height in `rem` due to considerations of specifically the file input type. If you know you will not be using a file input type, you could use `em` here instead for flexibility in creating various sized inputs.

But, critically, we've lost differentiation between editable and `disabled` input types. We also want to define `readonly` with more of a hint that it's also un-editable, but still interactive. And we have a bit more work to do to smooth over the file input type. And, we want to create our themed `:focus` state.

{% newsletterPromo %}

## File Input CSS

Let's take another look at just our file input across Chrome, Safari, and Firefox:

![current state of the file input styling across browsers](https://dev-to-uploads.s3.amazonaws.com/i/mawyssxau7ha2co1dfkb.png)

We cannot style the button created by the browser, or change the prompt text, but the reset we provided so far did do a bit of work to allow our custom font to be used.

We'll make one more adjustment to downsize the font just a bit as when viewed with other field types the inherited button seems quite large, and `font-size` is our only remaining option to address it. From doing that, we need to adjust the top padding since we set our padding up to be based on `em`.

```css
input[type="file"] {
  font-size: 0.9em;
  padding-top: 0.35rem;
}
```

> If you were expecting a fancier solution, there are plenty of folx who have covered those. My goal here was to provide you a baseline that you can then build from.

## `readonly` CSS Style

While not in use often, the `readonly` attribute prevents additional user input, although the value can be selected, and it is still discoverable by assistive tech.

Let's add some styles to enable more of a hint that this field is essentially a placeholder for a previously entered value.

To do this, we'll target any `.input` that also has the `[readonly]` attriute. Attribute selectors are a very handy method with wide application, and definitely worth adding to (or updating your awareness of) in your CSS toolbox.

```css
.input[readonly] {
  border-style: dotted;
  cursor: not-allowed;
  color: #777;
}
```

In addition to swapping for a `dotted` border, we've also assigned it the `not-allowed` cursor and enforced a medium-grey text color.

As seen in the following gif, the user cannot interact with the field except to highlight/copy the value.

![the user mouses over the readonly field and is show the not-allowed cursor, and then double-clicks to highlight the value](https://dev-to-uploads.s3.amazonaws.com/i/iouhzeibpjqshlwt66mf.gif)

## Disabled Input and Textarea Style

Similar to `readonly`, we'll use an attribute selector to update the style for disabled fields. We are attaching it to the `.input` class so it applies on textareas as well as our other input types.

We'll make use of our CSS variable to update the border color to a muted grey, and the field background to a very light grey. We'll also again apply the `not-allowed` cursor as just an extra hint that the field is not interactive.

```css
.input[disabled] {
  --input-border: #ccc;

  background-color: #eee;
  cursor: not-allowed;
}
```

And here is the result for both a text input and a textarea:

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/laaw2w94zl43c187ojae.png)

> **Accessibility Note**: `disabled` fields are not necessarily discoverable by assistive tech since they are not focusable. They also are not required to meet even the typical 3:1 contrast threshold for user interface elements, but we've kept with user expectations by setting them to shades of grey.

## Textarea Styles

Our `textarea` is really close, but there's one property I want to mention since it's unique to the inherent behavior of textareas.

That property is [`resize`](https://developer.mozilla.org/en-US/docs/Web/CSS/resize), which allows you to specify which direction the `textarea` can be resized, or if it even can at all.

While you definitely should allow the `textarea` to retain the resize function under general circumstances, you can limit it to just vertical resizing to prevent layout breakage from a user dragging it really wide, for example.

We'll apply this property by scoping our `.input` class to when it's applied on a `textarea`:

```css
textarea.input {
  resize: vertical;
}
```

Try it out in the final CodePen demo!

## `:focus` State Styles

Ok, we've completed the initial styles for our inputs and the textarea, but we need to handle for a very important state: `:focus`.

We're going to go for a combo effect that changes the border color to a value that meets 3:1 contrast against the unfocused state, but also adds a `box-shadow` for a bit of extra highlighting.

And here's why we defined our theme color of the focus state in hsl: it means we can create a variant of the border color by updating just the lightness value.

First, we define the border color by constructing the full hsl value from the individual CSS variable values:

```css
.input:focus {
  border-color: hsl(var(--input-focus-h), var(--input-focus-s), var(--input-focus-l));
}
```

Then, we add in the `box-shadow` which will only use blur to create essentially a double-border effect. `calc()` is acceptable to use inside `hsla`, so we use it to lighten the original value by 40%, and also allow just a bit of alpha transparency:

```css
.input:focus {
  /* ...existing styles */
  box-shadow: 0 0 0 3px hsla(var(--input-focus-h), var(--input-focus-s), calc(var(--input-focus-l) +
          40%), 0.8);
}
```

Note that we've now added a new context for our contrast, which is the `:focus` border vs. the `:focus` `box-shadow`, so ensure the computed difference for your chosen colors is at least 3:1 if using this method.

Optionally, jump back up to the `.input` rule and add a `transition` to animate the `box-shadow`:

```css
.input {
  /* ...existing styles */
  transition: 180ms box-shadow ease-in-out;
}
```

Finally, we don't want to forget Windows High Contrast mode which will not see the `box-shadow` or be able to detect the border color change. So, we include a transparent outline for those users:

```css
.input:focus {
  outline: 3px solid transparent;
}
```

> We also use this technique in the episode covering [button styles](https://moderncss.dev/css-button-styling-guide/).

Here's a gif demo of focusing into the text input:

![keyboard focusing into and out of the text input](https://dev-to-uploads.s3.amazonaws.com/i/jqawfxgvv2lb2x6f0q3w.gif)

And here's the appearance for the `readonly` field, since it has a different `border-style`:

![the readonly field when focused](https://dev-to-uploads.s3.amazonaws.com/i/lg358oqeytrd8kdnokwo.png)

In the CodePen HTML, there is a comment with an example of using an inline style to define an updated visual such as for an error state. Again, keep in mind that we are _lightening_ the provided `--input-focus-l` value by 40%, _and_ the focused border color must be at least 3:1 contrast against the unfocused color, so consider that when you alter the CSS variable values.

## Input Mode and Autocomplete

There are two aditional attributes that can help improve the user experience, particularly on mobile, in addition to using the correct input type (ex: email).

The first is defining the `inputmode`, which provides an altered keyboard or keypad that better matches the expected data. [Read up on available `inputmode` values on MDN >](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)

Second is `autocomplete` which has far more options than `on` or `off`. For example, I always appreciate that on iPhone when Google sends me a confirmation code by text the keyboard "just knows" what that value is. Turns out, that's thanks to `autocomplete="one-time-code"`!

[Check out the full list of `autocomplete` values](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) that allow you to hint at the value expected and really boost the user experience of your forms for users that make use of auto-filling values.

## Demo

First, here's a final look at our solution across (from left) Chrome, Safari, and Firefox. The file input still sticks out a bit when viewed side by side, but in the flow of a form on an individual browser it's definitely acceptable.

![final input and textarea styles across the aforementioned browsers](https://dev-to-uploads.s3.amazonaws.com/i/c05aw0mbb7ndptdn794z.png)

Here is the solution with all the field types we covered represented.

{% codepen "KKzqEzz" %}
