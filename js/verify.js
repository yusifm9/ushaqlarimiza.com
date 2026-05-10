// js/verify.js

document.addEventListener('DOMContentLoaded', () => {
  const input  = document.getElementById('cert-code');
  const btn    = document.getElementById('verify-btn');
  const result = document.getElementById('verify-result');
  const chips  = document.querySelectorAll('.code-chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => { input.value = chip.dataset.code; input.focus(); });
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') runVerify(); });
  btn.addEventListener('click', runVerify);

  function runVerify() {
    const code = input.value.trim().toUpperCase();
    if (!code) { showMsg('Please enter a certificate code before verifying.'); return; }
    const cert = CERTIFICATES.find(c => c.code.toUpperCase() === code);
    if (!cert) {
      result.innerHTML = `<div class="result-error">
        <div class="result-badge not-found">Not Found</div>
        <p style="color:var(--text);font-size:.95rem;margin-bottom:8px"><strong>No certificate found with code "${esc(code)}".</strong></p>
        <p style="color:var(--muted);font-size:.875rem;line-height:1.7">Please double-check the code and try again. Contact us at <a href="mailto:info@ushaqlarimizaoyredek.com" style="color:var(--blue)">info@ushaqlarimizaoyredek.com</a> if you need help.</p>
      </div>`;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return;
    }
    const valid = cert.status === 'Valid';
    const badgeClass = valid ? 'valid' : 'revoked';
    const badgeTxt   = valid ? 'Valid Certificate' : 'Revoked Certificate';
    const statusColor = valid ? '#2E7D57' : '#C62828';
    const divClass   = valid ? 'result-valid' : 'result-revoked';
    result.innerHTML = `<div class="${divClass}">
      <div class="result-badge ${badgeClass}">${badgeTxt}</div>
      <div class="result-row"><span class="result-key">Certificate Code</span><span class="result-val" style="font-family:'Courier New',monospace;font-weight:700">${esc(cert.code)}</span></div>
      <div class="result-row"><span class="result-key">Recipient Name</span><span class="result-val">${esc(cert.recipientName)}</span></div>
      <div class="result-row"><span class="result-key">Certificate Type</span><span class="result-val">${esc(cert.certificateType)}</span></div>
      <div class="result-row"><span class="result-key">Issue Date</span><span class="result-val">${fmtDate(cert.issueDate)}</span></div>
      <div class="result-row"><span class="result-key">Issued By</span><span class="result-val">${esc(cert.issuedBy)}</span></div>
      <div class="result-row"><span class="result-key">Status</span><span class="result-val" style="font-weight:700;color:${statusColor}">${esc(cert.status)}</span></div>
      ${cert.description ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid ${valid ? '#B2DFC8' : '#FFCDD2'}"><p style="font-size:.875rem;color:var(--muted);line-height:1.7">${esc(cert.description)}</p></div>` : ''}
    </div>`;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showMsg(msg) {
    result.innerHTML = `<div class="result-error"><div class="result-badge not-found">Input Required</div><p style="color:var(--text);font-size:.9rem">${esc(msg)}</p></div>`;
  }
  function fmtDate(s) {
    return new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
});
