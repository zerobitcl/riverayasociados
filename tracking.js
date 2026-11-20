/**
 * Eventos de conversión Rivera & Asociados
 * - generate_lead / agendar_consulta → Google Calendar
 * - phone_click → tel:
 * - email_click → mailto:
 * - click_whatsapp → wa.me / api.whatsapp.com
 * - form_submit → envío de formularios (si existen)
 *
 * GA4 Measurement ID: G-JNTE9DCFSM
 */
(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-JNTE9DCFSM';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  function track(eventName, params) {
    var payload = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, payload));
    }
  }

  function resolveEvent(anchor) {
    if (!anchor || !anchor.href) return null;
    var explicit = anchor.getAttribute('data-event');
    if (explicit) return explicit;

    var href = anchor.getAttribute('href') || '';
    var lower = href.toLowerCase();

    if (lower.indexOf('calendar.app.google') !== -1) return 'generate_lead';
    if (lower.indexOf('wa.me/') !== -1 || lower.indexOf('api.whatsapp.com') !== -1) return 'click_whatsapp';
    if (lower.indexOf('tel:') === 0) return 'phone_click';
    if (lower.indexOf('mailto:') === 0) return 'email_click';
    return null;
  }

  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || !el.closest) return;
    var a = el.closest('a');
    if (!a) return;

    var name = resolveEvent(a);
    if (!name) return;

    var params = {
      link_url: a.href,
      link_text: (a.textContent || '').trim().slice(0, 80)
    };

    if (name === 'generate_lead') {
      params.event_category = 'engagement';
      params.event_label = 'calendar_schedule';
    } else if (name === 'click_whatsapp') {
      params.event_category = 'engagement';
      params.event_label = 'whatsapp';
    } else if (name === 'phone_click') {
      params.event_category = 'engagement';
      params.event_label = 'phone';
    }

    track(name, params);
    if (name === 'generate_lead') {
      track('agendar_consulta', params);
    }
  }, true);

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    track('form_submit', {
      form_id: form.id || '',
      form_name: form.getAttribute('name') || ''
    });
    track('generate_lead', { method: 'form_submit' });
  }, true);
})();
