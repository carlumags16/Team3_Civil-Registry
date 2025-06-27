document.addEventListener('DOMContentLoaded', function() {
    // Set admin info
    const username = sessionStorage.getItem('adminUsername');
    const role = sessionStorage.getItem('adminRole');
    const nameDisplay = document.getElementById('adminUsername');
    const roleDisplay = document.getElementById('adminRole');
    const adminInfo = document.getElementById('adminInfo');
    
    if (username && nameDisplay) nameDisplay.textContent = username;
    if (role && roleDisplay) roleDisplay.textContent = role;
    if (adminInfo) adminInfo.textContent = username;

    // Filter menu items based on role
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const requiredRole = item.getAttribute('data-role');
        if (requiredRole && requiredRole !== role) {
            item.style.display = 'none';
        }
    });

    // Fetch and display certificates
    fetchCertificates();

    // Set up event listeners
    document.getElementById('searchInput')?.addEventListener('input', filterAndRenderTables);
    document.querySelector('.filter-box select')?.addEventListener('change', filterAndRenderTables);
    document.getElementById('exportBtn')?.addEventListener('click', exportToExcel);
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportToExcel);
});

async function fetchCertificates() {
    try {
        console.log('Fetching certificates...');
        const apiUrl = '../AdminPortal/getCertificate.php?action=get_certificates&_t=' + Date.now();
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            credentials: 'include', // Include cookies/session
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP error! Status:', response.status, 'Response:', errorText);
            throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 100)}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data && data.success) {
            // Store for type lookup
            window.lastCertificates = (data.readyForRelease || []).concat(data.recentlyReleased || []);
            console.log('Ready for release certificates:', data.readyForRelease);
            console.log('Recently released certificates:', data.recentlyReleased);
            if (data.readyForRelease) updateReadyForReleaseTable(data.readyForRelease);
            if (data.recentlyReleased) updateRecentlyReleasedTable(data.recentlyReleased);
            if (data.counts) updateDashboardCounts(data.counts);
            filterAndRenderTables();
        } else {
            const errorMsg = data && data.message ? data.message : 'No data returned from server';
            console.error('Error fetching certificates:', errorMsg);
            alert(`Failed to load certificate data: ${errorMsg}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert(`An error occurred while fetching data: ${error.message}`);
    }
}

function updateReadyForReleaseTable(certificates) {
    const tbody = document.querySelector('#printAreaReady table tbody');
    tbody.innerHTML = '';
    certificates.forEach(cert => {
        console.log('Certificate status:', cert.status);
        const status = cert.status ? cert.status.toUpperCase() : '';
        if (["SIGNED", "APPROVED", "PAID", "READY_FOR_RELEASE"].includes(status)) {
            const row = document.createElement('tr');
            let actionButton = '';
            if (status === 'SIGNED') {
                actionButton = `<button class=\"action-btn btn-ready btn-blue\" data-id=\"${cert.id}\" data-status=\"READY_FOR_RELEASE\">READY FOR RELEASE</button>`;
            } else if (status === 'READY_FOR_RELEASE') {
                actionButton = `<button class=\"action-btn btn-release btn-green\" data-id=\"${cert.id}\" data-status=\"RELEASED\">RELEASE</button>`;
            }
            row.innerHTML = `
                <td>${cert.reference_number || 'N/A'}</td>
                <td>${cert.document_type || 'N/A'}</td>
                <td>${cert.release_method || 'N/A'}</td>
                <td><span class="status status-ready">${cert.status || 'Ready'}</span></td>
                <td>${actionButton}</td>
            `;
            tbody.appendChild(row);
        }
    });
    // Use event delegation for better reliability
    tbody.onclick = function(e) {
        const btn = e.target.closest('.action-btn');
        if (btn && btn.dataset.id && btn.dataset.status) {
            handleStatusUpdate(btn.dataset.id, btn.dataset.status);
        }
    };
}

