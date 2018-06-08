var express = require('express');
var router = express.Router();

/**
 * Import node-fetch and cheerio
 */
var fetch = require('node-fetch');
var cheerio = require('cheerio');

// query URL
function getURL(page, search) {
    return url = 'http://www.allitebooks.com/page/' + page + '/?s=' + search;
}

/**
 * Load HTML from base url + search.
 * @param  {[type]} search [query to search]
 */
function searchEbooks(page, search) {
    return fetch(getURL(page, search))
        .then(res => res.text())
        .then(body => {
            const $ = cheerio.load(body);
            $('.main-content-inner').each(function(i, element) {
                var $element = $(element);
                $title = $(element).find('.entry-title a');
                console.log($title.text());
            });
        });
}

router.get('/', function(req, res, next) {
    res.send('API RUNNING');
});

router.get('/search/:title', function(req, res, next) {
    res.json(searchEbooks(1, req.params.title));
});

module.exports = router;