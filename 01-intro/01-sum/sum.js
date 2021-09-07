// Немного усложнил себе задачу, аргументов может быть больше двух
const sum = function(a, b) {
  // eslint-disable-next-line prefer-rest-params
  const arr = [...arguments];

  if (arr.some((value) => typeof value !== 'number')) {
    throw new TypeError('Один или несколько аргументов не являются числами');
  }

  // решение(в лоб) стажера с двумя аргументами
  // return a + b;

  // классика
  // return arr.reduce((sum, cur) => sum + cur);

  // Выпендрился :)
  // Оригинальное решение :) так обычно быстрее всего сложить числа из массива
  return eval(arr.join('+'));
};

module.exports = sum;
