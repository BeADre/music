import InterfaceTab from "./interfaceTab"

export const searchTab: Array<InterfaceTab> = [
  {name: "单曲", id: 1},
  {name: "专辑", id: 10},
  {name: "歌单", id: 1000},
  {name: "MV", id: 1004},
];

interface Alarm {
  alert(): void;
}

interface Light {
  lightOn(): void;

  lightOff(): void;
}

class Car implements Alarm, Light {
  alert() {
    console.log('Car alert');
  }

  lightOn() {
    console.log('Car light on');
  }

  lightOff() {
    console.log('Car light off');
  }
}

function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]

// SSNI-338 SSNI-198 hnd-723 kane-010 pgd-759 ipx-176 ipz-921 ipx-252 坂道美琉 ipx-416
