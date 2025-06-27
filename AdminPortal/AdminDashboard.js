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

const adminRole = localStorage.getItem('adminRole') || 'Guest';

document.addEventListener('DOMContentLoaded', () => {
  //  Show Admin Role in Sidebar 
  const adminUser = localStorage.getItem('adminUsername');
  if (adminUser && adminRole) {
    const infoBox = document.getElementById('adminInfo');
    if (infoBox) {
      infoBox.textContent = `(${adminRole})`;
    }
  }

  //  Role-based Menu Visibility
  document.querySelectorAll('.menu-item').forEach(item => {
    const role = item.dataset.role;
    const visibleTo = item.dataset.visibleTo;

    if (visibleTo === 'all') {
      item.style.display = 'block';
    } else if (!role) {
      item.style.display = 'none';
    } else if (adminRole === 'Super Admin') {
      item.style.display = 'block';
    } else if (role === adminRole) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  //  Load data and set event listeners
  fetchData();
  setupEventListeners();
});


function fetchData() {
  // Show loading state
  const tableBody = document.querySelector('#certificateTable tbody');
  if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading data...</td></tr>';
  
  // Build query parameters
  const params = new URLSearchParams();
  if (currentState.statusFilter && currentState.statusFilter !== 'all') {
    params.append('status', currentState.statusFilter.toUpperCase());
  }

  // Add timestamp to prevent caching
  params.append('_', new Date().getTime());
  
  const url = `../AdminPortal/getCertificate.php?${params.toString()}`;
  console.log('Fetching data from:', url);
  
  // Show loading toast
  showToast('info', 'Loading certificate data...', 3000);
  
  fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Requested-With': 'XMLHttpRequest'
    },
    // Force fresh request
    cache: 'no-store'
  })
  .then(async response => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON, got ${contentType}. Response: ${text.substring(0, 200)}...`);
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data); // Debug log
    
    if (!data) {
      throw new Error('No data received from server');
    }
    
    if (!data.success) {
      throw new Error(data.message || 'Request was not successful');
    }
    
    if (!data.data) {
      throw new Error('No data object in response');
    }
    
    if (!Array.isArray(data.data.certificates)) {
      console.error('Invalid certificates data:', data.data);
      throw new Error('Invalid data format: expected certificates array');
    }
    
    sampleData = data.data.certificates || [];
    console.log(`Loaded ${sampleData.length} certificates`);
    
    // Update dashboard counts if available
    if (data.data.counts) {
      updateDashboardCounts(data.data.counts);
    }
    
    // If we have data but the table is empty, show a message
    if (sampleData.length === 0) {
      showToast('info', 'No certificates found matching your criteria', 3000);
    }
    currentState.totalItems = sampleData.length;
    
    console.log(`Loaded ${sampleData.length} certificates`);
    
    // Update dashboard counts if available
    if (data.data.counts) {
      updateDashboardCounts(data.data.counts);
    }
    
    renderTable();
  })
  .catch(error => {
    console.error('Fetch Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-red-500">
            Error loading data: ${errorMessage}
            <br><br>
            <button onclick="window.location.reload()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Retry
            </button>
          </td>
        </tr>`;
    }
  });
}

// Add this function to update dashboard counts
function updateDashboardCounts(counts) {
  const elements = {
    'pending': 'pending-count',
    'received': 'received-count',
    'processing': 'processing-count',
    'signed': 'signed-count',
    'ready_for_release': 'ready-count',
    'released': 'released-count',
    'rejected': 'rejected-count'
  };

  Object.entries(elements).forEach(([key, id]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = counts[key] || 0;
    }
  });
}

