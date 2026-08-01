const LEAD_FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycby8ejv2ZVw8GQa4VGMI_H3gAiXM0trvg6Ha3EtMORfN5EwkEbqENc0xO9bNxn5QXlSoCA/exec";

const menu = document.querySelector('.mobile-menu');
const menuButton = document.querySelector('.menu-button');
const closeButton = document.querySelector('.mobile-menu-top button');
function setMenu(open) {
  if (!menu || !menuButton) return;
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
}
menuButton?.addEventListener('click', () => setMenu(true));
closeButton?.addEventListener('click', () => setMenu(false));
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const header = document.querySelector('.site-header');
function updateHeader() { header?.classList.toggle('scrolled', window.scrollY > 18); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent || 'Send Your Message';
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Sending your message…'; }
  const data = new FormData(contactForm);
  const query = new URLSearchParams(location.search);
  const body = new URLSearchParams({
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    topic: String(data.get('topic') || '').trim(),
    message: String(data.get('message') || '').trim(),
    consent: data.get('consent') ? 'true' : '',
    website: String(data.get('website') || ''),
    sourcePage: location.href,
    utmSource: query.get('utm_source') || '',
    utmMedium: query.get('utm_medium') || '',
    utmCampaign: query.get('utm_campaign') || ''
  });
  try {
    await fetch(LEAD_FORM_ENDPOINT, { method: 'POST', body, mode: 'no-cors' });
    contactForm.outerHTML = '<div class="success-message" role="status"><span>✦</span><h3>Your message is on its way</h3><p>Thank you for reaching out to LumaStory. A member of our team will read your message and respond as soon as possible.</p></div>';
  } catch (error) {
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalText; }
    alert('Something did not work. Please check your internet connection and try again.');
  }
});

document.querySelector('.newsletter form')?.addEventListener('submit', (event) => event.preventDefault());
