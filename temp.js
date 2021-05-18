let Turf = require('./models/turf.models');

let turf = [
  {
    location: ['19.21', '72.976'],
    imagefile: ['1620995718610.png', '1620995718614.png'],
    _id: '609d71ae7f9e96352ccf0f79',
    status: true,
    name: 'Demo Arena Turf',
    email: 'rushikeshkardile9@gmail.com',
    website: 'supersapiens.in',
    mobile: 9869868616,
    address1:
      'B-401, Radhey Heights, Ambedkar Chowk, Near OJAS Hospital, Ravet, Pune, Pune, Pune, Pune, Pune, Pune, Pune, Pune, Pune',
    address2: 'Pune',
    city: 'Pune',
    pincode: 400606,
    state: 'Maharashtra',
    sports: [
      {
        _id: '60a121342a7e0453e0c8a0b2',
        name: 'Football',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0b3',
        name: 'Cricket',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0b4',
        name: 'Hockey',
        value: false,
      },
      {
        _id: '60a121342a7e0453e0c8a0b5',
        name: 'Tennis',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0b6',
        name: 'Badminton',
        value: false,
      },
      {
        _id: '60a121342a7e0453e0c8a0b7',
        name: 'Basketball',
        value: false,
      },
      {
        _id: '60a121342a7e0453e0c8a0b8',
        name: 'Cycling',
        value: false,
      },
    ],
    operatinghours: [
      {
        hours: [
          '8 to 9',
          '9 to 10',
          '10 to 11',
          '11 to 12',
          '12 to 13',
          '13 to 14',
          '14 to 15',
          '15 to 16',
          '16 to 17',
          '17 to 18',
          '18 to 19',
          '19 to 20',
        ],
        _id: '609d71af7f9e96352ccf0f81',
        date: '2021-05-13',
      },
      {
        hours: [
          '11 to 12',
          '12 to 13',
          '13 to 14',
          '14 to 15',
          '15 to 16',
          '16 to 17',
          '17 to 18',
          '18 to 19',
          '19 to 20',
          '20 to 21',
          '21 to 22',
          '22 to 23',
        ],
        _id: '60a1142ba3b21e4d64dba4e0',
        date: '2021-05-16',
      },
      {
        hours: [
          '8 to 10',
          '10 to 12',
          '12 to 14',
          '14 to 16',
          '16 to 18',
          '18 to 20',
        ],
        _id: '60a293f480bc2826b8ec9e7a',
        date: '2021-05-17',
      },
    ],
    features: [
      {
        _id: '60a121342a7e0453e0c8a0b9',
        name: 'Wifi',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0ba',
        name: 'Beverages',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0bb',
        name: 'First Aid',
        value: false,
      },
      {
        _id: '60a121342a7e0453e0c8a0bc',
        name: 'Parking',
        value: false,
      },
      {
        _id: '60a121342a7e0453e0c8a0bd',
        name: 'Drinking Water',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0be',
        name: 'Coaching',
        value: false,
      },
      {
        _id: '60a121342a7e0453e0c8a0bf',
        name: 'Flood Lights',
        value: true,
      },
      {
        _id: '60a121342a7e0453e0c8a0c0',
        name: 'Toilets',
        value: false,
      },
    ],
    slots: 1,
    turftype: [
      {
        _id: '609d71af7f9e96352ccf0f8a',
        name: 'Turf1',
        area: 60231,
        rate: 2332,
        bookedhours: [
          {
            hours: ['13 to 14', '16 to 17', '17 to 18', '19 to 20'],
            _id: '609d71af7f9e96352ccf0f8b',
            date: '2021-05-13',
          },
          {
            hours: ['13 to 14', '16 to 17', '19 to 20'],
            _id: '609d71c07f9e96352ccf0f90',
            date: '2021-05-14',
          },
        ],
      },
      {
        _id: '609d71af7f9e96352ccf0f8c',
        name: 'Turf23',
        area: 5655,
        rate: 343,
        bookedhours: [
          {
            hours: ['13 to 14', '16 to 17', '17 to 18'],
            _id: '609d71af7f9e96352ccf0f8d',
            date: '2021-05-13',
          },
          {
            hours: ['13 to 14', '14 to 15', '16 to 17', '17 to 18'],
            _id: '609d71c07f9e96352ccf0f91',
            date: '2021-05-14',
          },
        ],
      },
      {
        _id: '609d71af7f9e96352ccf0f8e',
        name: 'Turf4',
        area: 2323,
        rate: 12,
        bookedhours: [
          {
            hours: ['10 to 11', '11 to 12', '14 to 15', '19 to 20'],
            _id: '609d71af7f9e96352ccf0f8f',
            date: '2021-05-13',
          },
          {
            hours: ['10 to 11', '14 to 15', '17 to 18', '19 to 20'],
            _id: '609d71c07f9e96352ccf0f92',
            date: '2021-05-14',
          },
        ],
      },
    ],
    createdAt: '2021-05-13T18:36:31.019Z',
    updatedAt: '2021-05-17T16:04:04.139Z',
    __v: 0,
  },
];
let body = {
  apitoken: 'passwordforturf',
  date: '2021-05-13',
  turftypeid: '609d71af7f9e96352ccf0f8a',
};

const apitoken = body.apitoken;
const date = body.date;
const turftypeID = body.turftypeid;

if (date && turftypeID) {
  Turf.find(
    { 'turftype._id': turftypeID, 'turftype.bookedhours.date': date },
    function (err, turf) {
  console.log(turf);

    //   if (turf[0].length) {
    //     let turfbh = [];
    //     let oph = [];
    //     if (Array.isArray(turf[0].turftype)) {
    //       console.log('inside second l');
    //       for (let i = 0; i < turf[0].turftype.length; i++) {
    //         const element = turf[0].turftype[i];
    //         if (element._id === turftypeID) {
    //           if (Array.isArray(element.bookedhours)) {
    //             for (
    //               let j = element.bookedhours.length - 1;
    //               j < element.bookedhours.length;
    //               j--
    //             ) {
    //               const bookedhour = element.bookedhours[j];
    //               if (bookedhour.date === date) {
    //                 turfbh = bookedhour.hours;
    //                 console.log(turfbh);
    //                 break;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     console.log('first loop finish');
    //     if (Array.isArray(turf[0].operatinghours)) {
    //       for (
    //         let k = turf[0].operatinghours.length - 1;
    //         k < turf[0].operatinghours.length;
    //         k--
    //       ) {
    //         const element = turf[0].operatinghours[k];
    //         if (element.date === date) {
    //           oph = element.hours;
    //           break;
    //         }
    //       }
    //     }
    //     const availableslots = oph.filter((slot) => !turfbh.includes(slot));
    //     const slots = { slots: availableslots };
    //     // res.json(slots);
    //     console.log(slots);
    //   } else if (err) {
    //     console.log(err);
    //     // res.status(400).json('Error: ' + err);
    //   }
    }
  );
}
