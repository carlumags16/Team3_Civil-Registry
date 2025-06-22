document.addEventListener('DOMContentLoaded', function() {
    const username = sessionStorage.getItem('adminUsername');
    const role = sessionStorage.getItem('adminRole');

    const nameDisplay = document.getElementById('adminUsername');
    if (username && nameDisplay) nameDisplay.textContent = username;

    const roleDisplay = document.getElementById('adminRole');
    if (role && roleDisplay) roleDisplay.textContent = role;
 });

// Tab functionality
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // Add tab filtering logic here
  });
});

// Modal functionality
const modal = document.getElementById('feedbackModal');
const modalClose = document.querySelector('.modal-close');
const viewButtons = document.querySelectorAll('.view-details');

viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    const feedbackId = button.getAttribute('data-id');
    document.getElementById('feedbackId').textContent = feedbackId;
    modal.style.display = 'flex';
  });
});

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Logout function
function logout() {
  console.log('Logging out...');
  window.location.href = '../login.html';
}

// Role-based menu item visibility
document.addEventListener('DOMContentLoaded', function () {
  const currentRole = "Feedback Officer";
  document.querySelectorAll('.menu-item').forEach(item => {
    const role = item.getAttribute('data-role');
    const visibleTo = item.getAttribute('data-visible-to');
    if (visibleTo === 'all') return;
    if (role && role !== currentRole) {
      item.style.display = 'none';
    }
  });
});
