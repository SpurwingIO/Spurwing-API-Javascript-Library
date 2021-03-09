const Spurwing = (function() {
  'use strict';

  this.API_URL = 'https://api.spurwing.io/api/v2/'
  this.init = function() {
    return this
  }

  this.get_appointment_types = async function(provider_id, clients_can_book) {
    return await this.GET(this.API_URL + 'appointment_types.json', { provider_id, clients_can_book })
  }
  this.get_days_available = async function(provider_id, appointment_type_id, date_from_month, timezone, org_level) {
    return await this.GET(this.API_URL + 'bookings/days_available.json', { provider_id, appointment_type_id, date_from_month, timezone, org_level })
  }
  this.get_slots_available = async function(provider_id, appointment_type_id, start_date, end_date, org_level) {
    return await this.GET(this.API_URL + 'bookings/slots_available.json', { provider_id, appointment_type_id, start_date, end_date, org_level })
  }
  this.complete_booking = async function(provider_id, appointment_type_id, date, timezone, first_name, last_name, email, phone_number, contact_type) {
    return await this.POST(this.API_URL + 'bookings/complete_booking.json', { provider_id, appointment_type_id, date, timezone, first_name, last_name, email, phone_number, contact_type })
  }

  this.GET = async function(url, params) {
    return new Promise((resolve, reject) => {
      this.ajax({
        method: 'GET',
        url: url,
        data: params,
        success: ((data) => resolve(data)),
        error:   ((data) => reject(data)),
      });
    }).catch(error => {console.error('GET error:', error) ; throw error});
  }
  this.POST = async function(url, data) {
    return new Promise((resolve, reject) => {
      this.ajax({
        method: 'POST',
        url: url,
        data: data,
        success: ((data) => resolve(data)),
        error:   ((data) => reject(data)),
      });
    }).catch(error =>{console.error('POST error:', error) ; throw error});
  }
  this.ajax = function(option) {
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }
      let {method, url, success, error} = option;
      if (!method)
        return console.error('not set method');
      if (!url)
        return console.error('not set url');
      if (!success)
        return console.error('not set success callback');
      if (!error)
        return console.error('not set error callback');
      let data = option.data || '';
      if (method === 'GET' && data && !isEmpty(data))
        url = url + '?' + formUrlEncode(data);
      else
        data = JSON.stringify(data);

      function formUrlEncode(obj) {
        if (!obj)
          return '';
        let urlData = '';
        for (let x in obj)
          urlData = urlData + x + '=' + encodeURIComponent(obj[x]) + '&';
        urlData = urlData.substr(0, (urlData.length - 1));
        return urlData;
      }

      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      xhr.send(data);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            success(response);
          } else {
            error(xhr.status, xhr.responseText);
          }
        }
      };
  }

  return this.init()

});