function updateRecentlyReleasedTable(certificates) {
    const tbody = document.querySelector('#printAreaReleased table tbody');
    tbody.innerHTML = '';
    certificates.forEach(cert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cert.reference_number || 'N/A'}</td>
            <td>${cert.document_type || 'N/A'}</td>
            <td>${cert.release_method || 'N/A'}</td>
            <td><span class="status status-released">${cert.status || 'Released'}</span></td>
            <td>${formatDate(cert.date_released) || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateDashboardCounts(counts) {
    const cards = document.querySelectorAll('.card-value');
    if (cards.length >= 3) {
        cards[0].textContent = counts.readyForRelease || '0';
        cards[1].textContent = counts.claimantPickups || '0';
        cards[2].textContent = counts.courierPickups || '0';
    }
}

function filterAndRenderTables() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterValue = document.querySelector('.filter-box select')?.value.toLowerCase() || 'all';
    const allCerts = window.lastCertificates || [];
    // Helper for filtering by release method
    function matchesReleaseMethod(cert) {
        if (filterValue === 'claimant') return (cert.release_method || '').toLowerCase() === 'pickup';
        if (filterValue === 'courier') return (cert.release_method || '').toLowerCase() === 'delivery';
        return true;
    }
    // Helper for filtering by status
    function matchesStatus(cert) {
        if (filterValue === 'ready') return cert.status && cert.status.toUpperCase() === 'READY_FOR_RELEASE';
        if (filterValue === 'released') return cert.status && cert.status.toUpperCase() === 'RELEASED';
        return true;
    }
    // Helper for search
    function matchesSearch(cert) {
        const ref = (cert.reference_number || '').toLowerCase();
        const name = (cert.claimant_name || cert.full_name || '').toLowerCase();
        return ref.includes(searchTerm) || name.includes(searchTerm);
    }
    // Ready for Release Table
    const ready = allCerts.filter(cert =>
        (["SIGNED", "APPROVED", "PAID", "READY_FOR_RELEASE"].includes((cert.status || '').toUpperCase())) &&
        matchesStatus(cert) &&
        matchesReleaseMethod(cert) &&
        matchesSearch(cert)
    );
    updateReadyForReleaseTable(ready);
    // Recently Released Table
    const released = allCerts.filter(cert =>
        (cert.status && cert.status.toUpperCase() === 'RELEASED') &&
        matchesStatus(cert) &&
        matchesReleaseMethod(cert) &&
        matchesSearch(cert)
    );
    updateRecentlyReleasedTable(released);
}

function viewCertificate(id) {
    // Implement view certificate functionality
    console.log('Viewing certificate:', id);
    // This would typically open a modal with certificate details
}

async function markReadyForRelease(certId) {
    const certType = getCertTypeById(certId) || 'birth';
    const cert = window.lastCertificates?.find(c => String(c.id) === String(certId));
    
    if (!cert) {
        alert('Certificate not found');
        return;
    }
    
    let newStatus;
    if (cert.status === 'APPROVED') {
        newStatus = 'PAID';
    } else if (cert.status === 'PAID') {
        newStatus = 'SIGNED';
    } else {
        alert('Invalid status transition');
        return;
    }
    
    try {
        const response = await fetch('../Roles/process_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                action: 'update_status',
                cert_id: certId,
                cert_type: certType,
                new_status: newStatus
            })
        });
        const data = await response.json();
        if (data.success) {
            fetchCertificates();
        } else {
            alert('Failed to update status: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error updating status.');
    }
}

async function releaseCertificate(certId) {
    if (!confirm('Are you sure you want to mark this document as released?')) return;
    const certType = getCertTypeById(certId) || 'birth';
    try {
        const response = await fetch('../Roles/process_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                action: 'update_status',
                cert_id: certId,
                cert_type: certType,
                new_status: 'RELEASED'
            })
        });
        const data = await response.json();
        if (data.success) {
            fetchCertificates();
        } else {
            alert('Failed to update status: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error updating status.');
    }
}

// Helper to get cert type by id from the loaded certificates (if available)
function getCertTypeById(certId) {
    if (window.lastCertificates) {
        const cert = window.lastCertificates.find(c => String(c.id) === String(certId));
        if (!cert) return 'birth';
        // Map document_type or certif_type to short type
        const typeMap = {
            'Birth Certificate': 'birth',
            'Death Certificate': 'death',
            'Marriage Certificate': 'marriage',
            'CENOMAR': 'cenomar',
            'CENOMAR Certificate': 'cenomar',
            'CENODEATH': 'cenodeath',
            'CENODEATH Certificate': 'cenodeath'
        };
        // Try to use cert_type, type, document_type, or certif_type
        return (
            cert.cert_type ||
            cert.type ||
            typeMap[cert.document_type] ||
            typeMap[cert.certif_type] ||
            'birth'
        );
    }
    return 'birth';
}

function exportToExcel() {
    const table = document.querySelector('.document-section:first-of-type table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ReadyForRelease');
    XLSX.writeFile(wb, 'ReadyForRelease.xlsx');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = '../index.php';
}

async function handleStatusUpdate(certId, newStatus) {
    let certType = getCertTypeById(certId) || 'birth';
    certType = certType.toLowerCase(); // Ensure short type for backend
    try {
        const response = await fetch('../Roles/process_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                action: 'update_status',
                cert_id: certId,
                cert_type: certType,
                new_status: newStatus
            })
        });
        const data = await response.json();
        if (data.success) {
            fetchCertificates();
        } else {
            alert('Failed to update status: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error updating status.');
    }
}
