const SORT_METHOD = {
  SELECTION: "Selection Sort",
  HEAP: "Heap Sort",
  QUICK: "Quick Sort",
};

const SEARCH_METHOD = {
  BINARY: "Binary Search",
  INTERPOLATION: "Interpolation Search",
};

const SIZE = {
  __0100__: 100,
  __001k__: 1000,
  __010k__: 10000,
  __030k__: 30000,
  __090k__: 90000,
  __100k__: 100000,
  __270k__: 270000,
  __810k__: 810000,
};

Array.prototype.print = function (label, limit = 20) {
  label && console.log("✨ " + label + ":\n");

  const arr = this;

  let str;

  if (limit && arr.length > limit) {
    const half = Math.floor(limit / 2);

    str =
      arr.slice(0, half).join(", ") + ", ..., " + arr.slice(-half).join(", ");
  } else {
    str = arr.join(", ");
  }

  console.log(`[ ${str} ]\n`);
};

Array.prototype.isSorted = function () {
  let sorted = true;

  for (let i = 0; i < this.length - 1; i++) {
    if (this[i] > this[i + 1]) {
      sorted = false;
      break;
    }
  }

  return sorted;
};

Array.generateSorted = function (size, dispersion = [1, 10]) {
  let min, max;

  if (dispersion?.length === 1) {
    min = dispersion[0];
    max = min;
  } else if (dispersion?.length === 2) {
    [min, max] = dispersion;

    if (!min) {
      min = 1;
    }

    if (!max) {
      max = 10;
    }
  } else {
    throw TypeError(`Wrong Dispersion: ${dispersion}`);
  }

  if (typeof min !== "number") {
    throw TypeError(`Min (${min}) is NaN`);
  } else if (typeof max !== "number") {
    throw TypeError(`Min (${min}) is NaN`);
  } else if (min > max) {
    throw RangeError("Min > Max");
  }

  const random = new Random(min, max);

  if (typeof size === "number" && size > 0) {
    const arr = [random.getInt()];

    for (let i = 1; i < size; i++) {
      arr.push(arr[i - 1] + random.getInt());
    }

    return arr;
  } else {
    throw TypeError(`${size} can't be an array length`);
  }
};

class Random {
  constructor(min = 0, max = 65535) {
    if (typeof min !== "number") {
      throw TypeError(min + " is NaN");
    } else if (typeof max !== "number") {
      throw TypeError(max + " is NaN");
    } else if (min > max) {
      throw RangeError("Min > Max");
    }
    this.#min = min;
    this.#max = max;
  }

  #min;
  #max;

  getInt = () =>
    Math.round(this.#min - 0.5 + Math.random() * (this.#max - this.#min + 1));

  getIntArray = (size) => {
    const arr = [];

    let i = 0;

    while (i < size) {
      const random = this.getInt();
      arr.push(random);
      i++;
    }

    return arr;
  };
}

const Timer = {
  run: (fn = () => null) => {
    if (typeof fn !== "function") {
      throw TypeError("Not a function!");
    }

    const startTs = performance.now();
    const result = fn();
    const endTs = performance.now();

    const ms = endTs - startTs;

    return { result, ms };
  },
  log: (ms) => console.log(`⏰ Time: ${ms} ms\n`),
};

class Sort {
  constructor(arr) {
    if (Array.isArray(arr)) {
      this.#initialArray = arr;
    } else {
      throw TypeError(`${arr} is not an array`);
    }
  }

  run = (method) => {
    let runSort;

    switch (method) {
      case SORT_METHOD.SELECTION:
        runSort = () => this.#selectionSort();
        break;
      case SORT_METHOD.HEAP:
        runSort = () => this.#heapSort();
        break;
      case SORT_METHOD.QUICK:
        runSort = () => this.#quickSort();
        break;
      default:
        throw TypeError("This sort method is not supported");
    }

    this.#arr = this.#initialArray.slice();

    const { ms } = Timer.run(runSort);

    this.logSorted(`${method}ed`);

    Timer.log(ms);
  };

  logSorted = (label) => this.#arr.print(label);

  #initialArray = [];
  #arr = [];
  #lengthHS;

  #selectionSort = () => {
    let n = this.#arr.length;

    for (let i = 0; i < n; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        if (this.#arr[j] < this.#arr[min]) {
          min = j;
        }
      }
      if (min !== i) {
        let tmp = this.#arr[i];
        this.#arr[i] = this.#arr[min];
        this.#arr[min] = tmp;
      }
    }
  };

  #heapSort = () => {
    this.#lengthHS = this.#arr.length;

    for (let i = Math.floor(this.#lengthHS / 2); i >= 0; i -= 1) {
      this.#heapifyHS(i);
    }

    for (let i = this.#arr.length - 1; i > 0; i--) {
      this.#swap(0, i);
      this.#lengthHS--;

      this.#heapifyHS(0);
    }
  };

  #heapifyHS = (i) => {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let max = i;

    if (left < this.#lengthHS && this.#arr[left] > this.#arr[max]) {
      max = left;
    }

    if (right < this.#lengthHS && this.#arr[right] > this.#arr[max]) {
      max = right;
    }

    if (max !== i) {
      this.#swap(i, max);
      this.#heapifyHS(max);
    }
  };

  #quickSort = (left = 0, right = this.#arr.length - 1) => {
    let index;
    if (this.#arr.length > 1) {
      index = this.#partitionQS(left, right);
      if (left < index - 1) {
        this.#quickSort(left, index - 1);
      }
      if (index < right) {
        this.#quickSort(index, right);
      }
    }
  };

  #partitionQS = (left, right) => {
    const pivot = this.#arr[Math.floor((right + left) / 2)];
    let i = left;
    let j = right;
    while (i <= j) {
      while (this.#arr[i] < pivot) {
        i++;
      }
      while (this.#arr[j] > pivot) {
        j--;
      }
      if (i <= j) {
        this.#swap(i, j);
        i++;
        j--;
      }
    }
    return i;
  };

  #swap = (index_A, index_B) => {
    let temp = this.#arr[index_A];

    this.#arr[index_A] = this.#arr[index_B];
    this.#arr[index_B] = temp;
  };
}

