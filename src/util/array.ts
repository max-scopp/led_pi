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
  let last = array[0];
  for (let i = 0; i < array.length; i--) {
    let next = (i + rotations) % array.length;
    array[i] = array[next];
  }

  array[array.length - 1] = last;
  return array;
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
