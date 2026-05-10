// js/verify.js — Certificate verification logic

document.addEventListener('DOMContentLoaded', () => {

  const input   = document.getElementById('cert-code');
  const btn     = document.getElementById('verify-btn');
  const result  = document.getElementById('verify-result');
  const chips   = document.querySelectorAll('.code-chip');

  // Click sample code chips to auto-fill
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.code;
      input.focus();
    });
  });

  // Allow pressing Enter in input
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') runVerify();
  });

  btn.addEventListener('click', runVerify);

  function runVerify() {
    const code = input.value.trim().toUpperCase();
    if (!code) {
      showError('Please enter a certificate code before verifying.');
      return;
    }

    // Search the certificates array (loaded via data/certificates.js)
    const cert = CERTIFICATES.find(c => c.code.toUpperCase() === code);

    if (!cert) {
      result.innerHTML = `
        <div class="result-error">
          <div class="result-badge not-found">⚠ Not Found</div>
          <p style="color:var(--text);font-size:.95rem;margin-bottom:8px;">
            <strong>No certificate found with code "${escapeHtml(code)}".</strong>
          </p>
          <p style="color:var(--muted);font-size:.875rem;line-height:1.7;">
            Please double-check the code and try again. If you believe this is an error,
            contact us at <a href="mailto:info@ushaqlarimizaoyretek.org" style="color:var(--blue)">info@ushaqlarimizaoyretek.org</a>.
          </p>
        </div>`;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    const isValid   = cert.status === 'Valid';
    const isRevoked = cert.status === 'Revoked';
    const badgeClass = isValid ? 'valid' : 'revoked';
    const badgeIcon  = isValid ? '✅' : '❌';
    const badgeText  = isValid ? 'Valid Certificate' : 'Revoked Certificate';

    const formattedDate = formatDate(cert.issueDate);

    result.innerHTML = `
      <div class="result-${isValid ? 'valid' : 'revoked'}">
        <div class="result-badge ${badgeClass}">${badgeIcon} ${badgeText}</div>
        <div class="result-row">
          <span class="result-key">Certificate Code</span>
          <span class="result-val" style="font-family:'Courier New',monospace;font-weight:700">${escapeHtml(cert.code)}</span>
        </div>
        <div class="result-row">
          <span class="result-key">Recipient Name</span>
          <span class="result-val">${escapeHtml(cert.recipientName)}</span>
        </div>
        <div class="result-row">
          <span class="result-key">Certificate Type</span>
          <span class="result-val">${escapeHtml(cert.certificateType)}</span>
        </div>
        <div class="result-row">
          <span class="result-key">Issue Date</span>
          <span class="result-val">${formattedDate}</span>
        </div>
        <div class="result-row">
          <span class="result-key">Issued By</span>
          <span class="result-val">${escapeHtml(cert.issuedBy)}</span>
        </div>
        <div class="result-row">
          <span class="result-key">Status</span>
          <span class="result-val" style="font-weight:700;color:${isValid ? '#2E7D57' : '#C62828'}">${escapeHtml(cert.status)}</span>
        </div>
        ${cert.description ? `
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid ${isValid ? '#B2DFC8' : '#FFCDD2'}">
          <p style="font-size:.875rem;color:var(--muted);line-height:1.7">${escapeHtml(cert.description)}</p>
        </div>` : ''}
      </div>`;

    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showError(msg) {
    result.innerHTML = `
      <div class="result-error">
        <div class="result-badge not-found">⚠ Input Required</div>
        <p style="color:var(--text);font-size:.9rem">${escapeHtml(msg)}</p>
      </div>`;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
