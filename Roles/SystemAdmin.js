function updateAdminStatuses() {
  const users = JSON.parse(sessionStorage.getItem('users') || '[]');
  const loggedInUsername = sessionStorage.getItem('adminUsername');

  const updatedUsers = users.map(user => ({
    ...user,
    status: user.username === loggedInUsername ? 'active' : 'inactive',
    lastActive: user.username === loggedInUsername ? new Date().toISOString() : user.lastActive
  }));

  sessionStorage.setItem('users', JSON.stringify(updatedUsers));
}

document.addEventListener('DOMContentLoaded', function () {
  updateAdminStatuses();
  initializeStorage();
  setupEventListeners();
  loadDashboardData();
  loadUsers();
  loadContentFields();
  loadBackups();
  loadEventLogs();

  const hash = window.location.hash.substring(1) || 'dashboard';
  showSection(hash);
  document.querySelector(`.nav-link[data-section="${hash}"]`).classList.add('active');
});

function initializeStorage() {
  if (!sessionStorage.getItem('systemAdminInitialized')) {
    const adminList = window.ADMIN_ACCOUNTS || [];

    const users = adminList.map((admin, index) => ({
      id: index + 1,
      username: admin.username,
      email: admin.username + "@civilregistry.gov",
      role: admin.role,
      status: "inactive", 
      lastActive: null 
    
    }));
    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('systemAdminInitialized', 'true');

    const contentFields = [
      { id: 1, name: 'homepage_title', label: 'Homepage Title', type: 'text', value: 'Welcome to Our System' },
      { id: 2, name: 'homepage_content', label: 'Homepage Content', type: 'richtext', value: '<p>This is the main content of our homepage. You can edit it here.</p>' },
      { id: 3, name: 'contact_email', label: 'Contact Email', type: 'text', value: 'contact@example.com' },
      { id: 4, name: 'max_login_attempts', label: 'Max Login Attempts', type: 'number', value: '5' },
      { id: 5, name: 'maintenance_mode', label: 'Maintenance Mode', type: 'boolean', value: 'false' }
    ];
    sessionStorage.setItem('contentFields', JSON.stringify(contentFields));

    const backups = [
      { id: 1, name: 'Full Backup July 20', type: 'full', date: '2023-07-20T00:00:00', size: '2.5 GB', status: 'completed', description: 'Nightly full system backup', contents: 'System files, databases, configurations' },
      { id: 2, name: 'DB Backup July 19', type: 'database', date: '2023-07-19T00:00:00', size: '1.2 GB', status: 'completed', description: 'Database only backup', contents: 'All database tables and records' },
      { id: 3, name: 'Config Backup July 18', type: 'config', date: '2023-07-18T12:30:00', size: '45 MB', status: 'completed', description: 'Configuration files backup', contents: 'System configuration files' }
    ];
    sessionStorage.setItem('backups', JSON.stringify(backups));

    const eventLogs = [
      { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'System Admin initialized dashboard', user: 'System' }
    ];
    sessionStorage.setItem('eventLogs', JSON.stringify(eventLogs));
    sessionStorage.setItem('systemAdminInitialized', 'true');
  }
}

