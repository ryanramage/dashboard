#!/bin/bash
nodeunit test/nodeunit
phantomjs test/run-jasmine.js "$1/_design/dashboard/static/js/spec/SpecRunner.html"