function setupEventListeners() {
  // Add event delegation for action buttons
  document.addEventListener('click', (e) => {
    // Check if clicked element or its parent has the action-btn class
    const actionBtn = e.target.closest('.action-btn');
    if (!actionBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const action = actionBtn.getAttribute('data-action');
    const id = actionBtn.getAttribute('data-id');
    let type = actionBtn.getAttribute('data-type');
    
    // Ensure we have a valid certificate type
    if (!type || type === 'undefined') {
      console.warn('No certificate type found, using default');
      type = 'birth'; // Default to 'birth' if type is not provided
    }
    
    console.log('Action button clicked:', { action, id, type });
    
    if (action === 'view') {
      console.log('Viewing certificate:', { id, type });
      openCertificateModal(id, type);
    } else if (['process', 'receive', 'verify', 'approve', 'release', 'reject'].includes(action)) {
      console.log('Processing action:', action);
      let reason = '';
      if (action === 'reject') {
        reason = prompt('Please enter the reason for rejection:');
        if (reason === null) {
          console.log('User cancelled rejection');
          return; // User cancelled
        }
      }
      console.log('Calling updateCertificateStatus with:', { id, action, type, reason });
      let newStatus = 'PROCESSING';
      if (adminRole === 'Receiving Clerk') {
        newStatus = 'RECEIVED';
      }
      updateCertificateStatus(id, newStatus, type, reason);
    } else {
      console.error('Unknown action:', action);
    }
  });

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
}

function renderTable() {
  try {
    console.log('Rendering table with data:', sampleData);
    
    const tbody = document.getElementById('dataBody');
    if (!tbody) {
      console.error('Table body element not found');
      return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    if (!Array.isArray(sampleData)) {
      console.error('sampleData is not an array:', sampleData);
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">
            <i class="fas fa-exclamation-triangle"></i> Error: Invalid data format
          </td>
        </tr>`;
      return;
    }
    
    if (sampleData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
            No certificates found
          </td>
        </tr>`;
      return;
    }

    let filteredData = filterData(sampleData);
    console.log('Filtered data:', filteredData);
    
    if (filteredData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            <i class="fas fa-filter fa-2x mb-2 d-block"></i>
            No certificates match the current filters
          </td>
        </tr>`;
      return;
    }
    
    filteredData = sortData(filteredData);
    currentState.totalItems = filteredData.length;
    console.log('Sorted data:', filteredData, 'Total items:', currentState.totalItems);

    const paginatedData = paginateData(filteredData);
    console.log('Paginated data:', paginatedData);

    if (paginatedData.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `
        <td colspan="6" class="text-center py-4">
          No records found matching your criteria.
          <button onclick="fetchData()" class="ml-2 text-blue-500 hover:text-blue-700">
            Refresh
          </button>
        </td>`;
      tbody.appendChild(noDataRow);
      updatePaginationInfo(0);
      return;
    }

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    paginatedData.forEach((item, index) => {
      try {
        if (!item || typeof item !== 'object') {
          console.warn('Invalid item at index', index, ':', item);
          return; // Skip invalid items
        }
        
        console.log('Rendering item:', item);
        
        // Extract item data with defaults
        const status = (item.status || 'PENDING').toLowerCase();
        const statusClass = `badge-${status}`;
        
        // Use type_label if available, otherwise fall back to the old mapping
        const typeDisplay = item.type_label || {
          'birth': 'Birth Certificate',
          'marriage': 'Marriage Certificate',
          'death': 'Death Certificate',
          'cenomar': 'CENOMAR',
          'cenodeath': 'CENODEATH',
          'birth_certi': 'Birth Certificate',
          'marriage_certi': 'Marriage Certificate',
          'death_certi': 'Death Certificate',
          'cenomar_certi': 'CENOMAR',
          'cenodeath_certi': 'CENODEATH'
        }[item.type || item.cert_type || ''] || 'Certificate';

        // Determine available actions based on role and status
        let canView = true;
        let canProcess = false;
        // Only allow View for Super Admin
        if (adminRole === 'Super Admin') {
          canView = true;
        } else {
          // Normal workflow for other roles
          canProcess = ['Receiving Clerk'].includes(adminRole) && status && status.toUpperCase() === 'PENDING';
          let canVerify = ['Verifying Officer'].includes(adminRole) && status === 'received';
          let canApprove = ['Document Signatory Officer'].includes(adminRole) && status === 'paid';
          let canRelease = ['Releasing Officer'].includes(adminRole) && ['signed', 'ready_for_release'].includes(status);
          let canReject = ['Verifying Officer', 'Document Signatory Officer'].includes(adminRole) && 
                         ['pending', 'received', 'processing', 'paid'].includes(status);
        }

        // Format the date
        const formattedDate = item.created_at ? formatDate(item.created_at) : 'N/A';
        
        // Create row element
        const row = document.createElement('tr');
        
        // Set row data attributes for easier debugging
        row.dataset.id = item.id || 'unknown';
        row.dataset.type = item.cert_type || 'unknown';
        
        const certId = item.cert_id || item.id;
        const certType = item.cert_type || item.type;
        let viewButtonHtml = '';
        if (canView) {
          if (certId && certType) {
            viewButtonHtml = `<button class="action-btn action-btn-view" data-id="${certId}" data-type="${certType}" data-action="view"><i class="fas fa-eye"></i> View</button>`;
          } else {
            console.warn('Missing certId or certType for row:', item);
          }
        }
        let processButtonHtml = '';
        if (canProcess && certId && certType) {
          processButtonHtml = `<button class="action-btn action-btn-process" data-id="${certId}" data-type="${certType}" data-action="process"><i class="fas fa-check"></i> Mark as Received</button>`;
        }
        row.innerHTML = `
          <td>${item.reference_number || 'N/A'}</td>
          <td>${item.full_name || 'N/A'}</td>
          <td>${typeDisplay} ${item.type_label ? '' : '(Legacy)'}</td>
          <td>${formattedDate}</td>
          <td><span class="badge ${statusClass}">${capitalizeFirstLetter(status.replace('_', ' '))}</span></td>
          <td class="action-buttons">
            ${viewButtonHtml}
            ${processButtonHtml}
          </td>
        `;
      
        // Add row to fragment
        fragment.appendChild(row);
      } catch (error) {
        console.error('Error rendering row:', error, item);
        // Add error row for debugging
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
          <td colspan="6" class="text-red-500 p-2 bg-red-50">
            Error displaying row: ${error.message}
            <button onclick="console.log(${JSON.stringify(item)});" class="ml-2 text-xs text-blue-500">
              Show data
            </button>
          </td>`;
        fragment.appendChild(errorRow);
      }
    });

    // Append all rows at once
    tbody.appendChild(fragment);
    
    // Update pagination with the filtered data length
    updatePaginationInfo(filteredData.length);
    
  } catch (error) {
    console.error('Error in renderTable:', error);
    const tbody = document.getElementById('dataBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-red-500">
            Error rendering table: ${error.message}
            <button onclick="window.location.reload()" class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
              Reload Page
            </button>
          </td>
        </tr>`;
    }
  }

  updatePaginationInfo(currentState.totalItems);
}

function filterData(data) {
  if (!Array.isArray(data)) {
    console.error('filterData: data is not an array', data);
    return [];
  }

  return data.filter(item => {
    try {
      if (!item) return false;
      
      const searchQuery = (currentState.searchQuery || '').toLowerCase();
      const itemName = (item.full_name || '').toLowerCase();
      const referenceNumber = (item.reference_number || '').toLowerCase();
      const certType = (item.type || item.cert_type || '').toLowerCase(); // Handle both type and cert_type
      const itemStatus = (item.status || 'PENDING').toLowerCase();
      
      // Search matches (name, reference number, or certificate type)
      const matchesSearch = !searchQuery || 
        itemName.includes(searchQuery) || 
        referenceNumber.includes(searchQuery) ||
        certType.includes(searchQuery) ||
        (item.full_name && item.full_name.toLowerCase().includes(searchQuery));

      // Date filter
      const itemDate = item.created_at ? new Date(item.created_at) : null;
      const startDate = currentState.dateRange.start ? new Date(currentState.dateRange.start) : null;
      const endDate = currentState.dateRange.end ? new Date(currentState.dateRange.end) : null;
      
      // Set time to start/end of day for proper date range comparison
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);
      
      const matchesDate = !startDate || !endDate || 
        (itemDate && itemDate >= startDate && itemDate <= endDate);

      // Certificate type filter - compare case-insensitive and handle both type and cert_type
      const matchesType = currentState.dataType === 'all' || 
        (certType && currentState.dataType && 
         certType.toLowerCase() === currentState.dataType.toLowerCase());

      // Status filter
      const filterStatus = (currentState.statusFilter || '').toLowerCase();
      const matchesStatus = filterStatus === 'all' || 
        itemStatus === filterStatus;

      return matchesSearch && matchesDate && matchesType && matchesStatus;
    } catch (error) {
      console.error('Error filtering item:', error, item);
      return false;
    }
  });
}

function sortData(data) {
  if (!Array.isArray(data)) {
    console.error('sortData: data is not an array', data);
    return [];
  }

  return [...data].sort((a, b) => {
    try {
      let valueA, valueB;
      const column = currentState.sortColumn || 'created_at';
      
      // Handle different column types
      switch (column) {
        case 'date':
        case 'created_at':
        case 'updated_at':
          valueA = a[column] ? new Date(a[column]).getTime() : 0;
          valueB = b[column] ? new Date(b[column]).getTime() : 0;
          break;
        case 'status':
        case 'cert_type':
        case 'full_name':
        case 'reference_number':
          valueA = (a[column] || '').toString().toLowerCase();
          valueB = (b[column] || '').toString().toLowerCase();
          break;
        case 'id':
          valueA = parseInt(a[column] || 0, 10);
          valueB = parseInt(b[column] || 0, 10);
          break;
        default:
          valueA = a[column];
          valueB = b[column];
      }

      // Handle null/undefined values
      if (valueA == null) return currentState.sortDirection === 'asc' ? -1 : 1;
      if (valueB == null) return currentState.sortDirection === 'asc' ? 1 : -1;
      
      // Compare values
      if (valueA < valueB) {
        return currentState.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return currentState.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    } catch (error) {
      console.error('Error sorting items:', error, { a, b });
      return 0;
    }
  });
}

function paginateData(data) {
  const start = (currentState.page - 1) * currentState.pageSize;
  const end = start + currentState.pageSize;
  return data.slice(start, end);
}

function updatePaginationInfo(total) {
  try {
    const startItem = (currentState.page - 1) * currentState.pageSize + 1;
    const endItem = Math.min(startItem + currentState.pageSize - 1, total);
    
    // Safely update pagination elements if they exist
    const updateElement = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
      else console.warn(`Element with ID '${id}' not found`);
    };
    
    updateElement('startItem', total === 0 ? 0 : startItem);
    updateElement('endItem', endItem);
    updateElement('totalItems', total);
    
    // Update pagination controls
    const prevBtn = document.querySelector('.pagination .page-item:first-child');
    const nextBtn = document.querySelector('.pagination .page-item:last-child');
    
    if (prevBtn) {
      prevBtn.classList.toggle('disabled', currentState.page <= 1);
    }
    
    if (nextBtn) {
      nextBtn.classList.toggle('disabled', endItem >= total);
    }
    
  } catch (error) {
    console.error('Error updating pagination:', error);
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openCertificateModal(certId, certType) {
  resetInspectionModalContent();
  fetch(`../Roles/get_certificate_details.php?id=${certId}&type=${certType}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data && data.data.certificate) {
        populateModalWithCertificate(data.data.certificate, certType);
        document.getElementById('inspectionModal').style.display = 'flex';
      } else {
        alert('Failed to load certificate details.');
      }
    })
    .catch(() => alert('Error loading certificate details.'));
}

