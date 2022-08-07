import * as R from 'ramda';

const liListList = [[1,2,3], [1,2,3,4],[1,2]]
const total = liListList.reduce((re, cur) => {
  return re * cur.length;
}, 1);
const tArr = []
const stepArr = liListList.reduce((re,cur) => {
  return [...re,re.slice(-1)[0]*cur.length]
}, [1] as number[])
for (let i = 0; i < total; i++) {
  const  t = R.range(0, liListList.length).map((index) => {
    return Math.floor(i/stepArr[index] % liListList[index].length)
  })
  tArr.push(t)
}
console.log(tArr);
console.log(total);
console.log(stepArr);