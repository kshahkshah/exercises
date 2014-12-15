#!/usr/bin/env node --harmony

function insertionSort(unsorted) {
  // empty array
  var sorted = [];

  // insert the first element
  sorted.push(unsorted.shift());

  // while there are elements in the unsorted array, pluck one
  for(var unsorted_number; unsorted_number = unsorted.shift();) {

    // then compare to values in our sorted array
    for(var i=0, length = sorted.length; i <= length; i++) {
      var sorted_number = sorted[i];

      // compare to the sorted number, insert there,
      // or at the end if this is the final run
      if ((sorted_number > unsorted_number) || (length == i)) {
        sorted.splice(i, 0, unsorted_number);

        // we can exit this iteration now...
        break
      }
    }
  }

  return sorted;
}

var rawInput = '';

process.stdin.resume();
process.stdin.on('data', function(chunk) { rawInput += chunk.toString() })
process.stdin.on('end', function() {
  console.log(insertionSort(rawInput.split(',').map(function(i){return Number(i)})));
});
