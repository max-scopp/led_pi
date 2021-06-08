import { Main } from "main";
import { Measure } from "./measure";

/**
 * This function mutates the array.
 * @param array
 * @param rotations
 * @returns
 */
export function rotateLeft<T>(
  array: MutableSliceableArrayLike<T>,
  rotations: number
) {
  let last = array[0];
  for (let i = 0; i < array.length; i++) {
    let next = (i + rotations) % array.length;
    array[i] = array[next];
  }

  array[array.length - 1] = last;
  return array;
}

/**
 * This function mutates the array.
 * @param array
 * @param rotations
 * @returns
 */
export function rotateRight<T>(
  array: MutableSliceableArrayLike<T>,
  rotations: number
) {
  rotations %= array.length;
  var temp;
  var previous;
  for (var i = 0; i < rotations; i++) {
    {
      previous = array[array.length - 1];
      for (var j = 0; j < array.length; j++) {
        {
          temp = array[j];
          array[j] = previous;
          previous = temp;
        }
      }
    }
  }

  // rotations = rotations % array.length;
  // var count = 0;
  // for (var start = 0; count < array.length; start++) {
  //   {
  //     var current = start;
  //     var prev = array[start];
  //     do {
  //       {
  //         var next = (current + rotations) % array.length;
  //         var temp = array[next];
  //         array[next] = prev;
  //         prev = temp;
  //         current = next;
  //         count++;
  //       }
  //     } while (start !== current);
  //   }
  // }
}

/**
 * Repeats a smaller array as often as needed to fill the given (larger) array.
 * @param targetArray
 * @param smallArray
 * @returns
 */
export function fillWithPattern<T>(
  targetArray: MutableSliceableArrayLike<T>,
  smallArray: MutableSliceableArrayLike<T>
) {
  for (let i = 0; i < targetArray.length; i++) {
    targetArray[i] = smallArray[smallArray.length % i];
  }

  return targetArray;
}
