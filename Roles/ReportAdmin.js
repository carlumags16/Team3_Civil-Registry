document.addEventListener('DOMContentLoaded', function () {
  const username = sessionStorage.getItem('adminUsername');
  const role = sessionStorage.getItem('adminRole');

  const nameDisplay = document.getElementById('adminUsername');
  if (username && nameDisplay) nameDisplay.textContent = username;

  const roleDisplay = document.getElementById('adminRole');
  if (role && roleDisplay) roleDisplay.textContent = role;
});

       // Initialize the dashboard when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Set admin info
            document.getElementById('userAvatar').textContent = 'AD';
            
            // Initialize charts
            initCharts();
            
            // Set up event listeners
            setupEventListeners();
            
            // Check user role and adjust UI accordingly
            checkUserRole();
        });

        // Initialize charts - Updated to include Document Correction
        function initCharts() {
            // Registrations by Type Chart
            const registrationsCtx = document.getElementById('registrationsChart').getContext('2d');
            const registrationsChart = new Chart(registrationsCtx, {
                type: 'bar',
                data: {
                    labels: ['Birth', 'Marriage', 'Death', 'CENOMAR', 'CENODEATH', 'Correction'],
                    datasets: [{
                        label: 'Received',
                        data: [45, 32, 28, 35, 20, 18],
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    }, {
                        label: 'In Process',
                        data: [32, 25, 18, 22, 15, 12],
                        backgroundColor: '#f39c12',
                        borderColor: '#e67e22',
                        borderWidth: 1
                    }, {
                        label: 'Released',
                        data: [13, 7, 10, 13, 5, 6],
                        backgroundColor: '#2ecc71',
                        borderColor: '#27ae60',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Certificates'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Certificate Type'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    }
                }
            });

            // Revenue by Certificate Chart
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            const revenueChart = new Chart(revenueCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Birth', 'Marriage', 'Death', 'CENOMAR', 'CENODEATH', 'Correction'],
                    datasets: [{
                        data: [24500, 19200, 16800, 31500, 18000, 21600],
                        backgroundColor: [
                            '#3498db',
                            '#e74c3c',
                            '#2c3e50',
                            '#9b59b6',
                            '#1abc9c',
                            '#e67e22'
                        ],
                        borderColor: [
                            '#2980b9',
                            '#c0392b',
                            '#1a252f',
                            '#8e44ad',
                            '#16a085',
                            '#d35400'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `₱${context.raw.toLocaleString()}`;
                                }
                            }
                        }
                    }
                }
            });

            // Store chart references for download
            window.registrationsChart = registrationsChart;
            window.revenueChart = revenueChart;
        }

        // View certificate details - Updated to include Document Correction
        function viewDetails(certificateType) {
            // In a real app, this would fetch data from the server
            const certificateData = {
                type: certificateType === 'birth' ? 'Birth Certificate' : 
                     certificateType === 'marriage' ? 'Marriage Certificate' :
                     certificateType === 'death' ? 'Death Certificate' :
                     certificateType === 'cenomar' ? 'CENOMAR' : 
                     certificateType === 'cenodeath' ? 'CENODEATH' : 'Document Correction | R.A. 9048',
                number: certificateType === 'birth' ? 'BC-2023-0456' : 
                       certificateType === 'marriage' ? 'MC-2023-0457' :
                       certificateType === 'death' ? 'DC-2023-0458' :
                       certificateType === 'cenomar' ? 'CN-2023-0459' : 
                       certificateType === 'cenodeath' ? 'CD-2023-0460' : 'CR-2023-0461',
                requester: certificateType === 'birth' ? 'Juan Dela Cruz' : 
                         certificateType === 'marriage' ? 'Maria Santos' :
                         certificateType === 'death' ? 'Pedro Reyes' :
                         certificateType === 'cenomar' ? 'Ana Martinez' : 
                         certificateType === 'cenodeath' ? 'Luis Gonzales' : 'Roberto Sanches',
                dateRequested: '2023-05-15',
                status: certificateType === 'birth' ? 'In Process' : 
                       certificateType === 'marriage' ? 'Received' :
                       certificateType === 'death' ? 'Released' :
                       certificateType === 'cenomar' ? 'In Process' : 
                       certificateType === 'cenodeath' ? 'Received' : 'In Process',
                fee: certificateType === 'birth' ? '₱500' : 
                    certificateType === 'marriage' ? '₱600' :
                    certificateType === 'death' ? '₱600' :
                    certificateType === 'cenomar' ? '₱900' : 
                    certificateType === 'cenodeath' ? '₱900' : '₱1,200'
            };
            
            // Populate modal content
            const modalContent = `
                <div class="form-group">
                    <label>Certificate Type</label>
                    <div>${certificateData.type}</div>
                </div>
                <div class="form-group">
                    <label>Certificate Number</label>
                    <div>${certificateData.number}</div>
                </div>
                <div class="form-group">
                    <label>Requested By</label>
                    <div>${certificateData.requester}</div>
                </div>
                <div class="form-group">
                    <label>Date Requested</label>
                    <div>${certificateData.dateRequested}</div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <div>
                        <span class="status-badge ${certificateData.status.toLowerCase().replace(' ', '-')}">
                            <i class="fas fa-${certificateData.status === 'Released' ? 'check-circle' : 
                                            certificateData.status === 'In Process' ? 'clock' : 'inbox'}"></i> 
                            ${certificateData.status}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Fee</label>
                    <div>${certificateData.fee}</div>
                </div>
                
                <div class="document-preview">
                    <div class="document-header">
                        <div class="document-title">${certificateData.type.toUpperCase()}</div>
                        <div>Republic of the Philippines</div>
                    </div>
                    
                    <div class="document-content">
                        ${certificateType === 'birth' ? `
                        <p>This is to certify that <strong>Maria Cristina Dela Cruz</strong>, female, was born on <strong>January 15, 1990</strong> at <strong>Manila City Hospital</strong> to parents <strong>Juan Dela Cruz</strong> and <strong>Maria Santos Dela Cruz</strong>.</p>
                        <p>The birth was registered at the Local Civil Registry Office of Manila on <strong>January 20, 1990</strong> under Registration Number <strong>1990-012345</strong>.</p>
                        ` : certificateType === 'marriage' ? `
                        <p>This is to certify that <strong>Juan Dela Cruz</strong> and <strong>Maria Santos</strong> were united in marriage on <strong>June 12, 2015</strong> at <strong>San Sebastian Church, Manila</strong>.</p>
                        <p>The marriage was registered at the Local Civil Registry Office of Manila on <strong>June 15, 2015</strong> under Registration Number <strong>2015-067890</strong>.</p>
                        ` : certificateType === 'death' ? `
                        <p>This is to certify that <strong>Pedro Reyes</strong>, male, died on <strong>March 5, 2023</strong> at <strong>Manila Doctors Hospital</strong>.</p>
                        <p>The death was registered at the Local Civil Registry Office of Manila on <strong>March 8, 2023</strong> under Registration Number <strong>2023-034567</strong>.</p>
                        ` : certificateType === 'cenomar' ? `
                        <p>This is to certify that according to the records of this office, <strong>Ana Martinez</strong>, female, born on <strong>July 20, 1992</strong>, has not contracted any marriage.</p>
                        <p>This certificate is issued upon request for whatever legal purpose it may serve.</p>
                        ` : certificateType === 'cenodeath' ? `
                        <p>This is to certify that according to the records of this office, <strong>Luis Gonzales</strong>, male, born on <strong>September 15, 1985</strong>, has not been reported dead.</p>
                        <p>This certificate is issued upon request for whatever legal purpose it may serve.</p>
                        ` : `
                        <p>This is to certify that under Republic Act No. 9048, the following clerical or typographical error in the civil register has been corrected:</p>
                        <p><strong>Original Entry:</strong> Maria Cristina Dela Cruz, female, born on January 15, 1990</p>
                        <p><strong>Corrected Entry:</strong> Maria Christina Dela Cruz, female, born on January 15, 1990</p>
                        <p>The correction was approved by the Civil Registrar on <strong>May 10, 2023</strong> under Correction Number <strong>2023-056789</strong>.</p>
                        `}
                        <p>This certificate is issued upon request for whatever legal purpose it may serve.</p>
                    </div>
                    
                    <div class="signature-area">
                        <div class="signature-line">
                            <div class="signature-label">Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('certificateDetails').innerHTML = modalContent;
            document.getElementById('signCertificateBtn').setAttribute('data-certificate-id', certificateData.number);
            document.getElementById('printCertificateBtn').setAttribute('data-certificate-id', certificateData.number);
            
            // Only show sign button if status is "In Process"
            document.getElementById('signCertificateBtn').style.display = 
                certificateData.status === 'In Process' ? 'block' : 'none';
                
            openModal('certificateModal');
        }

        // Sign certificate
        function signCertificate(certificateId) {
            // In a real app, this would send a request to the server
            console.log('Signing certificate:', certificateId);
            
            // Simulate signing
            setTimeout(() => {
                // Update status in the modal
                document.querySelector('#certificateDetails .status-badge').className = 'status-badge released';
                document.querySelector('#certificateDetails .status-badge i').className = 'fas fa-check-circle';
                document.querySelector('#certificateDetails .status-badge').innerHTML = '<i class="fas fa-check-circle"></i> Released';
                
                // Hide the sign button
                document.getElementById('signCertificateBtn').style.display = 'none';
                
                // Show success message
                showToast('Certificate signed successfully', 'success');
                
                // Update the main table (in a real app, this would refresh the data)
                updateCertificateStatus(certificateId, 'Released');
            }, 1000);
        }

        // Update certificate status in the main table
        function updateCertificateStatus(certificateId, newStatus) {
            // In a real app, this would update the server and refresh the table
            const rows = document.querySelectorAll('#revenueTable tbody tr');
            for (let row of rows) {
                if (row.cells[0].textContent.includes(certificateId.substring(0, 2))) {
                    const statusCell = row.cells[3];
                    statusCell.textContent = newStatus === 'Released' ? 
                        parseInt(statusCell.textContent) + 1 : statusCell.textContent;
                    break;
                }
            }
        }

        // Print receipt
        function printReceipt(transactionId) {
            // In a real app, this would generate a proper receipt
            console.log('Printing receipt for transaction:', transactionId);
            showToast('Receipt printed successfully', 'success');
        }

        // Print certificate
        function printCertificate(certificateId) {
            // In a real app, this would generate a proper certificate
            console.log('Printing certificate:', certificateId);
            showToast('Certificate printed successfully', 'success');
        }

        // Show all transactions
        function showAllTransactions() {
            // In a real app, this would navigate to a transactions page
            console.log('Showing all transactions');
            showToast('Redirecting to transactions page', 'info');
        }

        // Open modal
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Close modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Show toast notification
        function showToast(message, type) {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                   type === 'error' ? 'times-circle' : 
                                   type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <div class="toast-message">
                    <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <div>${message}</div>
                </div>
                <button class="toast-close">&times;</button>
            `;
            
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.remove();
            });
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 5000);
        }

        // Export to Excel
        function exportToExcel() {
            const table = document.getElementById('revenueTable');
            const workbook = XLSX.utils.table_to_book(table);
            XLSX.writeFile(workbook, 'Revenue_Report.xlsx');
            showToast('Report exported to Excel', 'success');
        }

        // Generate PDF
        function generatePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(18);
            doc.text('Civil Registry Revenue Report', 105, 15, { align: 'center' });
            
            // Add date
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });
            
            // Add table
            doc.autoTable({
                html: '#revenueTable',
                startY: 30,
                theme: 'grid',
                headStyles: {
                    fillColor: [0, 85, 165],
                    textColor: 255
                }
            });
            
            // Save the PDF
            doc.save('Revenue_Report.pdf');
            showToast('PDF report generated', 'success');
        }

        // Download chart as image
        function downloadChart(chartId, fileName) {
            const canvas = document.getElementById(chartId);
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('Chart downloaded', 'success');
        }

        // Logout function
        function logout() {
            // In a real app, this would clear the session
            console.log('Logging out...');
            showToast('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }