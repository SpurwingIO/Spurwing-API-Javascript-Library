chai.should();
const expect = chai.expect;
// https://www.chaijs.com/guide/styles/

let sp = new Spurwing();
const PID = 'your-product-id';

function dateNow() {
  let d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}
function  dateTomorrow() {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}

(async () => {
  console.log('UNIT TEST 1:')
  let tz = "Europe/Brussels";

  let A = await sp.get_appointment_types(PID, true)
  console.log(A)
  A.should.have.lengthOf(3) // default 3

  let B = await sp.get_days_available(PID, A[0].id, dateNow(), tz, false)
  console.log(B)
  expect(B.days_available.length).to.be.at.least(1) // at least one day available this month
  
  let C = await sp.get_slots_available(PID, A[0].id, dateNow(), dateTomorrow(), false)
  console.log(C)
  expect(C.slots_available.length).to.be.at.least(96) // each day has 96 15min slots (60*24 / 15 == 96)

  let slot = C.slots_available[5].date
  console.log(slot)

  let D = await sp.complete_booking(PID, A[0].id, slot, tz, 'Ilya', 'Nevolin', 'ilya2@nevolin.be', '111-111-7777', 'My Contact Type');
  console.log(D)
  D.should.have.property('appointment')
  expect(D.appointment.length).to.equal(60)
})();