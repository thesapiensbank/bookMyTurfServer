let oph = '8 to 22'.replace(/\s+/g, '').split('to');
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



/*
 function calculateHours(oph, slots) {
          let oph = '8 to 22'.replace(/\s+/g, '').split('to');
          let start = Number(oph[0]);
          let end = Number(oph[1]);
          console.log(start, end);
          let slot = Number(slots);
          //["4 to 5 ","5  to 6 ","6  to 7 ","11  to 12 "]
          let mainoperatinghours = [];
          let postFlag = false;
          while (start != end) {
            let firstHalf = `${start}`;
            start = start + slot;
            if (slot == 2) {
              if (start - end == 1) {
                break
              }
            }
            let secondHalf = `${start}`;
            console.log("start:", firstHalf, " \t end: ", secondHalf)
            mainoperatinghours.push(`${firstHalf} to ${secondHalf}`);

          }

          console.log(mainoperatinghours);

          // for (let i = 0; i < mainoperatinghours.length; i++) {
          //   const element = mainoperatinghours[i];
          //   $('#bookableHours').append(
          //     `<li>
          //       ${mainoperatinghours[i]}
          //     </li>`
          //   )

          // }
          return mainoperatinghours;

        }

    function bookableSlots() {
      let ophElement = String($('#operatinghours').val());
      let slotElement = $('#slots').val();
      console.log(ophElement,slotElement)
      if (ophElement!=null) {
        if (slotElement!==null) {
          let alloperatinghours = calculateHours(ophElement, Number(slotElement));
          console.log(alloperatinghours)
        }
      }
    }

    $("#operatinghours").on("change", function () {
      console.log("OPh changed");
      bookableSlots();
    });

    $("#slots").on("change", function () {
      console.log("Slots changed");
      bookableSlots();
    });
    
*/