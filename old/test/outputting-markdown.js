var test = require('tape').test
var Renderer = require('../')
var linkify = require('noddity-linkifier')('').linkify
var testState = require('./helpers/test-state')
require('ractive').DEBUG = false

test('Embeds a template and spits out markdown', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'Check it out ::file2.md:: \n\n[^1]:	*Collected Sermons* volume 10, p. 310.\n')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date(), markdown: false }, 'lol yeah')

	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		renderer.renderMarkdown(post, function(err, html) {
			t.equal(html, 'Check it out lol yeah \n\n[^1]:	*Collected Sermons* volume 10, p. 310.\n')

			state.butler.stop()
			t.end()
		})
	})
})

test('Quote brackets on lines should not be escaped', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'Check it out ma\n\n> what is it son\n\nit\'s a quote ::file2.md::')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date(), markdown: false }, 'lol yeah\n\n> you know it')

	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		renderer.renderMarkdown(post, function(err, html) {
			t.equal(html, 'Check it out ma\n\n> what is it son\n\nit\'s a quote lol yeah\n\n&gt; you know it')

			state.butler.stop()
			t.end()
		})
	})
})