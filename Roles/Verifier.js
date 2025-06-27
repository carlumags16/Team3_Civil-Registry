document.addEventListener('DOMContentLoaded', function() {
  const username = sessionStorage.getItem('adminUsername');
  const role = sessionStorage.getItem('adminRole');

  const nameDisplay = document.getElementById('adminUsername');
  if (username && nameDisplay) nameDisplay.textContent = username;

  const roleDisplay = document.getElementById('adminRole');
  if (role && roleDisplay) roleDisplay.textContent = role;

  fetchAndRenderCertificates();
});

async function fetchAndRenderCertificates() {
  try {
    const response = await fetch('../AdminPortal/getCertificate.php', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();
    if (data.success && data.data && data.data.certificates) {
      renderCertificatesTable(data.data.certificates);
      updateDashboardCounts(data.data.certificates);
    } else {
      renderCertificatesTable([]);
      updateDashboardCounts([]);
    }
  } catch (err) {
    renderCertificatesTable([]);
    updateDashboardCounts([]);
  }
}

function renderCertificatesTable(certificates) {
  const tbody = document.getElementById('pendingVerificationTableBody');
  tbody.innerHTML = '';
  const relevantCerts = certificates.filter(cert => cert.status === 'RECEIVED' || cert.status === 'PROCESSING');
  if (relevantCerts.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="6" style="text-align:center;">No documents pending verification.</td>';
    tbody.appendChild(row);
    return;
  }
  relevantCerts.forEach(cert => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cert.reference_number || 'N/A'}</td>
      <td>${cert.full_name || 'N/A'}</td>
      <td>${cert.type_label || cert.type}</td>
      <td>${cert.created_at || ''}</td>
      <td><span class="status status-pending">${cert.status}</span></td>
      <td><button class="btn btn-primary btn-view" data-id="${cert.id}" data-type="${cert.type}">VIEW</button></td>
    `;
    tbody.appendChild(row);
  });
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', function() {
      openCertificateModal(this.dataset.id, this.dataset.type);
    });
  });
}

async function openCertificateModal(certId, certType) {
  try {
    // Always reset modal content to original structure before populating
    resetInspectionModalContent();
    const response = await fetch(`get_certificate_details.php?id=${certId}&type=${certType}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();
    if (data.success && data.data && data.data.certificate) {
      populateModalWithCertificate(data.data.certificate, certType);
      document.getElementById('inspectionModal').style.display = 'flex';
    } else {
      alert('Failed to load certificate details.');
    }
  } catch (err) {
    alert('Error loading certificate details.');
  }
}

function resetInspectionModalContent() {
  // Restore the modal's HTML structure to its original state
  const modalBody = document.querySelector('#inspectionModal .modal-body');
  modalBody.innerHTML = `
    <div class="document-details">
      <div class="detail-group"></div>
    </div>
    <div class="document-preview"></div>
    <div class="document-preview"></div>
  `;
}

function closeModal() {
  document.getElementById('inspectionModal').style.display = 'none';
}

