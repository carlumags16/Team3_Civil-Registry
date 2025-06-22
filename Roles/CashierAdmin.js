document.addEventListener('DOMContentLoaded', function () {
  //  Load and display admin username & role
  const username = sessionStorage.getItem('adminUsername');
  const role = sessionStorage.getItem('adminRole');

  const nameDisplay = document.getElementById('adminUsername');
  if (username && nameDisplay) nameDisplay.textContent = username;

  const roleDisplay = document.getElementById('adminRole');
  if (role && roleDisplay) roleDisplay.textContent = role;

  //  Modal open/close
  window.openPaymentModal = function () {
    document.getElementById('paymentModal').style.display = 'flex';
  };

  window.closePaymentModal = function () {
    document.getElementById('paymentModal').style.display = 'none';
  };

  //  Calculate change
  const amountTendered = document.getElementById('amountTendered');
  if (amountTendered) {
    amountTendered.addEventListener('input', function () {
      const amountDue = 380;
      const tendered = parseFloat(this.value) || 0;
      const change = tendered - amountDue;
      document.getElementById('changeAmount').value = change >= 0 ? `₱${change.toFixed(2)}` : 'Insufficient';
    });
  }

  //  Payment option toggle
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', function () {
      paymentOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });

  //  Close modal when clicking outside
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    window.addEventListener('click', function (event) {
      if (event.target === paymentModal) {
        closePaymentModal();
      }
    });
  }

});


