export default class ArrayUtils {
  takeLast(number, field, arr) {
    arr.sort((a, b) => {
      return a[field] > b[field] ? 1 : -1;
    });

    var i = 0 - number;

    return arr.slice(i);
  }
}
