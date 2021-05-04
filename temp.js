let oph = '08-am to 08-pm'.replace(/\s+/g, '').split('to');
let start = Number(oph[0].split('-')[0]);
let startPost = oph[0].split('-')[1];
let end = Number(oph[1].split('-')[0]);
let endPost = oph[1].split('-')[1];
console.log(start, startPost, end, endPost);
let slots = 2;
//["4.00 am to 5.00 am","5.00 am to 6.00 am","6.00 am to 7.00 am","11.00 am to 12.00 pm"]
let mainoperatinghours = [];
while (start != end || startPost != endPost) {
  if (slots == 1) {
    let firstHalf = `${start} ${startPost}`;
    start = start + slots == 13 ? 1 : start + slots;
    if (start == 12 && startPost == 'am') {
      startPost = 'pm';
    } else if (start == 12 && startPost == 'pm') {
      startPost = 'am';
    }
    let secondHalf = `${start} ${startPost}`;
    mainoperatinghours.push(`${firstHalf} to ${secondHalf}`);
  } else if (slots == 2) {
    let firstHalf = `${start} ${startPost}`;
    // start = start + slots == 13 ? 1 : start + slots;
    if (start + slots == 13) {
      start = 1;
      if (startPost == 'am') {
        startPost = 'pm';
      }
      // else if(startPost=='pm'){
      //     startPost='am'
      // }
    } else {
      start = start + slots;
    }
    if (start + slots == 14) {
        start=2;
      if (startPost == 'am') {
        startPost = 'pm';
      } else {
        start = start + slots;
      }
    }
    console.log(start + ' ' + startPost);
    // if (start > 12 && startPost == 'am') {
    //   startPost = 'pm';
    // } else if (start > 12 && startPost == 'pm') {
    //   startPost = 'am';
    // }
    let secondHalf = `${start} ${startPost}`;
    mainoperatinghours.push(`${firstHalf} to ${secondHalf}`);
  }
}

console.log(mainoperatinghours);
