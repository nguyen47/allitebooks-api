var express = require('express');
var router = express.Router();

/**
 * Import node-fetch and cheerio
 */
var fetch = require('node-fetch');
var cheerio = require('cheerio');


// url: http://www.allitebooks.com/?s=php
var url = 'http://www.allitebooks.com/?s=';
// page 2: http://www.allitebooks.com/page/2/?s=php

function searchEbooks(query) {
    return fetch(`${url}${query}`)
        .then(res => res.text())
        .then(body => {
            const ebooks = [];
            const $ = cheerio.load(body);
            $('article').each(function(i, element) {
                const $element = $(element);
                const $title = $element.find('.entry-title a');
                const $image = $element.find('.attachment-post-thumbnail');
                const $description = $element.find('.entry-summary');
                const authors = [];
                $(element).find('.entry-author a').each(function(i, element) {
                    author = $(element).text();
                    authors.push(author);
                });
                const ebook = {
                    image: $image.attr('src'),
                    title: $title.text(),
                    description: $description.text(),
                    authors: authors,
                }
                ebooks.push(ebook);
            });
            return ebooks;
        });
}

router.get('/', function(req, res, next) {
    res.json({
        message: "Running ... "
    });
});

router.get('/search/:title', function(req, res, next){
    searchEbooks(req.params.title)
    .then(ebooks => {
        res.json(ebooks);
    });
});

module.exports = router;