// Немного усложнил себе задачу, аргументов может быть больше двух
const sum = (...args) => {
  if (args.some((value) => typeof value !== 'number')) {
    throw new TypeError('Один или несколько аргументов не являются числами');
  }

  // решение(в лоб) стажера с двумя аргументами
  // return a + b;

  // классика
  // return args.reduce((sum, cur) => sum + cur);

  // Выпендрился :)
  // Оригинальное решение :) так обычно быстрее всего сложить числа из массива
  return eval(args.join('+'));
};

module.exports = sum;
