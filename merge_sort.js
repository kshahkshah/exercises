#!/usr/bin/env node --harmony

function mergeSort(array) {

  // console.log('Merge Sorting Array:');
  // console.log(array);

  var working_arrays = [];
  var sorted_array = [];
  var final_length = array.length;
  var next_item;

  // push each item into an Array of Arrays, the working array
  while(array.length > 0) {
    next_item = array.pop();
    working_arrays.push([next_item]);
  }


  // console.log("remaining: " + array.length)

  // now we have individual items like this:
  // [n], [n], [n], [n], [n], [n], [n], [n]
  // 
  // and we're going to iteratively make sorted arrays like this:
  // [n,n], [n,n], [n,n], [n,n]
  // 
  // then:
  // [n,n,n,n], [n,n,n,n]
  // 
  // and finally:
  // [n,n,n,n,n,n,n,n]
  // 

  var merged_array = [];

  // until the final, sorted array is of the expected length
  while(working_arrays.length > 0) {

    // pop sub-arrays of the working array
    var first_array = working_arrays.pop();
    var second_array = working_arrays.pop();

    // console.log('first array, length ' + first_array.length + ', items are : ' + first_array);
    // console.log('second array, length ' + second_array.length + ', items are : ' + second_array);

    while((first_array.length > 0) || (second_array.length > 0)) {

      // compare single items at a time, drawing inwards as we go
      var left_item = first_array[0];
      // console.log('left item: ' + left_item);
      var right_item = second_array[0];
      // console.log('right item: ' + right_item);

      // i prefer for clarity to handle these undefined states individually
      if (typeof left_item == 'undefined') {
        // console.log('pushing: ' + right_item);
        merged_array.push(second_array.shift());

      } else if (typeof right_item == 'undefined') {
        // console.log('pushing: ' + left_item);
        merged_array.push(first_array.shift());

      } else if (left_item < right_item) {
        // console.log('pushing: ' + left_item);
        merged_array.push(first_array.shift());

      } else {
        // console.log('pushing: ' + right_item);
        merged_array.push(second_array.shift());

      }

      // console.log('so far: '  + merged_array)
      // console.log("\n")

    }

    if (merged_array.length == final_length) {

    } else {
      working_arrays.unshift(merged_array);
      merged_array = [];
    }

  }

  return merged_array;
}

var rawInput = '';

process.stdin.resume();
process.stdin.on('data', function(chunk) { rawInput += chunk.toString() })
process.stdin.on('end', function() {
  console.log(mergeSort(rawInput.split(',').map(function(i){return Number(i)})));
});
