# Writing Guide for Redpoint Games Documentation

## Running the documentation server

You can start the documentation server with:

```
gulp serve
```

To run without running the spellchecker first:

```
gulp serve-no-spellcheck
```

Sometimes you need to restart the server to get a full rebuild, as changes that reference across files don't necessarily rebuild all the dependent files (e.g. if you link to page A from page B, and you change the title of page A, you won't necessarily see the page title change in the link on page B).

If you get `command not found: gulp` or some equivalent, you need to install the prerequisite tools:

* [Node.js](https://nodejs.org/en/) for Windows
* [Yarn Package Manager](https://yarnpkg.com/en/)

Once Node.js is installed, open a new command-line and run:

```
npm i -g gulp-cli
yarn
```

## Don't use HTML

Don't use HTML in documentation pages. Use Markdown and shortcodes instead.

## Use linkref to add links to internal documentation

Instead of manually adding links with `[blah](../some/url)` to link to content, use the `linkref` shortcode instead:

```
{{< linkref "/rsi/blah.md" >}}
```

## Use readref to add links in "Further reading"

In the Further reading sections, make sure you use the `readref` shortcode:

```
* {{< readref "/rsi/blah.md" >}}
```

## Use brand to reference products

When you want to reference the name of a Redpoint Games product, use:

```
{{< brand "name" >}}
```

where `name` is one of the product IDs listed in `data/products.json`.

You should **almost never** write a product name manually in text. The exception to this rule is page titles and descriptions in the frontmatter (`---`) section, where shortcodes are not supported.

## Refer to other documentation pages as a noun, rather than a branching reference

When linking to other pages, the surrounding context should be such that the link is treated as a noun. For example:

```
To get started with {{< brand "rsi" >}}, see {{% linkref "/rsi/quickstart/_index.md" %}}.
```

rather than:

```
You'll need to {{% linkref "/rsi/quickstart/_index.md" %}} to get started with {{< brand "rsi" >}}.
```

Most page titles start with a capital letter, so if you try to use links as adjectives or part of sentences, it probably won't read or sound right.

## Documents and pages should be named with dashes instead of underscores

All new pages should be named like this:

```
doing-some-thing.md
```

instead of:

```
doing_some_thing.md
```

## Buttons and UI elements should be addressed directly

Correct:

```
Click **Some Text**.
```

instead of:

```
Click the **Some Text** button.
```

## There should only be one Quickstart

There should only be one Quickstart per product. Quickstarts are designed to be an immediate resource people can reference, without having to make decisions.

## Quickstart should do the absolute minimum to demonstrate functionality

A quickstart should aim to get the user working with the system as quickly as possible. This means reducing or minimising any "Before you begin" requirements and just aiming to do the minimally **useful** thing with the system.

There's no need to go into depth beyond achieving this minimum useful demo, you can link to how-to guides that expand on this in the Further reading section.

## How-to guides should flow naturally

How-to guides should flow naturally and walk the user through what they're doing.

Rather than focusing a how-to guide around a concept or an object in a product (for example "Using XYZ"), they should be objective based. Think about _"What problems are people trying to solve by using the product?"_, then try to write how-to guides that address those problems.

## Concept documents should explain the abstract, outside of context

In contrast to how-to guides, concepts are designed to explain the abstract out-of-context of solving a particular problem. They don't necessarily need to align with a concrete object in the product.

Think about _"What components make up this product or does this product rely on?"_ and then try to see if there are interesting notes or details about how those components relate. If there's a level of depth to the concept that provides additional insight outside of the obvious, then it might be a good candidate for a Concept document.

## Find work to do by searching for "todo"

You can find pages that need work done on them by searching "todo". The system won't deploy any pages out to production until all the "todo"s have been resolved.

## Run the spell checker

You can run the spellchecker on the system by running:

```
gulp spellcheck
```

The spellchecker **MUST** pass in order for documentation to deploy.

Please note the spellchecker doesn't validate grammar. For that you'll need to use the Visual Studio Code LanguageTool extension.