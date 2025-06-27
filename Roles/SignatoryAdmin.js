document.addEventListener('DOMContentLoaded', function() {
  const username = sessionStorage.getItem('adminUsername');
  const role = sessionStorage.getItem('adminRole');

  const nameDisplay = document.getElementById('adminUsername');
  if (username && nameDisplay) nameDisplay.textContent = username;

  const roleDisplay = document.getElementById('adminRole');
  if (role && roleDisplay) roleDisplay.textContent = role;

  // Store certificates globally for filtering
  let allCertificates = [];
  let tbody = document.getElementById('signatoryTableBody');

  function renderTable(certificates) {
    if (!tbody) return;
    tbody.innerHTML = '';
    certificates.forEach(cert => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cert.reference_number}</td>
        <td>${cert.type_label}</td>
        <td>${cert.full_name}</td>
        <td>${cert.created_at ? cert.created_at.slice(0, 10) : ''}</td>
        <td><span class="status-badge">${cert.status}</span></td>
        <td>
          <button class="action-btn btn-signed" data-action="signed" data-id="${cert.id}" data-type="${cert.type}">SIGNED</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    // Add event listeners for SIGNED buttons
    tbody.querySelectorAll('.action-btn.btn-signed').forEach(btn => {
      btn.addEventListener('click', function () {
        const certId = this.getAttribute('data-id');
        const certType = this.getAttribute('data-type');
        const newStatus = this.getAttribute('data-action').toUpperCase();
        fetch('process_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_status',
            cert_id: certId,
            cert_type: certType,
            new_status: newStatus
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res.success) {
              this.closest('tr').remove();
            } else {
              alert('Failed to update status: ' + res.message);
            }
          })
          .catch(() => alert('Failed to update status.'));
      });
    });
  }

  function filterCertificates() {
    const type = document.getElementById('certificateTypeFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    let filtered = allCertificates.filter(cert => cert.status === 'PAID');
    if (type !== 'all') {
      filtered = filtered.filter(cert => cert.type && cert.type.toLowerCase() === type.toLowerCase());
    }
    if (dateFrom) {
      filtered = filtered.filter(cert => cert.created_at && cert.created_at.slice(0, 10) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(cert => cert.created_at && cert.created_at.slice(0, 10) <= dateTo);
    }
    renderTable(filtered);
  }

  fetch('../AdminPortal/getCertificate.php')
    .then(response => response.json())
    .then(data => {
      if (!data.success) return;
      allCertificates = data.data.certificates || [];
      filterCertificates();
    });

  document.getElementById('certificateTypeFilter').addEventListener('change', filterCertificates);
  document.getElementById('dateFrom').addEventListener('change', filterCertificates);
  document.getElementById('dateTo').addEventListener('change', filterCertificates);
});

function openSignatureModal() {
  document.getElementById('signatureModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSignatureModal() {
  document.getElementById('signatureModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}