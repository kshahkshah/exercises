#!/usr/bin/env node --harmony

var files_in_cabinets = [10, 20, 30, 40, 50, 60, 70, 80, 90]
var number_of_workers = 3

var total_files = files_in_cabinets.reduce(function(accumulator, value) { return accumulator + value })

var ideal_files = total_files / number_of_workers

// return maximum number of files a worker would have to look through
// however, once they start a cabinet, they have to finish it, this is partioned

// so our goal is to minimize the real to the ideal

