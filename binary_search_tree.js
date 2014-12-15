#!/usr/bin/env node --harmony

var BinarySearchTree = function() {
  this.root  = null;
  this._size = 0;

  this.add = function(value) {

    var newNode = { value: value, left: null, right: null, duplicates: 0 }

    // easy
    if (this.root === null) {
      this.root = newNode;

    // requires traversal
    } else {
      var currentNode = this.root;

      while(true) {

        // go to right, loop or assign
        if (currentNode.value < newNode.value) {
          if (currentNode.right) {
            currentNode = currentNode.right;
          } else {
            currentNode.right = newNode;
            this._size++;
            break
          }
        // go to left, loop or assign
        } else if (currentNode.value > newNode.value) {
          if (currentNode.left) {
            currentNode = currentNode.left;
          } else {
            currentNode.left = newNode;
            this._size++;
            break
          }

        // duplicate
        } else {
          // don't increment size though
          currentNode.duplicates++;
          break
        }
      }
    }

    return this;
  }

  this.contains = function(value) {
    var found = false,
        currentNode = this.root;

    while(!found && currentNode) {
      if (currentNode.value > value) {
        currentNode = currentNode.left;
      }
      else if (currentNode.value < value) {
        currentNode = currentNode.right;
      }
      else {
        found = true;        
      }
    }

    return found;
  }

  this.remove = function(value) {

  }
}

var mytree = new BinarySearchTree();

mytree.add(7).add(2).add(4).add(9).add(12).add(6).add(5).add(14).add(11);
