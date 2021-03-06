/* Copyright Spurwing.io and Healthie Inc.
 * Released under the MIT license 
 * https://www.spurwing.io/
 */

const Spurwing = (function() {
  'use strict';

  this.API_URL = 'https://api.spurwing.io/api/v2/'
  this.init = function() {
    return this
  }

  this.get_appointment_types = async function(provider_id, page_size, offset) {
    return await this.HTTP('GET', this.API_URL + 'appointment_types.json', { provider_id, page_size, offset })
  }
  this.get_days_available = async function(provider_id, appointment_type_id, date_from_month, organization_level, timezone) {
    return await this.HTTP('GET', this.API_URL + 'bookings/days_available.json', { provider_id, appointment_type_id, date_from_month, organization_level, timezone })
  }
  this.get_slots_available = async function(provider_id, appointment_type_id, start_date, end_date, organization_level, timezone) {
    return await this.HTTP('GET', this.API_URL + 'bookings/slots_available.json', { provider_id, appointment_type_id, start_date, end_date, organization_level, timezone })
  }
  this.complete_booking = async function(provider_id, appointment_type_id, email, first_name, last_name, date, contact_type, appointment_id, appointment_location_id, timezone, video_chat_url) {
    return await this.HTTP('POST', this.API_URL + 'bookings/complete_booking.json', { provider_id, appointment_type_id, email, first_name, last_name, date, contact_type, appointment_id, appointment_location_id, timezone, video_chat_url })
  }
  this.create_group_appointment = async function(authorization, provider_id, appointment_type_id, datetime) {
    return await this.HTTP('POST', this.API_URL + 'appointments', { provider_id, appointment_type_id, datetime }, { authorization: 'Bearer ' + authorization })
  }
  this.list_appointments = async function(authorization, page_size, offset, appointment_category, load_attendees, load_providers, load_appointment_type) {
    return await this.HTTP('GET', this.API_URL + 'appointments', { page_size, offset, appointment_category, load_attendees, load_providers, load_appointment_type }, { authorization: 'Bearer ' + authorization })
  }
  this.delete_appointment = async function(authorization, appointment_id) {
    return await this.HTTP('DELETE', this.API_URL + 'appointments/' + appointment_id, {}, { authorization: 'Bearer ' + authorization })
  }

  this.HTTP = async function(method, url, data, headers) {
    return new Promise((resolve, reject) => {
      this.ajax({
        method: method,
        url: url,
        data: data,
        headers: headers || {},
        success: ((data) => resolve(data)),
        error:   ((data) => reject(data)),
      });
    }).catch((error) =>{console.error(method + ' error:', error) ; throw error});
  }

  this.ajax = function(option) {
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }
      let {method, url, success, error, headers} = option;
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
        for (let x in obj) {
          if (typeof obj[x] === 'undefined' || obj[x] == null)
            continue;
          urlData = urlData + x + '=' + encodeURIComponent(obj[x]) + '&';
        }
        urlData = urlData.substr(0, (urlData.length - 1));
        return urlData;
      }

      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      for (const hdr in headers) {
        xhr.setRequestHeader(hdr, headers[hdr]);
      }
      xhr.send(data);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            success(response);
          } else {
            error({status:xhr.status, responseText:xhr.responseText});
          }
        }
      };
  }

  return this.init()

});

