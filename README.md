# Spurwing API JavaScript Library

Lightweight Vanilla JavaScript library for Spurwing's API.

Spurwing's API makes it easy to add robust scheduling and booking to your application. We power millions of appointment bookings for thousands of companies, from marketplaces to SaaS & healthcare. 

## Account
To use this API you need to obtain API credentials by signin up here: https://spurwing.io/

On your dashboard you will have the "API Info" page with your **API key** and **Provider ID**.

- **API Key:** This is your private API Key used for private and authorized operations.

- **Provider ID:** This is your public calendar identifier.

**Security Warning:** Spurwing's API has several private/sensitive endpoints for creating, modifying & deleting data. It is highly discouraged to use functions which require your private API key to be exposed to external users. Never expose your **API Key** in front-end javascript code. All implementations that require your API Key should be handled by your back-end in a secure environment.

## Usage
Include the JS library in the `<head>` of your project:
`<script src="spurwing.js"></script>`

Then you can use it as such:
```js
let sp = new Spurwing();

const PID = 'your provider id';

let allApps = await sp.get_appointment_types(PID, true)

```
## Documentation

The currently implemented API functions and features are:

- get_appointment_types
- get_days_available
- get_slots_available
- complete_booking
- list_appointments
- delete_appointment

For additional demos and use cases have a look under `tests.js`.

Spurwing's REST API Reference and Docs: https://docs.spurwing.io/

## Testing
To run our predefined unit tests use the `tests.html` page (hosted on your web server).
You need to provide two URL paramters: `pid` is your provider id, `key` is your API key.

```
http://localhost:8080/tests.html?pid=ABC&key=XYZ
```
