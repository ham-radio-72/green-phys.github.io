---
title: Contribution policy
weight: 5
icon: thumb-up
---

Contribution to any part of the Green project is open for every user.

There are three options to contribute
  - [Submit an issue](#submit-an-issue) on github
  - [Propose changes](#contributing-to-green) in the code via pull-request (PR)
  - [Writing Documentation](#writing-documentation)


## Submit an issue

If you found a bug or want new feature to be implemented, each Green project
has an `Issue` tab where you can submit related information. There are two templates,
one for Bug reports and one for a new feature requests. Please try to 
put a detailed and reproducible description.


## Contributing to Green

Ongoing development happens in the `devel` branch for all `Green` projects.

Commits should be small and atomic. A commit is atomic when, after it is
applied, the codebase, tests and all, still work as expected. Small
commits are also preferred, as they make later operations with git history,
whether it is bisecting, reverting, or something else, easier.

When addressing review comments in a PR, please do not rebase/squash the
commits immediately. Doing so makes it harder to review the new changes,
slowing down the process of merging a PR. Instead, when addressing review
comments, you should append new commits to the branch and only squash
them into other commits when the PR is ready to be merged.

### Writing code

If want to contribute code, this section contains some simple rules
and tips on things like code formatting, code constructions to avoid,
and so on.

#### **C++ standard version**

All `Green` projects currently target C++17 as the supported C++ version.
Please avoid features from higher language versions.


#### **Formatting**

To make code formatting simpler for the contributors, each `Green` project provides
its own config for `clang-format`.

#### **New source file template**

If you are adding new source file, there is a template you should use.
Specifically, every source file should start with the MIT copyright header:
```cpp
/*
 * Copyright (c) <Year> <copyright holders>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * software and associated documentation files (the “Software”), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, 
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
 * permit persons to whom the Software is furnished to do so, subject to the following 
 * conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
```
Please adjust the year in the copyright header and enter the name of the copyright holders.


The include guards for header files should follow the pattern `{PROJECT}_{FILENAME}_H`.
This means that for the file `new_feature.h` in the project `green-sc`, the include guard should
be `SC_NEW_FEATURE_H`, for `another_feature.h` in project `green-mbpt`, the include
guard should be `MBPT_ANOTHER_FEATURE_H`, and so on.


### Testing your changes

All `Green` projects are automatically tested in our CI environment.
If you propose new changes to the code, please implement tests that show that
these changes work as intended. 

We understand that not all tests can be written as plain unit tests. 
For example, checking self-consistent iterations requires running small simulations.
This is better done as an integration test. 

`Green` unit and integration tests are written using the Catch2 framework, 
and called via the command `make test` once the code is built.

## Writing documentation

If you have added new features to `Green` projects, please document them, 
so that other people can use them as well. If you found some feature that has 
not been properly documented, you are welcome to let us know and propose a feature description.

The main documentation for all `Green` projects is located at [Green web-site](https://green-phys.org).
We use the [Hugo](https://github.com/gohugoio/hugo) framework with the [relearn](https://github.com/McShelby/hugo-theme-relearn) theme.
All documentation uses the MarkDown format.


### Contents

* Usage examples are good. However, having large code snippets inline
can make the documentation less readable, and so the inline snippets
should be kept reasonably short.

* Don't be afraid to introduce new pages. This will avoid long pages in the documentation
which may make the documentation unfocused.

* When adding information to an existing page, please try to keep the 
formatting, style and changes consistent with the rest of the page.


## Code of Conduct

This project has a [Code of Conduct](https://github.com/Green-Phys/green-mbpt?tab=coc-ov-file#readme). Please adhere to it while contributing to `Green`.


