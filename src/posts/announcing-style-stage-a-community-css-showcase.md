---
title: "Announcing Style Stage: A Community CSS Showcase"
topics: Design,Layout,Responsive Design,Resources
episode: 17
description: "Learn about Style Stage - an opportunity to challenge both your CSS and web design skills while learning in public. A CSS playground open to contributors of all skill levels!"
templateEngineOverride: njk, md
date: 2020-07-10
---

Dear CSS community:

I invite you to participate in a new project where you have the opportunity to challenge both your CSS and web design skills while learning in public.

![Style Stage: A modern CSS showcase styled by community contributions](https://dev-to-uploads.s3.amazonaws.com/i/1wnz0c4yyqq03vfrhds1.png)

## About Style Stage

[StyleStage.dev](https://stylestage.dev) is not just an informational landing page about the project - it is the foundational HTML which is intended to be restyled by contributors - like you!

Style Stage started as a wild idea to reanimate the spirit of
[CSS Zen Garden](http://www.csszengarden.com/) which was created by [Dave Shea](http://daveshea.com/projects/zen/) and that provided a demonstration of "what can be accomplished through CSS-based design" until submissions stopped in 2013.

Things in CSS-land have improved a lot since then, including the available properties, the tools we have available to build with, our greater understanding of addressing accessibility concerns, and increased awareness of performance impacts.

> If you missed the launch live stream, here's the lightly edited [full recorded Twitch broadcast](https://youtu.be/O2hLsVX5eN0), or by topic in [the Twitch highlight collection](https://www.twitch.tv/collections/CZgljEORIBZLxg). We covered a lot of the things in this article plus more about CSS, and concluded by building a new 11ty feature ✨.

## Why Do We Need This?

There's a growing tendency to choose a framework when what would best serve a project is using CSS in its natural state and becoming one with the [cascade](https://dev.to/5t3ph/intro-to-the-css-cascade-the-c-in-css-1kh0).

Creating your Style Stage stylesheet will challenge you to explore techniques like flexbox and grid to arrange the page, and pseudo elements to add extra content and flair. Take the opportunity to design something crazy! So far, gradients and `transform: skew()` are popular with contributors ✨ Check out the [list of other modern features](https://stylestage.dev/#about) for inspiration of what you may like to try.

By prohibiting access to the HTML (which is already semantic and accessible on its own), Style Stage encourages you to get creative while re-familiarizing yourself with the basics. And in this otherwise fast-paced industry, I see that as a major positive.

Play is a powerful teacher! How far can you push the boundaries while staying accessible and performant? These are skills worth practicing that will equip you to choose the right tool for the job in future projects. Even if the right tool is a framework, you will have a deeper understanding of _how_ styles you apply are working and improve your ability to customize them.

Trust me - it feels good to say: "I can do that in CSS!"

For a growing list of tips, ideas, and inspiration, [view the resources](https://stylestage.dev/resources/).

[Subscribe to the newsletter](https://stylestage.dev/subscribe/) for periodic updates related to new styles and release of new features. You can also pick up the [RSS feed](https://stylestage.dev/feed/).

## How Do I Contribute a Stylesheet?

Review [StyleStage.dev](https://stylestage.dev/) for expanded details, as well as the source HTML and CSS.

By participating as a contributor, your work will be shared with your provided attribution as long as Style Stage is online, your stylesheet link and any asset links remain valid, and all contributor guidelines are adhered to.

[Review the steps to contribute >](https://stylestage.dev/#contribute)

### Guidelines TL;DR

All submissions will be minified, autoprefixed, and prepended with the [CC BY-NC-SA license](https://creativecommons.org/licenses/by-nc-sa/3.0/) as well as attribution using the metadata you provide. You may use any build setup you prefer, but the final submission should be the compiled, unminified CSS. You retain the copyright to original graphics and must ensure all graphics used are appropriately licensed. All asset links, including fonts, must be absolute to external resources. Stylesheets will be saved into the Github repo, and detected changes that violate the guidelines are cause for removal.

Ensure your design is responsive, and that it passes accessible contrast (we'll be using aXe to verify). Animations should be removed via `prefers-reduced-motion`. Cutting-edge techniques should come with a fallback if needed to not severely impact the user experience. No content may be permanently hidden, and hidden items must come with an accessible viewing technique. Page load time should not exceed 3 seconds.

[Review the full guidelines >](https://stylestage.dev/guidelines/)

## (Possible) Future Features

- **dark mode toggle** - optionally opt into a toggle to improve the user experience by allowing them to choose which theme to display rather than relying on `prefers-color-scheme` values alone
- **style index preview images** - to improve the experience of browsing available styles

## Credits

Big thanks to [Andy Bell (@hankchizljaw)](https://twitter.com/hankchizljaw) for his extra time reviewing the foundations of the project, and being an early promotor! 💫

Thanks also to [Miriam Suzanne (@MiriSuzanne)](https://twitter.com/MiriSuzanne) for some great feedback and ideas about how to evolve the project 🚀

The project description and guidelines were made more clear by suggestions from [Katie Langerman (@KatieLangerman)](https://twitter.com/KatieLangerman) 🙌

And of course the original six contributors - thanks so much for helping bring this project to life by spending time within a short deadline to create your awesome stylesheets!

## Some Stats

- The idea for Style Stage arose July 2, 2020 and the project launched July 10, 2020.
- Built on my favorite static site generator, [11ty](https://11ty.dev) beginning from a starter I developed
- Hosted on [Netlify](https://www.netlify.com/)
- The Main Stage theme receives a 100 lighthouse and PageSpeed score, as well as a speed index of 0.502s 🙌

Here are the original 6 contributors:

- [Retroish](https://stylestage.dev/styles/retroish) by Jean Louise Tiston
- [Skewten](https://stylestage.dev/styles/skewten) by Donnie D'Amato
- [Purplify & Pastel](https://stylestage.dev/styles/purplify-and-pastel) by Dominic Duffin
- [Vaporwave](https://stylestage.dev/styles/vaporwave) by Shannon Crabill
- [Center Stage](https://stylestage.dev/styles/center-stage)by Katie Langerman
- [Queer Modes](https://stylestage.dev/styles/queer-modes) by Miriam Suzanne
