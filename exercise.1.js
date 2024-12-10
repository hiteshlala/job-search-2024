// given a string re-arrange them by flipping pairs
// '12345678' -> '21436587' for even length
// '123456789' -> '214365879' for odd
function parireverse(str) {
  let result = '';
  for(let i = 0; i < str.length; i += 2) {
    result += `${str.charAt(i+1)}${str.charAt(i)}`;
  }
  return result;
};

console.log('parireverse')
console.group();
console.log('12345678 ->', parireverse('12345678'), 'expect 21436587');
console.log('123456789 ->', parireverse('123456789'), 'expect 214365879');
console.groupEnd();
console.log();

// =========================================================================================

// given a number as a string '33344532444' reduce this by summing repeated numbers
//  '33344532444' -> '9853212'
// '888899942222245' -> '322741045' -> '34741045'
function reducerepeats(strnum) {
  let begNo = strnum;
  let endNo = strnum;
  let count = 0;
  do {
    count++;
    let currChar = begNo.charAt(0);
    let currSum = 0;
    let currNum = '';
    for( let i = 0; i < begNo.length; i++) {
      if(currChar === begNo.charAt(i)) {
        currSum += parseInt(begNo.charAt(i));
      } else {
        currNum = `${currNum}${currSum}`;
        currChar = begNo.charAt(i);
        currSum = parseInt(begNo.charAt(i));
      }
    }
    currNum = `${currNum}${currSum}`;

    begNo = endNo;
    endNo = currNum;
  } while(begNo !== endNo);
  return endNo;
}

console.log('reducerepeats')
console.group();
console.log('33344532444', reducerepeats('33344532444'), 'should be 9853212')
console.log('123456789', reducerepeats('123456789'), 'should be 123456789');
console.log('1112345678999', reducerepeats('1112345678999'), 'should be 3234567827');
console.log('511123456789995', reducerepeats('511123456789995'), 'should be 532345678275');
console.log('888899942222245', reducerepeats('888899942222245'), 'should be 34741045');
console.groupEnd();
console.log();

// =========================================================================================

// given a list of numbers find how many are rotationally equal
// rotational equal is like 5463 == 6354 with 2 rotations
function countrotations(numbers) {
  console.log('numbers', numbers);

  const rotateNum = (num) => {
    const strNum = `${num}`.split('');
    const first = strNum.shift();
    strNum.push(first);
    return parseInt(strNum.join(''))
  };

  const counts = {};
  
  numbers.forEach(num => {
    counts[`${num}`] = counts[`${num}`] || 0;

    const rotations = `${num}`.length;
    let rotatCount = 0;
    let currNum = num;

    do {
      const counted = {};

      for(let i = 0; i < numbers.length; i++) {
        if (currNum === numbers[i] && !counted[numbers[i]]) {
          counted[numbers[i]] = true;
          counts[`${num}`] = counts[`${num}`] + 1;
        }
      }
      currNum = rotateNum(currNum);
      rotatCount++;
    } while(rotatCount < rotations);

  });
  console.log('counts', counts);
}

console.log('countrotations')
console.group();
console.log(countrotations([123,231,321,45,6,77,679,976,796,769]));
console.groupEnd();
console.log();

// =========================================================================================

/* 
rotate matrix by 90 degress in place

Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]

Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
*/

function rotate(matrix) {
  /*
    assuming square matrix

    i,j   im = 3, jm = 3

    0,0  0,1  0,2  0,3   ==>  3,0  2,0  1,0  0,0
    1,0  1,1  1,2  1,3        3,1  2,1  1,1  0,1
    2,0  2,1  2,2  2,3        3,2  2,2  1,2  0,2
    3,0  3,1  3,2  3,3        3,3  2,3  1,3  0,3


    a solution discussion:
    https://www.enjoyalgorithms.com/blog/rotate-a-matrix-by-90-degrees-in-an-anticlockwise-direction

    (0,0) => (0,3)   (j, im - 1 - i)
    (0,1) => (1,3)
    (0,2) => (2,3)
    (0,3) => (3,3)
    (1,0) => (0,2)
    (1,1) => (1,2)
    (1,2) => (2,2)
    (1,3) => (3,2)
    (2,0) => (0,1)
    (2,1) => (1,1)
    (2,2) => (2,1)
    (2,3) => (3,1)
    (3,0) => (0,0)
    (3,1) => (1,0)
    (3,2) => (2,0)
    (3,3) => (3,0)
   */

    const makeEmptyMat = (size) => {
      const empty = [];
      for(let r = 0; r < size; r++) {
        empty.push([]);
        for(let c = 0; c < size; c++) {
          empty[r].push(null);
        }
      }
      return empty;
    }

  const rows = matrix.length;
  const cols = matrix.length; // square
  let result = makeEmptyMat(rows);

  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < cols; c++) {
      const v = matrix[c][r];
      result[r][cols -1 - c] = v;
    }
  }
  return result;
}

console.log('rotate')
console.group();
const matrix = [[1,2,3],[4,5,6],[7,8,9]];
console.table(matrix)
console.table(rotate(matrix));
// console.table(matrix)
console.log('---')
const matrix2 = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]];
console.table(matrix2)
console.table(rotate(matrix2));
// console.table(matrix2)
console.log('---')
const matrix3 = [[5,1,9,11,17],[2,4,8,10,18],[13,3,6,7,19],[15,14,12,16,20],[21,22,23,24,25]];
console.table(matrix3)
// rotate(matrix3)
console.table(rotate(matrix3));
// console.table(matrix3)
console.groupEnd()
console.log();

// =========================================================================================


function test([i,j], [im, jm]) {
  return [j, im -i];
}

[[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]].forEach(v => {
  console.log(v, test(v, [3,3]));
})

const makeEmptyMat = (size, fill) => {
  const empty = [];
  for(let r = 0; r < size; r++) {
    empty.push([]);
    for(let c = 0; c < size; c++) {
      empty[r].push(fill);
    }
  }
  return empty;
};
