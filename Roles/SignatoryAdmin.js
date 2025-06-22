 document.addEventListener('DOMContentLoaded', function() {
const username = sessionStorage.getItem('adminUsername');
  const role = sessionStorage.getItem('adminRole');

  const nameDisplay = document.getElementById('adminUsername');
  if (username && nameDisplay) nameDisplay.textContent = username;

  const roleDisplay = document.getElementById('adminRole');
  if (role && roleDisplay) roleDisplay.textContent = role;
            
document.getElementById('certificateTypeFilter').addEventListener('change', function () {
    console.log('Filter by type:', this.value);
  });

  document.getElementById('statusFilter').addEventListener('change', function () {
    console.log('Filter by status:', this.value);
  });

  document.getElementById('dateFrom').addEventListener('change', function () {
    console.log('Date from:', this.value);
  });

  document.getElementById('dateTo').addEventListener('change', function () {
    console.log('Date to:', this.value);
  });
});

function openSignatureModal() {
  document.getElementById('signatureModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSignatureModal() {
  document.getElementById('signatureModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}