class Search {
  constructor(arr) {
    if (Array.isArray(arr) && arr.isSorted()) {
      this.#arr = arr;
    } else {
      throw TypeError(`${arr} is not an #array`);
    }
  }

  method;

  run = (method, key) => {
    let search;

    switch (method) {
      case SEARCH_METHOD.BINARY:
        search = (key) => this.#binarySearch(key);
        break;
      case SEARCH_METHOD.INTERPOLATION:
        search = (key) => this.#interpolationSearch(key);
        break;
      default:
        throw TypeError("This search method is not supported");
    }

    this.method = method;

    this.#result = { index: -1, key: null, ms: null };
    this.#results = [];

    if (key) {
      this.#result = Timer.run(() => search(key));
    } else {
      for (let i = 0; i < this.#arr.length; i++) {
        this.#result = Timer.run(() => search(this.#arr[i]));

        this.#results.push(this.#result);
      }
    }
  };

  logResult = (label = `${this.method} Result:`) => {
    console.log(`✨ ${label}\n`);
    this.#logResult(this.#result);
  };

  logResults = () => {
    if (this.#results.length) {
      console.log(`✨ ${this.method} [${this.#results.length}]:\n`);

      for (let i = 0; i < this.#results.length; i++) {
        this.#logResult(this.#results[i], i + 1);
      }
    } else {
      console.log(`✨ ${this.method}: []\n`);
    }
  };

  logAverage = () => {
    console.log(`✨ ${this.method} Average Result [${this.#arr.length}]:\n`);
    console.log(this.#average(), "\n");
  };

  #arr = [];
  #result = { index: -1, key: null, ms: null };
  #results = [];

  #interpolationSearch = (key) => {
    let iterations = 0;
    let comparisons = 0;

    let left = 0;
    let right = this.#arr.length - 1;

    while (++comparisons && left <= right && ++iterations) {
      const rangeDelta = this.#arr[right] - this.#arr[left];
      const indexDelta = right - left;
      const valueDelta = key - this.#arr[left];

      if (++comparisons && valueDelta < 0) {
        return {
          index: -1,
          key,
          iterations,
          comparisons,
        };
      }

      if (++comparisons && !rangeDelta) {
        return {
          index: this.#arr[left] === key ? left : -1,
          key,
          iterations,
          comparisons,
        };
      }

      const middleIndex =
        left + Math.floor((valueDelta * indexDelta) / rangeDelta);

      if (++comparisons && this.#arr[middleIndex] === key) {
        return {
          index: middleIndex,
          key,
          iterations,
          comparisons,
        };
      }

      if (++comparisons && this.#arr[middleIndex] < key) {
        left = middleIndex + 1;
      } else {
        right = middleIndex - 1;
      }
    }

    return {
      index: -1,
      key,
      iterations,
      comparisons,
    };
  };

  #binarySearch = (key) => {
    let comparisons = 0;
    let iterations = 0;

    let start = 0;
    let end = this.#arr.length - 1;

    while (++comparisons && start <= end && ++iterations) {
      let middle = Math.floor((start + end) / 2);

      if (++comparisons && this.#arr[middle] === key) {
        return {
          index: middle,
          key,
          iterations,
          comparisons,
        };
      } else if (++comparisons && this.#arr[middle] < key) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    return {
      index: -1,
      key,
      iterations,
      comparisons,
    };
  };

  #logResult = (_result, num) => {
    const { result, ms } = _result;
    console.log(...[...(num ? [`${num}.`] : []), result], "\n");
    Timer.log(ms);
  };

  #average = () => {
    let iSum = 0;
    let cSum = 0;
    let msSum = 0;

    const { length } = this.#results;

    for (let i = 0; i < this.#results.length; i++) {
      const { result, ms } = this.#results[i];

      const { iterations, comparisons } = result;

      iSum += iterations;
      cSum += comparisons;
      msSum += ms;
    }

    return {
      iterations: iSum / length,
      comparisons: cSum / length,
      ms: msSum / length,
    };
  };
}

const testSort = () => {
  console.log("↕️ SORT\n");

  const random = new Random();

  const size = SIZE.__0100__;

  const arrToSort = random.getIntArray(size);

  const sort = new Sort(arrToSort);

  arrToSort.print();

  sort.run(SORT_METHOD.SELECTION);
  sort.run(SORT_METHOD.HEAP);
  sort.run(SORT_METHOD.QUICK);
};

testSearch = () => {
  console.log("🔍 SEARCH\n");

  const size = SIZE.__0100__;

  const dispersion = [1, 10];

  const sortedArray = Array.generateSorted(size, dispersion);

  const search = new Search(sortedArray);

  const variant = 20 % 16;
  const numToSearch = variant * 10;

  sortedArray.print("Sorted Array");

  search.run(SEARCH_METHOD.BINARY);
  search.logAverage();
  search.logResults();

  search.run(SEARCH_METHOD.BINARY, numToSearch);
  search.logResult();

  search.run(SEARCH_METHOD.INTERPOLATION);
  search.logAverage();
  search.logResults();

  search.run(SEARCH_METHOD.INTERPOLATION, numToSearch);
  search.logResult();
};

(() => {
  testSort();
  testSearch();
})();