function populateModalWithCertificate(cert, certType) {
  document.querySelector('#inspectionModal .modal-header h3').textContent = `Document Verification: ${cert.reference_number || 'N/A'}`;

  // Always select fresh elements after reset
  const detailsContainer = document.querySelector('#inspectionModal .document-details');
  if (!detailsContainer) return;
  const docInfo = detailsContainer.querySelector('.detail-group');
  if (!docInfo) return;
  docInfo.innerHTML = `
    <h4>Document Information</h4>
    <p><strong>Type:</strong> ${certType ? certType.charAt(0).toUpperCase() + certType.slice(1) : 'N/A'}</p>
    <p><strong>Date Submitted:</strong> ${cert.created_at || 'N/A'}</p>
    <p><strong>Reference No:</strong> ${cert.reference_number || 'N/A'}</p>
  `;

  // Document Content: use a flexible div, not .preview-container
  const contentSection = document.querySelectorAll('#inspectionModal .document-preview')[0];
  if (contentSection) {
    let contentHtml = '<h4>Document Content</h4><div style="background:#f8f9fa; padding:12px 16px; border-radius:4px; margin-bottom:10px;">';
    const skipFields = ['id', 'user_id', 'status', 'created_at', 'updated_at', 'updated_by'];
    for (const key in cert) {
      if (skipFields.includes(key.toLowerCase()) || cert[key] === null || cert[key] === '') continue;
      const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      contentHtml += `<div style="margin-bottom:6px;"><strong>${displayKey}:</strong> ${cert[key]}</div>`;
    }
    contentHtml += '</div>';
    contentSection.innerHTML = contentHtml;
  }

  // Attached Supporting Documents (keep .preview-container for files/images)
  const supportingSection = document.querySelectorAll('#inspectionModal .document-preview')[1];
  if (supportingSection) {
    let supportingHtml = '<h4>Attached Supporting Documents</h4><div class="preview-container">';
    supportingHtml += '<span style="color:#888;">No supporting documents available.</span>';
    supportingHtml += '</div>';
    supportingHtml += '<div style="display: flex; gap: 10px; margin-top: 10px;">';
    supportingHtml += '<button class="btn btn-outline"><i class="fas fa-download"></i> Download</button>';
    supportingHtml += '<button class="btn btn-outline"><i class="fas fa-expand"></i> Fullscreen</button>';
    supportingHtml += '</div>';
    supportingSection.innerHTML = supportingHtml;
  }

  // Modal Footer Buttons
  const modalFooter = document.querySelector('#inspectionModal .modal-footer');
  if (!modalFooter) return;
  modalFooter.innerHTML = '';
  if (cert.status === 'RECEIVED') {
    modalFooter.innerHTML = `
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="markProcessing(${cert.id}, '${certType}')">PROCESSING</button>
    `;
  } else if (cert.status === 'PROCESSING') {
    modalFooter.innerHTML = `
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="markApproved(${cert.id}, '${certType}')">APPROVE</button>
      <button class="btn btn-danger" onclick="markRejected(${cert.id}, '${certType}')">REJECT</button>
    `;
  }
}

async function markProcessing(certId, certType) {
  await updateCertificateStatus(certId, certType, 'PROCESSING');
}
async function markApproved(certId, certType) {
  await updateCertificateStatus(certId, certType, 'APPROVED');
}
async function markRejected(certId, certType) {
  await updateCertificateStatus(certId, certType, 'REJECTED');
}

async function updateCertificateStatus(certId, certType, newStatus) {
  try {
    const response = await fetch('process_status.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_status',
        cert_id: certId,
        cert_type: certType,
        new_status: newStatus
      })
    });
    const data = await response.json();
    if (data.success) {
      closeModal();
      fetchAndRenderCertificates();
    } else {
      alert('Failed to update its status.');
    }
  } catch (err) {
    alert('Error updating status.');
  }
}

function logout() {
  alert('You have been logged out.');
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('inspectionModal');
  if (event.target == modal) {
    closeModal();
  }
};

function updateDashboardCounts(certificates) {
  console.log('=== Dashboard Counts Debug ===');
  console.log('Total certificates received:', certificates.length);
  
  // Pending Verification: status RECEIVED
  const pendingCount = certificates.filter(cert => cert.status === 'RECEIVED').length;
  document.getElementById('pendingCount').textContent = pendingCount;
  console.log('Pending (RECEIVED) count:', pendingCount);

  // Verified Today: status APPROVED or REJECTED and updated today
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  console.log('Today\'s date:', today);
  
  const verifiedTodayCount = certificates.filter(cert => {
    if (!cert.updated_at) {
      console.log('Certificate', cert.id, 'has no updated_at field');
      return false;
    }
    const status = cert.status;
    const updatedDate = cert.updated_at.slice(0, 10);
    const isVerified = (status === 'APPROVED' || status === 'REJECTED') && updatedDate === today;
    console.log('Certificate', cert.id, 'status:', status, 'updated:', updatedDate, 'isVerified:', isVerified);
    return isVerified;
  }).length;
  
  document.getElementById('verifiedTodayCount').textContent = verifiedTodayCount;
  console.log('Verified Today count:', verifiedTodayCount);
  console.log('=== End Debug ===');
}
