let oph = '11 to 23'.replace(/\s+/g, '').split('to');
let start = Number(oph[0]);
let end = Number(oph[1]);
console.log(start, end);
let slots = 2;
//["4 to 5 ","5  to 6 ","6  to 7 ","11  to 12 "]
let mainoperatinghours = [];
let postFlag = false;
while (start != end) {
  let firstHalf = `${start}`;
  start = start+slots;
  if(slots == 2){
    if(start-end == 1){
      break
    }
  }
  let secondHalf = `${start}`;
  console.log("start:",firstHalf," \t end: ",secondHalf)
  mainoperatinghours.push(`${firstHalf} to ${secondHalf}`);
  
}

console.log(mainoperatinghours);
