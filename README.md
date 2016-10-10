# es6-sample-project

[![NPM](https://nodei.co/npm/es6-sample-project.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/es6-sample-project/)

An ES6 sample project using [Rollup](https://github.com/rollup/rollup), [Bublé](https://buble.surge.sh/guide/#what-is-buble) (as a plugin), [Sass (node-sass)](https://github.com/sass/node-sass/).

This package shows how to get started writing ES6 modules. The workflow is like this:

![es6 flowchart](https://raw.githubusercontent.com/jonataswalker/es6-sample-project/images/images/es6-project-flowchart.png)

### Why?
Because all these tools and how they fit together can be scary at the beginning.

### Usage
```
$ git clone git@github.com:jonataswalker/es6-sample-project.git
$ cd es6-sample-project
$ npm install
```

### Available tasks

###### Build (js && css) and Watch (for changes)
`$ make build-watch`

###### Build (js && css)
`$ make build`

###### Build JavaScript
`$ make build-js`

Includes `make bundle-js` `make lint` `make uglifyjs` `make add-js-header`

###### Build CSS
`$ make build-css`
Includes `make compile-sass` `make prefix-css` `make cleancss` `make add-css-header`

### Why Makefile?
Because it's just great.

### Missing Tests?
For the sake of simplicity.

### Final result
See [here a demo](http://rawgit.com/jonataswalker/es6-sample-project/master/examples/example.html).
