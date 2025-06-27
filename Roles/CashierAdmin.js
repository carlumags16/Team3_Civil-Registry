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

  // Load dashboard data
  function loadDashboardData() {
    fetch('get_dashboard_data.php')
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          console.error('Failed to load dashboard data:', data.message);
          return;
        }
        
        console.log('Dashboard data received:', data); // Debug log
        
        // Update summary cards
        if (data.summary) {
          // Update existing summary cards
          const totalCollectedEl = document.getElementById('totalCollected');
          if (totalCollectedEl) totalCollectedEl.textContent = `₱${parseFloat(data.summary.total_collected || 0).toFixed(2)}`;
          
          const pendingPaymentsEl = document.getElementById('pendingPayments');
          if (pendingPaymentsEl) pendingPaymentsEl.textContent = data.summary.pending_payments_count || 0;
          
          const todayCollectionEl = document.getElementById('todayCollection');
          if (todayCollectionEl) todayCollectionEl.textContent = `₱${parseFloat(data.summary.today_collection || 0).toFixed(2)}`;
          
          const monthlyCollectionEl = document.getElementById('monthlyCollection');
          if (monthlyCollectionEl) monthlyCollectionEl.textContent = `₱${parseFloat(data.summary.monthly_collection || 0).toFixed(2)}`;
          
          // Update new summary cards
          const todaysTransactionsEl = document.getElementById('todaysTransactions');
          if (todaysTransactionsEl) todaysTransactionsEl.textContent = `₱${parseFloat(data.summary.todays_transactions || 0).toFixed(2)}`;
          
          const pendingPaymentsCountEl = document.getElementById('pendingPaymentsCount');
          if (pendingPaymentsCountEl) pendingPaymentsCountEl.textContent = data.summary.pending_payments_count || 0;
          
          const completedTodayEl = document.getElementById('completedToday');
          if (completedTodayEl) completedTodayEl.textContent = data.summary.completed_today || 0;
        }
        
        // Update transaction table
        const tbody = document.getElementById('cashierTableBody');
        if (!tbody) {
          console.error('Table body element not found');
          return;
        }
        
        tbody.innerHTML = '';
        
        if (data.transactions && data.transactions.length > 0) {
          console.log('Found', data.transactions.length, 'transactions'); // Debug log
          data.transactions.forEach(transaction => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${transaction.reference_number || 'N/A'}</td>
              <td>${transaction.transaction_number || 'N/A'}</td>
              <td>${transaction.type_label || 'N/A'}</td>
              <td>₱${parseFloat(transaction.amount || 0).toFixed(2)}</td>
              <td>${transaction.updated_at ? formatDate(transaction.updated_at) : 'N/A'}</td>
              <td><span class="status">${transaction.status || 'N/A'}</span></td>
              <td>
                <button class="action-btn" data-action="paid" data-id="${transaction.id}" data-type="${transaction.type}">PAID</button>
                <button class="action-btn" data-action="unpaid" data-id="${transaction.id}" data-type="${transaction.type}">UNPAID</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        } else {
          console.log('No transactions found'); // Debug log
          const tr = document.createElement('tr');
          tr.innerHTML = '<td colspan="7" class="text-center">No transactions found</td>';
          tbody.appendChild(tr);
        }
        
        // Add event listeners for action buttons
        tbody.querySelectorAll('.action-btn').forEach(btn => {
          btn.addEventListener('click', handleActionButtonClick);
        });
      })
      .catch(error => {
        console.error('Error loading dashboard data:', error);
      });
  }
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Handle action button clicks
  function handleActionButtonClick(event) {
    const certId = this.getAttribute('data-id');
    const certType = this.getAttribute('data-type');
    const newStatus = this.getAttribute('data-action').toUpperCase();
    
    fetch('process_payment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cert_id: certId,
        cert_type: certType,
        status: newStatus,
        amount: 0, // This should be the actual amount from the row
        payment_method: 'cash' // Default payment method
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Reload the dashboard data after successful update
        loadDashboardData();
      } else {
        alert('Failed to update status: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    });
  }
  
  // Initial load of dashboard data
  loadDashboardData();
});
