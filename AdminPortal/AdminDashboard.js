let sampleData = [];

let currentState = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  sortColumn: 'id',
  sortDirection: 'asc',
  searchQuery: '',
  dateRange: { start: null, end: null },
  dataType: 'all',
  statusFilter: 'all'
};

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  setupEventListeners();
});

function fetchData() {
  // Build query parameters
  const params = new URLSearchParams();
  if (currentState.statusFilter !== 'all') {
    params.append('status', currentState.statusFilter.toUpperCase());
  }

  fetch(`getCertificate.php?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      sampleData = data;
      currentState.totalItems = sampleData.length;
      renderTable();
    })
    .catch(err => console.error('Fetch Error:', err));
}

function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', e => {
    currentState.searchQuery = e.target.value;
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('startDate').addEventListener('change', e => {
    currentState.dateRange.start = e.target.value;
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('endDate').addEventListener('change', e => {
    currentState.dateRange.end = e.target.value;
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('dataType').addEventListener('change', e => {
    currentState.dataType = e.target.value;
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('statusFilter').addEventListener('change', e => {
    currentState.statusFilter = e.target.value;
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('pageSize').addEventListener('change', e => {
    currentState.pageSize = parseInt(e.target.value);
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('fetchBtn').addEventListener('click', () => {
    fetchData();
  });

  // Pagination buttons
  document.getElementById('firstPage').addEventListener('click', () => {
    currentState.page = 1;
    renderTable();
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentState.page > 1) currentState.page--;
    renderTable();
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    const maxPage = Math.ceil(currentState.totalItems / currentState.pageSize);
    if (currentState.page < maxPage) currentState.page++;
    renderTable();
  });

  document.getElementById('lastPage').addEventListener('click', () => {
    currentState.page = Math.ceil(currentState.totalItems / currentState.pageSize);
    renderTable();
  });

  // Column sorting
  document.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.innerText.trim().toLowerCase();
      if (['id', 'name', 'certificate type', 'date', 'status'].includes(column)) {
        const key = column === 'certificate type' ? 'type' : column === 'name' ? 'username' : column;
        currentState.sortColumn = key;
        currentState.sortDirection = currentState.sortDirection === 'asc' ? 'desc' : 'asc';
        renderTable();
      }
    });
  });

  // Event delegation for action buttons
  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.action-btn');
    if (!actionBtn) return;
    
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;
    
    switch(action) {
      case 'view':
        viewCertificate(id, actionBtn.closest('tr').querySelector('td:nth-child(3)').textContent);
        break;
      case 'approve':
      case 'reject':
        updateCertificateStatus(id, action);
        break;
    }
  });
}

function renderTable() {
  let filteredData = filterData(sampleData);
  filteredData = sortData(filteredData);
  currentState.totalItems = filteredData.length;

  const paginatedData = paginateData(filteredData);
  const tbody = document.getElementById('dataBody');
  tbody.innerHTML = '';

  paginatedData.forEach(item => {
    const row = document.createElement('tr');
    const statusClass = `badge-${item.status}`;
    const typeDisplay = {
      'birth': 'Birth Certificate',
      'marriage': 'Marriage Certificate',
      'death': 'Death Certificate',
      'cenomar': 'Cenomar Certificate',
      'cenodeath': 'Cenodeath Certificate'
    }[item.type] || item.type;

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.username}</td>
      <td>${typeDisplay}</td>
      <td>${formatDate(item.date)}</td>
      <td><span class="badge ${statusClass}">${capitalizeFirstLetter(item.status)}</span></td>
      <td>
        <button class="action-btn action-btn-view" data-id="${item.id}" data-action="view">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="action-btn action-btn-approve" data-id="${item.id}" data-action="approve">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="action-btn action-btn-reject" data-id="${item.id}" data-action="reject">
          <i class="fas fa-times"></i> Reject
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationInfo(currentState.totalItems);
}

function filterData(data) {
  return data.filter(item => {
    const matchesSearch = currentState.searchQuery === '' ||
      item.username.toLowerCase().includes(currentState.searchQuery.toLowerCase()) ||
      item.id.toString().includes(currentState.searchQuery) ||
      item.type.toLowerCase().includes(currentState.searchQuery.toLowerCase());

    const itemDate = new Date(item.date);
    const matchesDate = (!currentState.dateRange.start || itemDate >= new Date(currentState.dateRange.start)) &&
                       (!currentState.dateRange.end || itemDate <= new Date(currentState.dateRange.end));

    const matchesType = currentState.dataType === 'all' || item.type === currentState.dataType;

    return matchesSearch && matchesDate && matchesType;
  });
}

function sortData(data) {
  return data.sort((a, b) => {
    const valA = a[currentState.sortColumn];
    const valB = b[currentState.sortColumn];
    if (valA < valB) return currentState.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentState.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

function paginateData(data) {
  const start = (currentState.page - 1) * currentState.pageSize;
  const end = start + currentState.pageSize;
  return data.slice(start, end);
}

function updatePaginationInfo(total) {
  const startItem = (currentState.page - 1) * currentState.pageSize + 1;
  const endItem = Math.min(startItem + currentState.pageSize - 1, total);
  document.getElementById('startItem').textContent = total === 0 ? 0 : startItem;
  document.getElementById('endItem').textContent = endItem;
  document.getElementById('totalItems').textContent = total;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function viewCertificate(id, type) {
  // Convert the display type back to the internal type
  const typeMap = {
    'Birth Certificate': 'birth',
    'Marriage Certificate': 'marriage',
    'Death Certificate': 'death',
    'Cenomar Certificate': 'cenomar',
    'Cenodeath Certificate': 'cenodeath'
  };
  
  const internalType = typeMap[type] || type;
  window.location.href = `view_certificate.php?type=${internalType}&id=${id}`;
}

function updateCertificateStatus(id, action) {
  if (!confirm(`Are you sure you want to ${action} this certificate?`)) {
    return;
  }

  fetch('update_status.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      action: action
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(`Certificate ${action}d successfully!`);
      fetchData(); // Refresh the table
    } else {
      alert(`Error: ${data.message || 'Failed to update status'}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while updating the status');
  });
}

function logout() {
  sessionStorage.removeItem("isAdmin");
  window.location.href = '../index.php';
}

/*
function website() {
  window.location.href = "../Certification/Certificate.php";
} 
*/