function resetInspectionModalContent() {
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
}

async function updateCertificateStatus(id, action, certType, reason = '') {
  // Ensure we have a valid certificate type
  if (!certType || certType === 'undefined') {
    console.warn('No certificate type provided, using default');
    certType = 'birth'; // Default to 'birth' if type is not provided
  }
  
  console.log('Updating status:', { id, action, certType, reason });
  
  // Show loading state on the button
  const buttons = document.querySelectorAll(`button[data-id="${id}"][data-type*="${certType}"]`);
  console.log('Found buttons:', buttons.length);
  
  buttons.forEach(btn => {
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.dataset.originalHTML = originalHTML;
  });

  try {
    // Map action to display name for user feedback
    const actionNames = {
      'process': 'Processing',
      'receive': 'Marking as Received',
      'verify': 'Verifying',
      'approve': 'Approving',
      'release': 'Releasing',
      'reject': 'Rejecting'
    };
    
    // Map frontend actions to backend statuses
    const actionToStatus = {
      'receive': 'RECEIVED',
      'process': 'PROCESSING',
      'verify': 'VERIFIED',
      'approve': 'APPROVED',
      'release': 'RELEASED',
      'reject': 'REJECTED'
    };
    
    // Get the new status based on action and ensure it's in uppercase
    const newStatus = (actionToStatus[action] || action).toUpperCase();
    console.log('Mapped status:', { action, newStatus });

    const requestBody = {
      action: 'update_status',
      cert_id: id,
      cert_type: certType,
      new_status: newStatus,
      remarks: reason || '',
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending request:', requestBody);
    
    const response = await fetch('../Roles/process_status.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(requestBody)
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON response, got ${contentType}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update status');
    }

    // Show success message
    showToast('success', `${actionNames[action] || 'Action'} completed successfully!`);
    
    // Refresh the data after a short delay
    setTimeout(() => {
      fetchData();
    }, 1000);
    
  } catch (error) {
    console.error('Error updating status:', error);
    
    // Show detailed error message
    const errorMessage = error.message || 'An unknown error occurred';
    console.error('Full error:', error);
    
    // Show error message
    showToast('error', `Error: ${errorMessage}`);
    
    // Reset buttons
    if (buttons && buttons.length > 0) {
      buttons.forEach(btn => {
        if (btn && btn.dataset && btn.dataset.originalHTML) {
          btn.innerHTML = btn.dataset.originalHTML;
        }
        if (btn) {
          btn.disabled = false;
        }
      });
    }
  }
}

/**
 * Shows a toast notification
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {string} message - Message to display
 * @param {number} [duration=5000] - How long to show the toast in ms
 */
function showToast(type, message, duration = 5000) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Set toast styles
  toast.style.minWidth = '250px';
  toast.style.marginBottom = '10px';
  toast.style.padding = '15px 20px';
  toast.style.borderRadius = '4px';
  toast.style.color = 'white';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.justifyContent = 'space-between';
  toast.style.animation = 'slideIn 0.3s ease-out';
  
  // Set background color based on type
  const colors = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3'
  };
  
  toast.style.backgroundColor = colors[type] || colors.info;
  
  // Add message
  const messageEl = document.createElement('span');
  messageEl.textContent = message;
  toast.appendChild(messageEl);
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.marginLeft = '10px';
  closeBtn.style.padding = '0 5px';
  closeBtn.onclick = () => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  };
  toast.appendChild(closeBtn);
  
  // Add to container
  container.insertBefore(toast, container.firstChild);
  
  // Auto remove after duration
  const timeout = setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
  
  // Pause timeout on hover
  toast.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
  });
  
  // Resume timeout when mouse leaves
  toast.addEventListener('mouseleave', () => {
    clearTimeout(timeout);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 1000);
  });
}

// Add CSS animations if they don't exist
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function website() {
  window.location.href = "../Certification/Certificate.php";
}