function setupEventListeners() {
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      showSection(section);
      document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  ['sidebarToggle', 'sidebarToggleTop'].forEach(id => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('content').classList.toggle('active');
      });
    }
  });

  const btns = [
    { id: 'confirmAddUser', handler: addUser },
    { id: 'confirmEditUser', handler: updateUser },
    { id: 'confirmDeleteUser', handler: deleteUser },
    { id: 'confirmAddContentField', handler: addContentField },
    { id: 'saveContentBtn', handler: saveContentFields },
    { id: 'confirmBackup', handler: runCustomBackup },
    { id: 'confirmScheduleBackup', handler: scheduleBackup },
    { id: 'clearLogsBtn', handler: clearLogs },
    { id: 'exportLogsBtn', handler: exportLogs }
  ];

  btns.forEach(({ id, handler }) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  });

  const addContentBtn = document.getElementById('addContentFieldBtn');
  if (addContentBtn) {
    addContentBtn.addEventListener('click', () => {
      new bootstrap.Modal(document.getElementById('addContentFieldModal')).show();
    });
  }

  const runBtn = document.getElementById('runBackupBtn');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      new bootstrap.Modal(document.getElementById('backupOptionsModal')).show();
    });
  }

  const scheduleBackupBtn = document.getElementById('scheduleBackupBtn');
  if (scheduleBackupBtn) {
    scheduleBackupBtn.addEventListener('click', () => {
      new bootstrap.Modal(document.getElementById('scheduleBackupModal')).show();
    });
  }

  const scheduleFrequency = document.getElementById('scheduleFrequency');
  if (scheduleFrequency) {
    scheduleFrequency.addEventListener('change', function () {
      const group = document.getElementById('customScheduleGroup');
      if (group) group.style.display = this.value === 'custom' ? 'block' : 'none';
    });
  }

  document.querySelectorAll('.backup-option').forEach(option => {
    option.addEventListener('click', function () {
      const type = this.getAttribute('data-type');
      startBackup(type);
    });
  });

  document.querySelectorAll('.filter-log').forEach(filter => {
    filter.addEventListener('click', function (e) {
      e.preventDefault();
      const level = this.getAttribute('data-level');
      filterLogs(level);
      document.querySelectorAll('.filter-log').forEach(item => item.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function showSection(section) {
  document.querySelectorAll('.dashboard-section').forEach(div => {
    div.style.display = 'none';
  });

  document.getElementById(`${section}Section`).style.display = 'block';
  window.location.hash = section;

  switch (section) {
    case 'users': loadUsers(); break;
    case 'content': loadContentFields(); break;
    case 'backups': loadBackups(); break;
    case 'logs': loadEventLogs(); break;
  }
}
// Load dashboard data and charts
function loadDashboardData() {
  const users = JSON.parse(sessionStorage.getItem('users'));
  const contentFields = JSON.parse(sessionStorage.getItem('contentFields'));
  const backups = JSON.parse(sessionStorage.getItem('backups'));
  const eventLogs = JSON.parse(sessionStorage.getItem('eventLogs'));

  // Update dashboard stats
  document.getElementById('activeUsersCount').textContent = users.filter(u => u.status === 'active').length;
  document.getElementById('contentPagesCount').textContent = contentFields.length;
  document.getElementById('backupsCount').textContent = backups.length;
  document.getElementById('securityEventsCount').textContent = eventLogs.filter(e => e.level === 'security').length;

  // Load recent event logs
  const recentActivityLog = document.getElementById('recentActivityLog');
  recentActivityLog.innerHTML = '';

  eventLogs.slice(0, 5).forEach(log => {
    const logItem = document.createElement('div');
    logItem.className = 'event-log-item';
    const icon = getLogLevelIcon(log.level);
    const time = formatDateTime(log.timestamp);
    logItem.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>${icon} ${log.message}</div>
        <div class="event-time">${time}</div>
      </div>
    `;
    recentActivityLog.appendChild(logItem);
  });

  // Destroy old chart if it exists
  if (roleChartInstance instanceof Chart) {
    roleChartInstance.destroy();
  }

  // Count user roles dynamically
  const roleCounts = {};
  users.forEach(user => {
    const role = user.role || 'Unknown';
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });

  const ctx = document.getElementById('roleDistributionChart').getContext('2d');

  // Build dynamic doughnut chart
  roleChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(roleCounts),
      datasets: [{
        data: Object.values(roleCounts),
        backgroundColor: [
          '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e',
          '#e74a3b', '#858796', '#20c9a6', '#fd7e14'
        ],
        hoverBackgroundColor: [
          '#2e59d9', '#17a673', '#2c9faf', '#dda20a',
          '#be2617', '#6c757d', '#198754', '#fd6104'
        ],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      cutout: '80%',
    }
  });
}

// Load users into the table
function loadUsers() {
  const users = JSON.parse(sessionStorage.getItem('users'));
  const tableBody = document.getElementById('usersTableBody');
  tableBody.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    const roleBadge = getRoleBadge(user.role);
    const statusBadge = getStatusBadge(user.status);
    const lastActive = formatDateTime(user.lastActive);
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${roleBadge}</td>
      <td>${statusBadge}</td>
      <td>${lastActive}</td>
      <td>
        <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}" style="margin-left: 11px;">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-user').forEach(btn => {
    btn.addEventListener('click', function () {
      const userId = parseInt(this.getAttribute('data-id'));
      editUser(userId);
    });
  });

  document.querySelectorAll('.delete-user').forEach(btn => {
    btn.addEventListener('click', function () {
      const userId = parseInt(this.getAttribute('data-id'));
      confirmDeleteUser(userId);
    });
  });
}

// Add a new user
function addUser() {
  const username = document.getElementById('newUsername').value;
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;
  const role = document.querySelector('input[name="newUserRole"]:checked').value;

  const users = JSON.parse(sessionStorage.getItem('users'));
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    username,
    email,
    role,
    status: 'inactive',
    lastActive: null
  };

  users.push(newUser);
  sessionStorage.setItem('users', JSON.stringify(users));

  // Close modal and reset form
  const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
  modal.hide();
  document.getElementById('addUserForm').reset();

  // Reload users and dashboard
  loadUsers();
  loadDashboardData();

  // Log event
  addEventLog('info', `Added new user: ${username} (${role})`, 'admin');
}

        
 // Edit user - open modal with user data
function editUser(userId) {
  const users = JSON.parse(sessionStorage.getItem('users'));
  const user = users.find(u => u.id === userId);

  if (user) {
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;

    // Set role radio button
    document.getElementById(`editRole${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`).checked = true;

    // Set status radio button
    document.getElementById(`editStatus${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`).checked = true;

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
  }
}

// Update user after editing
function updateUser() {
  const userId = parseInt(document.getElementById('editUserId').value);
  const username = document.getElementById('editUsername').value;
  const email = document.getElementById('editEmail').value;
  const role = document.querySelector('input[name="editUserRole"]:checked').value;
  const status = document.querySelector('input[name="editUserStatus"]:checked').value;

  const users = JSON.parse(sessionStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex].username = username;
    users[userIndex].email = email;
    users[userIndex].role = role;
    users[userIndex].status = status;

    sessionStorage.setItem('users', JSON.stringify(users));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    modal.hide();

    // Reload users and dashboard
    loadUsers();
    loadDashboardData();

    // Log event
    addEventLog('info', `Updated user: ${username} (${role})`, 'admin');
  }
}

// Confirm user deletion
function confirmDeleteUser(userId) {
  const users = JSON.parse(sessionStorage.getItem('users'));
  const user = users.find(u => u.id === userId);

  if (user) {
    document.getElementById('deleteUserName').textContent = `${user.username} (${user.email})`;
    document.getElementById('confirmDeleteUser').setAttribute('data-id', userId);

    const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    modal.show();
  }
}

// Delete user after confirmation
function deleteUser() {
  const userId = parseInt(this.getAttribute('data-id'));
  const users = JSON.parse(sessionStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    sessionStorage.setItem('users', JSON.stringify(users));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
    modal.hide();

    // Reload users and dashboard
    loadUsers();
    loadDashboardData();

    // Log event
    addEventLog('warning', `Deleted user: ${deletedUser.username}`, 'admin');
  }
}

        // Load content fields
function loadContentFields() {
  const contentFields = JSON.parse(sessionStorage.getItem('contentFields'));
  const container = document.getElementById('contentFieldsContainer');
  container.innerHTML = '';

  contentFields.forEach(field => {
    const fieldElement = document.createElement('div');
    fieldElement.className = 'content-field';
    fieldElement.setAttribute('data-id', field.id);

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-2';
    header.innerHTML = `
      <h5>${field.label}</h5>
      <button class="btn btn-sm btn-danger delete-content-field">
        <i class="bi bi-trash"></i>
      </button>
    `;

    const info = document.createElement('div');
    info.className = 'mb-2';
    info.innerHTML = `
      <small class="text-muted">Field name: ${field.name}</small>
      <small class="text-muted ms-2">Type: ${field.type}</small>
    `;

    // Create input field
    let input;
    switch (field.type) {
      case 'text':
      case 'number':
        input = document.createElement('input');
        input.type = field.type;
        break;
      case 'textarea':
      case 'richtext':
        input = document.createElement('textarea');
        input.rows = field.type === 'richtext' ? 5 : 3;
        break;
      case 'boolean':
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = field.value === 'true';
        break;
      default:
        input = document.createElement('input');
        input.type = 'text';
    }

    input.className = 'form-control field-value';
    input.dataset.name = field.name;
    if (field.type !== 'boolean') {
      input.value = field.value;
    }

    // Attach live save listener
    input.addEventListener('input', saveFieldChange);
    if (field.type === 'boolean') {
      input.addEventListener('change', saveFieldChange);
    }

    // Combine parts
    fieldElement.appendChild(header);
    fieldElement.appendChild(info);
    fieldElement.appendChild(input);
    container.appendChild(fieldElement);

    // Delete button handler
    header.querySelector('.delete-content-field').addEventListener('click', function () {
      deleteContentField(field.id);
    });
  });
}

function saveFieldChange(e) {
  const fields = JSON.parse(sessionStorage.getItem('contentFields')) || [];
  const name = e.target.dataset.name;
  const updatedValue = e.target.type === 'checkbox' ? (e.target.checked ? 'true' : 'false') : e.target.value;

  const targetField = fields.find(f => f.name === name);
  if (targetField) {
    targetField.value = updatedValue;
  }

  sessionStorage.setItem('contentFields', JSON.stringify(fields));
}

 // Add new content field
function addContentField() {
  const name = document.getElementById('newFieldName').value;
  const label = document.getElementById('newFieldLabel').value;
  const type = document.getElementById('newFieldType').value;

  const contentFields = JSON.parse(sessionStorage.getItem('contentFields'));
  const newId = contentFields.length > 0 ? Math.max(...contentFields.map(f => f.id)) + 1 : 1;

  const newField = {
    id: newId,
    name,
    label,
    type,
    value: type === 'boolean' ? 'false' : ''
  };

  contentFields.push(newField);
  sessionStorage.setItem('contentFields', JSON.stringify(contentFields));

  // Close modal and reset form
  const modal = bootstrap.Modal.getInstance(document.getElementById('addContentFieldModal'));
  modal.hide();
  document.getElementById('addContentFieldForm').reset();

  // Reload content fields
  loadContentFields();

  // Log event
  addEventLog('info', `Added new content field: ${label} (${name})`, 'admin');
}

// Delete content field
function deleteContentField(fieldId) {
  const contentFields = JSON.parse(sessionStorage.getItem('contentFields'));
  const fieldIndex = contentFields.findIndex(f => f.id === fieldId);

  if (fieldIndex !== -1) {
    const deletedField = contentFields[fieldIndex];
    contentFields.splice(fieldIndex, 1);
    sessionStorage.setItem('contentFields', JSON.stringify(contentFields));

    // Reload content fields
    loadContentFields();

    // Log event
    addEventLog('warning', `Deleted content field: ${deletedField.label}`, 'admin');
  }
}

// Save all content field changes
function saveContentFields() {
  const contentFields = JSON.parse(sessionStorage.getItem('contentFields'));
  const fieldElements = document.querySelectorAll('.content-field');

  fieldElements.forEach(fieldElement => {
    const fieldId = parseInt(fieldElement.getAttribute('data-id'));
    const fieldIndex = contentFields.findIndex(f => f.id === fieldId);

    if (fieldIndex !== -1) {
      const field = contentFields[fieldIndex];
      let value = '';
      if (field.type === 'boolean') {
        value = fieldElement.querySelector('.field-value').checked ? 'true' : 'false';
      } else {
        value = fieldElement.querySelector('.field-value').value;
      }
      contentFields[fieldIndex].value = value;
    }
  });

  sessionStorage.setItem('contentFields', JSON.stringify(contentFields));

  // Show success message
  alert('All content changes saved successfully!');

  // Log event
  addEventLog('info', 'Saved all content field changes', 'admin');
}

document.addEventListener('DOMContentLoaded', () => {
  const fields = JSON.parse(sessionStorage.getItem('contentFields')) || [];
  fields.forEach(f => {
    const el = document.getElementById(f.name);
    if (el) el.innerHTML = f.value;
  });
});

// Load backups
function loadBackups() {
  const backups = JSON.parse(sessionStorage.getItem('backups'));
  const tableBody = document.getElementById('backupsTableBody');
  tableBody.innerHTML = '';

  backups.forEach(backup => {
    const row = document.createElement('tr');
    const date = formatDateTime(backup.date);
    row.innerHTML = `
      <td>${date}</td>
      <td>${backup.type.charAt(0).toUpperCase() + backup.type.slice(1)} Backup</td>
      <td>${backup.size}</td>
      <td>
        <div class="btn-group" style="gap: 5px;">
          <button class="btn btn-sm btn-primary view-backup" data-id="${backup.id}" style="margin-bottom: 10px;">
            <i class="bi bi-eye"></i> View
          </button>
          <button class="btn btn-sm btn-success download-backup" data-id="${backup.id}" style="height: 50px; width: 90px;">
            <i class="bi bi-download"></i> Download
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Add event listeners to view and download buttons
  document.querySelectorAll('.view-backup').forEach(btn => {
    btn.addEventListener('click', function () {
      const backupId = parseInt(this.getAttribute('data-id'));
      viewBackup(backupId);
    });
  });

  document.querySelectorAll('.download-backup').forEach(btn => {
    btn.addEventListener('click', function () {
      const backupId = parseInt(this.getAttribute('data-id'));
      downloadBackup(backupId);
    });
  });
}

// Start backup process
function startBackup(type) {
  // Show loading state
  const backupBtn = document.getElementById('runBackupBtn');
  const originalText = backupBtn.innerHTML;
  backupBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Running Backup...';
  backupBtn.disabled = true;

  // Simulate backup process
  setTimeout(() => {
    // Create backup data
    const backups = JSON.parse(sessionStorage.getItem('backups'));
    const newId = backups.length > 0 ? Math.max(...backups.map(b => b.id)) + 1 : 1;

    const backupTypes = {
      full: 'Full System',
      database: 'Database',
      files: 'Files',
      config: 'Configuration'
    };

    const sizes = {
      full: `${(Math.random() * 3 + 1).toFixed(1)} GB`,
      database: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
      files: `${(Math.random() * 1.5 + 0.3).toFixed(1)} GB`,
      config: `${(Math.random() * 0.1 + 0.05).toFixed(2)} GB`
    };

    const newBackup = {
      id: newId,
      name: `${backupTypes[type]} Backup ${new Date().toLocaleDateString()}`,
      type,
      date: new Date().toISOString(),
      size: sizes[type],
      status: 'completed',
      description: `Automated ${backupTypes[type].toLowerCase()} backup`,
      contents: generateBackupContents(type),
      data: {
        users: JSON.parse(sessionStorage.getItem('users') || '[]'),
        documents: JSON.parse(sessionStorage.getItem('submittedCertificates') || '[]'),
        appointments: JSON.parse(sessionStorage.getItem('walkInApplications') || '[]')
      }
    };

    backups.push(newBackup);
    sessionStorage.setItem('backups', JSON.stringify(backups));

    // Reset button state
    backupBtn.innerHTML = originalText;
    backupBtn.disabled = false;

    // Reload backups and dashboard
    loadBackups();
    loadDashboardData();

    // Log event
    addEventLog('info', `Created ${backupTypes[type].toLowerCase()} backup`, 'system');

    // Show success message
    alert(`${backupTypes[type]} backup completed successfully!`);
  }, 2000);
}
// Run custom backup with options
function runCustomBackup() {
  const type = document.getElementById('backupType').value;
  const name = document.getElementById('backupName').value;
  const description = document.getElementById('backupDescription').value;
  const compress = document.getElementById('backupCompress').checked;

  // Show loading state
  const backupBtn = document.getElementById('confirmBackup');
  const originalText = backupBtn.innerHTML;
  backupBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Running Backup...';
  backupBtn.disabled = true;

  // Simulate backup process
  setTimeout(() => {
    const backups = JSON.parse(sessionStorage.getItem('backups'));
    const newId = backups.length > 0 ? Math.max(...backups.map(b => b.id)) + 1 : 1;

    const backupTypes = {
      full: 'Full System',
      database: 'Database',
      files: 'Files',
      config: 'Configuration'
    };

    const sizes = {
      full: `${(Math.random() * 3 + 1).toFixed(1)} GB`,
      database: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
      files: `${(Math.random() * 1.5 + 0.3).toFixed(1)} GB`,
      config: `${(Math.random() * 0.1 + 0.05).toFixed(2)} GB`
    };

    const size = compress ? `${(parseFloat(sizes[type]) * 0.7).toFixed(1)} GB (compressed)` : sizes[type];

    const newBackup = {
      id: newId,
      name: name || `${backupTypes[type]} Backup ${new Date().toLocaleDateString()}`,
      type,
      date: new Date().toISOString(),
      size,
      status: 'completed',
      description: description || `Custom ${backupTypes[type].toLowerCase()} backup`,
      contents: generateBackupContents(type),
      data: {
        users: JSON.parse(sessionStorage.getItem('users') || '[]'),
        documents: JSON.parse(sessionStorage.getItem('submittedCertificates') || '[]'),
        appointments: JSON.parse(sessionStorage.getItem('walkInApplications') || '[]')
      }
    };

    backups.push(newBackup);
    sessionStorage.setItem('backups', JSON.stringify(backups));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('backupOptionsModal'));
    modal.hide();

    // Reset button state
    backupBtn.innerHTML = originalText;
    backupBtn.disabled = false;

    // Reset form
    document.getElementById('backupOptionsForm').reset();

    // Reload backups and dashboard
    loadBackups();
    loadDashboardData();

    // Log event
    addEventLog('info', `Created custom ${backupTypes[type].toLowerCase()} backup: ${name}`, 'admin');

    // Show success message
    alert(`Backup "${name}" completed successfully!`);
  }, 2000);
}

// Schedule backup
function scheduleBackup() {
  const type = document.getElementById('scheduleBackupType').value;
  const frequency = document.getElementById('scheduleFrequency').value;
  const customSchedule = document.getElementById('customSchedule').value;
  const startDate = document.getElementById('scheduleStartDate').value;
  const enabled = document.getElementById('scheduleEnabled').checked;

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleBackupModal'));
  modal.hide();

  // Reset form
  document.getElementById('scheduleBackupForm').reset();

  // Show success message
  alert(`Backup scheduled to run ${frequency} starting ${startDate}. ${enabled ? 'Enabled' : 'Disabled'}`);

  // Log event
  addEventLog('info', `Scheduled ${frequency} ${type} backup starting ${startDate}`, 'admin');
}

// View backup details
function viewBackup(backupId) {
  const backups = JSON.parse(sessionStorage.getItem('backups'));
  const backup = backups.find(b => b.id === backupId);

  if (backup) {
    document.getElementById('backupDetailName').textContent = backup.name;
    document.getElementById('backupDetailType').textContent = backup.type.charAt(0).toUpperCase() + backup.type.slice(1) + ' Backup';
    document.getElementById('backupDetailDate').textContent = formatDateTime(backup.date);
    document.getElementById('backupDetailSize').textContent = backup.size;
    document.getElementById('backupDetailStatus').textContent = backup.status.charAt(0).toUpperCase() + backup.status.slice(1);
    document.getElementById('backupDetailDescription').textContent = backup.description;
    document.getElementById('backupDetailContents').textContent = backup.contents;

    // Set data-id for action buttons
    document.getElementById('restoreBackupBtn').onclick = function () {
      const id = parseInt(this.getAttribute('data-id'));
      restoreBackupData(id);
    };
    document.getElementById('deleteBackupBtn').setAttribute('data-id', backupId);

    const modal = new bootstrap.Modal(document.getElementById('viewBackupModal'));
    modal.show();
  }
}
// Download backup
function downloadBackup(backupId) {
  const backups = JSON.parse(sessionStorage.getItem('backups'));
  const backup = backups.find(b => b.id === backupId);

  if (backup) {
    const backupData = {
      name: backup.name,
      type: backup.type,
      date: backup.date,
      description: backup.description,
      contents: backup.contents
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${backup.name.toLowerCase().replace(/ /g, '_')}_${backup.date.split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    addEventLog('info', `Downloaded backup: ${backup.name}`, 'admin');
  }
}

// Load event logs
function loadEventLogs(filterLevel = 'all') {
  const eventLogs = JSON.parse(sessionStorage.getItem('eventLogs'));
  const logContainer = document.getElementById('systemEventLog');
  logContainer.innerHTML = '';

  const filteredLogs = filterLevel === 'all'
    ? eventLogs
    : eventLogs.filter(log => log.level === filterLevel);

  filteredLogs.forEach(log => {
    const logItem = document.createElement('div');
    logItem.className = 'event-log-item';

    const icon = getLogLevelIcon(log.level);
    const time = formatDateTime(log.timestamp);
    const user = log.user === 'system' ? 'System' : log.user;

    logItem.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>${icon} ${log.message} <span class="text-muted">(by ${user})</span></div>
        <div class="event-time">${time}</div>
      </div>
    `;
    logContainer.appendChild(logItem);
  });
}

// Filter event logs by level
function filterLogs(level) {
  loadEventLogs(level);
}

// Clear all event logs
function clearLogs() {
  if (confirm('Are you sure you want to clear all event logs? This action cannot be undone.')) {
    sessionStorage.setItem('eventLogs', JSON.stringify([]));
    loadEventLogs();
    addEventLog('warning', 'Cleared all event logs', 'admin');
  }
}

// Export event logs to file
function exportLogs() {
  const eventLogs = JSON.parse(sessionStorage.getItem('eventLogs'));

  let csv = 'Timestamp,Level,Message,User\n';
  eventLogs.forEach(log => {
    csv += `"${log.timestamp}","${log.level}","${log.message}","${log.user}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  addEventLog('info', 'Exported all event logs to CSV', 'admin');
}

// Add new event log
function addEventLog(level, message, user) {
  const eventLogs = JSON.parse(sessionStorage.getItem('eventLogs'));
  const newId = eventLogs.length > 0 ? Math.max(...eventLogs.map(e => e.id)) + 1 : 1;

  const newLog = {
    id: newId,
    timestamp: new Date().toISOString(),
    level,
    message,
    user
  };

  eventLogs.unshift(newLog);
  sessionStorage.setItem('eventLogs', JSON.stringify(eventLogs));

  if (window.location.hash === '#logs') {
    loadEventLogs(document.querySelector('.filter-log.active')?.getAttribute('data-level') || 'all');
  }

  const recentActivityLog = document.getElementById('recentActivityLog');
  if (recentActivityLog) {
    const logItem = document.createElement('div');
    logItem.className = 'event-log-item';

    const icon = getLogLevelIcon(level);
    const time = formatDateTime(newLog.timestamp);

    logItem.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>${icon} ${message} <span class="text-muted">(by ${user})</span></div>
        <div class="event-time">${time}</div>
      </div>
    `;

    recentActivityLog.insertBefore(logItem, recentActivityLog.firstChild);
    if (recentActivityLog.children.length > 5) {
      recentActivityLog.removeChild(recentActivityLog.lastChild);
    }
  }
}

function restoreBackupData(backupId) {
  const backups = JSON.parse(sessionStorage.getItem('backups'));
  const backup = backups.find(b => b.id === backupId);

  if (!backup || !backup.data) {
    alert("No data found in this backup.");
    return;
  }

  sessionStorage.setItem('users', JSON.stringify(backup.data.users));
  sessionStorage.setItem('submittedCertificates', JSON.stringify(backup.data.documents));
  sessionStorage.setItem('walkInApplications', JSON.stringify(backup.data.appointments));

  alert(" Backup restored successfully.");

  // Reload relevant sections
  if (typeof loadUsers === "function") loadUsers();
  if (typeof loadDashboardData === "function") loadDashboardData();

  addEventLog('info', `Restored data from backup: ${backup.name}`, 'System Admin');
}

   // Logout user
function logout() {
  sessionStorage.setItem('lastLogout', new Date().toISOString());
}

// Helper function to generate backup contents
function generateBackupContents(type) {
  const contents = [];

  if (type === 'full' || type === 'database') {
    contents.push('Database tables: users, content, settings, logs');
    contents.push('Records:');
    contents.push('  - Users: ' + JSON.parse(sessionStorage.getItem('users')).length);
    contents.push('  - Content fields: ' + JSON.parse(sessionStorage.getItem('contentFields')).length);
    contents.push('  - Backups: ' + JSON.parse(sessionStorage.getItem('backups')).length);
    contents.push('  - Event logs: ' + JSON.parse(sessionStorage.getItem('eventLogs')).length);
  }

  if (type === 'full' || type === 'files') {
    contents.push('File system structure:');
    contents.push('  - /app (application files)');
    contents.push('  - /config (configuration files)');
    contents.push('  - /public (static assets)');
    contents.push('  - /uploads (user uploaded files)');
  }

  if (type === 'full' || type === 'config') {
    contents.push('Configuration files:');
    contents.push('  - app.config.json');
    contents.push('  - database.config.json');
    contents.push('  - security.config.json');
    contents.push('  - system.config.json');
  }

  return contents.join('\n');
}

// Helper function to get role badge
function getRoleBadge(role) {
  const roleStyles = {
    admin: "role-badge role-admin",
    editor: "role-badge role-editor",
    viewer: "role-badge role-viewer",
    guest: "role-badge role-guest"
  };

  const defaultClass = "role-badge role-admin"; // fallback
  const roleClass = roleStyles[role?.toLowerCase()] || defaultClass;

  return `<span class="${roleClass}">${role}</span>`;
}

// Helper function to get status badge
function getStatusBadge(status) {
  const statuses = {
    active: { class: 'bg-success', text: 'Active' },
    inactive: { class: 'bg-secondary', text: 'Inactive' },
    suspended: { class: 'bg-danger', text: 'Suspended' }
  };

  return `<span class="badge ${statuses[status].class}">${statuses[status].text}</span>`;
}

// Helper function to get log level icon
function getLogLevelIcon(level) {
  const icons = {
    info: '<i class="bi bi-info-circle text-primary"></i>',
    warning: '<i class="bi bi-exclamation-triangle text-warning"></i>',
    error: '<i class="bi bi-x-circle text-danger"></i>',
    security: '<i class="bi bi-shield-lock text-success"></i>'
  };

  return icons[level] || '<i class="bi bi-info-circle"></i>';
}

// Helper function to format date/time
function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}



document.addEventListener('DOMContentLoaded', function () {
  const userRole = sessionStorage.getItem('adminRole');

  document.querySelectorAll('[data-role]').forEach(el => {
    const allowedRole = el.getAttribute('data-role');
    if (allowedRole !== userRole) {
      el.style.display = 'none';
    }
  });
  
});

