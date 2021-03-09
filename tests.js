/* Copyright Spurwing.io and Healthie Inc.
 * Released under the MIT license 
 * https://www.spurwing.io/
 */

// chai testing framework: https://www.chaijs.com/guide/styles/
chai.should();
const expect = chai.expect;


const urlParams = new URLSearchParams(window.location.search);
const PID = urlParams.get('pid'); // 'your spurwing provider-id';
const KEY = urlParams.get('key')  // 'your spurwing api-key'

async function runner(testname, func) {
  try {
    console.log(testname, 'STARTED')
    await func()
    console.log(testname, 'PASSED')
  } catch (err) {
    console.error(testname, 'FAILED')
    console.error(err)
  }
}

(async () => {

  await runner('TEST 1', (async() => {
    let sp = new Spurwing();
    let tz = "Europe/Brussels";

    let A = await sp.get_appointment_types(PID, true)
    console.log(A)
    A.should.have.lengthOf(3) // default 3

    let B = await sp.get_days_available(PID, A[0].id, dateNow(), tz, false)
    console.log(B)
    expect(B.days_available.length).to.be.at.least(1) // at least one day available this month

    let C = await sp.get_slots_available(PID, A[0].id, dateNow(), dateTomorrow(), false)
    console.log(C)
    expect(C.slots_available.length).to.be.at.least(10) // each day has 96 15min slots (60*24 / 15 == 96)

    let slot = C.slots_available[5].date
    let D = await sp.complete_booking(PID, A[0].id, slot, tz, 'Ilya', 'Nevolin', 'ilya2@nevolin.be', '111-111-7777', 'My Contact Type');
    console.log(D)
    D.should.have.property('appointment')
    expect(D.appointment.length).to.equal(60)

    let apid = D.appointment.id;
    let F = await sp.delete_appointment(apid, KEY)
    console.log(F)
    F.should.have.property('data')
    F.data.should.have.property('appointment')
    F.data.appointment.id.should.equal(D.appointment.id)
    F.errors.should.have.lengthOf(0)
  }));

  await runner('TEST 2', (async() => {
    let sp = new Spurwing();
    let E = await sp.list_appointments(KEY, 1000, 0, PID)
    console.log(E)
  }));

})();

//////////////////////////////
////// helper functions //////
//////////////////////////////

function dateNow() {
  let d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}

function  dateTomorrow() {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}