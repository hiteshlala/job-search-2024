/* 
Here's the task: you've been given a 2D array consisting of individual 
cells, each holding a unique integer value. Your goal is to create a 
function that will traverse this matrix, starting at the bottom-right cell. 
From there, you'll travel up to the top of the same column, then move left 
to the next column, and then continue downward from the top of this new 
column. After reaching the bottom of the column, you again move left and 
start moving upward. This unique traversal pattern will be performed until 
all the cells have been visited.
*/

function traverseZigZag(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  let dir = 1;
  for(let c = cols-1; c >= 0; c--) {
    dir = dir > 0 ? -1 : 1;
    let r = dir > 0 ? 0 : rows - 1;
    for(; dir > 0 ? (r < rows) : r >= 0; r += dir ) {
      console.log(matrix[r][c]);
    }
  }
}

// testing/verifying
// const matrix = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12]
// ];
// traverseZigZag(matrix);


// =========================================================================================

/*
  given a binary tree write functions:
  - that traverses in depth first and calls a processing function on each node (depthFirst)
  - that traverses in breadth first and calls a processing function on each node (breadthFirst)
  - that finds the max sum from root to leaf, returning 0 if tree is empty (maxSum)
*/

class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function depthFirst(tree, cb) {
  cb(tree.value);
  if (tree.left !== null) {
    depthFirst(tree.left, cb);
  }
  if (tree.right !== null) {
    depthFirst(tree.right,cb);
  }
}

function breadthFirst(tree, cb) {
  let ordered = [tree];
  do {
    let curr = ordered.shift();
    cb(curr.value);
    if (curr.left) {
      ordered.push(curr.left);
    }
    if (curr.right) {
      ordered.push(curr.right);
    }
  } while(ordered.length > 0);
}

function maxSum1(tree) {
  if (!tree) return 0;

  let max = Number.NEGATIVE_INFINITY;
  function add(tree, sum = 0) {
    sum += tree.value;
    if (tree.left === null && tree.right === null) {
      if (sum > max) { max = sum; }
    }
    if (tree.left) {
      add(tree.left, sum);
    }
    if (tree.right) {
      add(tree.right, sum);
    }
  }
  add(tree);
  return max;
}

function maxSum(tree) {
  if (!tree) return 0;

  if (!tree.right) {
    return tree.value + maxSum(tree.left);
  }

  if (!tree.left) {
    return tree.value + maxSum(tree.right);
  }

  return tree.value + Math.max(maxSum(tree.left), maxSum(tree.right));
}

const tree1 = new TreeNode(5,
  new TreeNode(4,
    new TreeNode(-80),
    new TreeNode(-60)
  ),
  new TreeNode(10,
    new TreeNode(-90)
  )
);

const tree2 = new TreeNode(17,
  new TreeNode(3,
    new TreeNode(2)
  ),
  new TreeNode(-10,
    new TreeNode(16),
    new TreeNode(1,
      new TreeNode(13)
    )
  )
);

depthFirst(tree1, console.log);
console.log();
depthFirst(tree2, console.log);
console.log();
breadthFirst(tree1, console.log);
console.log();
breadthFirst(tree2, console.log);
console.log();
console.log(maxSum(tree1));
console.log();
console.log(maxSum(tree2));
console.log();
console.log(maxSum(new TreeNode(5)));