---
title: "Pure CSS Shapes 3 Ways"
topics: Design,Pseudo Elements
episode: 22
description: "Modern CSS and modern browser support provides us three excellent methods to create pure, basic CSS shapes. We'll look at making CSS triangles with borders, linear gradients, and `clip-path`."
templateEngineOverride: njk, md
date: 2020-11-15
---

Modern CSS - and modern browser support - provides us three excellent methods to create pure, basic CSS shapes. In this tutorial, we will examine how to create CSS triangles using:

- borders
- linear gradients
- `clip-path`

{% carbonAd %}

## Method 1: Borders

This is the first trick I learned to create CSS triangles, and it's still a solid standby.

Given a zero width and zero height element, any values provided `border` directly intersect and are the only visible indication of an element. This intersection is what we can take advantage of to create a triangle shape.

To illustrate how this works, we'll supply a different border color to each side:

```css
.triangle {
  border: 10px solid blue;
  border-right-color: red;
  border-bottom-color: black;
  border-left-color: green;
}
```

Which produces the following, in which you can see we've essentially already achieved 4 triangle shapes:

![result of the previously defined CSS rule showing 4 triangles due to the border colors](https://dev-to-uploads.s3.amazonaws.com/i/87uek6hvhhb8t9anzdq9.png)

In order to create this as a single triangle instead, we first decide which direction we want the triangle pointing. So, if we want it pointing to the right, similar to a "play" icon, we want to keep the left border visible. Then, we set the colors of the other borders to `transparent`, like so:

```css
.triangle {
  border: 10px solid transparent;
  border-left-color: blue;
}
```

In the demo image below, I've added a red `outline` to see the bounding box so we can discuss some improvements.

![a blue triangle shape pointing to the right with a red outline to show the bounding box](https://dev-to-uploads.s3.amazonaws.com/i/16idiqp96hp2uynw4zwd.png)

One improvement we can make is to remove width of the right border to prevent it being included in the total width of the element. We can also set unique values for top and bottom to elongate the triangle visual. Here's a compact way to achieve these results:

```css
.triangle {
  border-style: solid;
  border-color: transparent;
  /* top | right | bottom | left */
  border-width: 7px 0 7px 10px;
  border-left-color: blue;
}
```

As seen in the updated image below, we first assign a solid, transparent border. Then we define widths such that the top and bottom are a smaller value than the left to adjust the aspect ratio and render an elongated triangle.

![final triangle](https://dev-to-uploads.s3.amazonaws.com/i/0p5n46utvytk2np0uc8h.png)

So to point the triangle a different direction, such as up, we just shuffle the values so that the _bottom_ border gains the color value and the _top_ border is set to zero:

```css
.triangle {
  border-style: solid;
  border-color: transparent;
  /* top | right | bottom | left */
  border-width: 0 7px 10px 7px;
  border-bottom-color: blue;
}
```

Resulting in:

![demo of the CSS triangle pointing upwards](https://dev-to-uploads.s3.amazonaws.com/i/hxiym0rl9k9ygzshnscn.png)

Borders are very effective for triangles, but not very extendible beyond that shape without getting more elements involved. This is where our next two methods come to the rescue.

## Method 2: `linear-gradient`

CSS gradients are created as `background-image` values.

First let's set our stage, if you will, by defining box dimensions and preventing `background-repeat`:

```css
.triangle {
  width: 8em;
  height: 10em;
  background-repeat: no-repeat;
  /* Optional - helping us see the bounding box */
  outline: 1px solid red;
}
```

Following that, we'll add our first gradient. This will create the appearance of coloring half of our element blue because we are creating a hard-stop at 50% between blue and a transparent value.

```css
background-image: linear-gradient(45deg, blue 50%, rgba(255, 255, 255, 0) 50%);
```

Now, if our element was square, this would appear to cut corner to corner, but we ultimately want a slightly different aspect ratio like we did before.

![progress of adding the first gradient showing a partly blue element but not yet a triangle](https://dev-to-uploads.s3.amazonaws.com/i/guscw9fd5wf7xfgkteje.png)

Our goal is to create a triangle with the same appearance as when using our border method. To do this, we will have to adjust the `background-size` and `background-position` values.

The first adjustment is to change the `background-size`. In shorthand, the first value is width and the second height. We want our triangle to be allowed 100% of the width, but only 50% of the height, so add the following:

```css
background-size: 100% 50%;
```

With our previous `linear-gradient` unchanged, this is the result:

![updated triangle resized with background-size showing an odd shape in the upper left of the bounding box](https://dev-to-uploads.s3.amazonaws.com/i/cb3cqq4h57jupkza659i.png)

Due to the `45deg` angle of the gradient, the shape appears a bit strange. We need to adjust the angle so that the top side of the triangle appears to cut from the top-left corner to the middle of the right side of the bounding box.

I'm not a math wizard, so this took a bit of experimentation using DevTools to find the right value 😉

Update the `linear-gradient` value to the following:

```css
linear-gradient(32deg, blue 50%, rgba(255,255,255,0) 50%);
```

And here's our progress - which, while technically a triangle, isn't quite the full look we want:

![progress of completing one side of the triangle](https://dev-to-uploads.s3.amazonaws.com/i/48gy0u5kf6pmp4uofkmw.png)

While for the border trick we had to rely on the intersection to create the shapes, for `linear-gradient` we have to take advantage of the ability to add multiple backgrounds to layer the effects and achieve our full triangle.

So, we'll duplicate our `linear-gradient` and update it's degrees value to become a mirror-shape of the first, since it will be positioned below it. This results in the following for the full `background-image` definition:

```css
background-image: linear-gradient(32deg, blue 50%, rgba(255, 255, 255, 0) 50%), linear-gradient(148deg, blue
      50%, rgba(255, 255, 255, 0) 50%);
```

But - we still haven't quite completed the effect, as can be seen in the progress image:

![the second linear-gradient triangle is overlapping the first](https://dev-to-uploads.s3.amazonaws.com/i/l57qenjmriispnhko0nm.png)

The reason for the overlap is because the default position of both gradients is `0 0` - otherwise known as `top left`. This is fine for our original gradient, but we need to adjust the second.

To do this, we need to set multiple values on `background-position`. These go in the same order as `background-image`:

```css
background-position: top left, bottom left;
```

And now we have our desired result:

![final triangle created with CSS gradients](https://dev-to-uploads.s3.amazonaws.com/i/ylmk416mow1c48yrj1hb.png)

The downside of this method is that it's rather inflexible to changing aspect ratio without also re-calculating the degrees.

However, CSS gradients can be used to create more shapes especially due to their ability to be layered to create effects.

> For a master class in CSS gradients for shapes and full illustrations, check out [A Single Div](https://a.singlediv.com/) by Lynn Fisher

{% newsletterPromo %}

## Method 3: `clip-path`

This final method is the slimmest and most scalable. It is currently [slightly lagging in support](https://caniuse.com/mdn-css_properties_clip-path_html) so be sure to check our own analytics to determine if this is an acceptable solution.

Here's our starting point for our element, which is box dimensions and a `background-color`:

```css
.triangle {
  width: 16px;
  height: 20px;
  background-color: blue;
}
```

The concept of `clip-path` is that you use it to draw a polygon shape (or circle, or ellipse) and position it within the element. Any areas outside of the `clip-path` are effectively not drawn by the browser, thus "clipping" the appearance to just the bounds of the `clip-path`.

> To illustrate this more, and to generate your desired `clip-path` definition, check out the online generator: [Clippy](https://bennettfeely.com/clippy/)

The syntax can be a bit more difficult to get used to, so I definitely suggest using the generator noted above to create your path.

For our purposes, here's a triangle pointing to the right:

```css
clip-path: polygon(0 0, 0% 100%, 100% 50%);
```

With a `clip-path`, you are defining coordinates for every point you place along the path. So in this case, we have a point at the top-left (`0 0`), bottom-left (`0% 100%`), and right-center (`100% 50%`).

And here is our result:

![completed triangle using clip-path](https://dev-to-uploads.s3.amazonaws.com/i/we4fhuugu4dp2kvpt9ym.png)

While `clip-path` is very flexible for many shapes, and also the most scalable due to adapting to any bounding box or aspect ratio, there are some caveats.

When I mentioned the browser doesn't draw anything outside of the bounding box, this includes borders, `box-shadow`, and `outline`. Those things are not re-drawn to fit the clipped shape. This can be a gotcha, and may require additional elements or moving of effects to a parent to replace the lost effects.

> Here's [an egghead video by Colby Fayock](https://egghead.io/lessons/css-add-a-cutout-notch-to-an-html-element-with-a-css-polygon-clip-path?af=2s65ms) to better understand `clip-path` and how to bring back effects like `box-shadow`

## Demo

This demo shows our three ways to create a CSS triangle, which is added to each element using `::after` and makes use of viewport units to be responsive.

{% codepen "oNLVvgX" %}
