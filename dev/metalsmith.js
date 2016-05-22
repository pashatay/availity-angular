'use strict';

const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const prism = require('metalsmith-prism');
const marked = require('marked');
const markdown = require('metalsmith-markdown');
const inPlace = require('metalsmith-in-place');
const mock = require('metalsmith-mock');
const permalinks = require('metalsmith-permalinks');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const path = require('path');
const collections = require('metalsmith-collections');
const filter = require('metalsmith-filter');
const relative = require('metalsmith-rootpath');

const dataMarkdown = require('./plugins/metalsmith-data-markdown');
const slug = require('./plugins/nunjucks-slug');
const tocify = require('./plugins/metalsmith-tocify');
const Logger = require('./logger');

const pkg = require('../package.json');

const markedOptions = {
  langPrefix: 'language-',
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true
};

nunjucksDate
  .setDefaultFormat('YYYY');

const env = nunjucks.configure('examples/layouts', {watch: false, noCache: true});
env.addFilter('year', nunjucksDate);
env.addFilter('slug', slug.slugify);

function build() {

  return new Promise((resolve, reject) => {

    const metalsmith = new Metalsmith(path.join(process.cwd(), 'examples'));

    metalsmith
      .metadata({
        site: {
          title: 'Availity Angular'
        },
        today: new Date(),
        pkg
      })
      .ignore('**/.DS_Store')
      .source(path.join(process.cwd(), 'examples', 'content'))
      .use(markdown(markedOptions))
      .use(dataMarkdown({
        selector: '[data-markdown]'
      }))
      .use(prism({
        decode: true
      }))
      .use(mock())
      .use(collections({
        pages: {
          pattern: 'pages/**/*.html',
          reverse: false
        },
        components: {
          pattern: 'components/**/*.html',
          sortBy: 'title',
          refer: false
        },
        examples: {
          pattern: 'examples/**/*.html',
          sortBy: 'title',
          reverse: true,
          refer: false
        },
        javascript: {
          pattern: 'javascript/**/*.html',
          sortBy: 'title',
          reverse: true,
          refer: false
        }
      }))
      .use(permalinks({
        relative: false
      }))
      .use(relative())
      .use(inPlace({
        engine: 'nunjucks',
        partials: 'layouts/partials'
      }))
      .use(tocify({selector: '.docs-section-header, .docs-subsection-title'}))
      .use(layouts({
        engine: 'nunjucks',
        directory: 'layouts'
      }))
      .use(filter(['index.html', 'pages/**/*.html', 'examples/**/*.html']))
      .destination(path.join(process.cwd(), 'build'));

    metalsmith.build( (err) => {

      if (err) {
        reject(err);
      } else {
        Logger.ok('metalsmith');
        resolve();
      }

    });

  });

}

module.exports = build;