// Functions for searching and filtering cards and table rows
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();

            function highlightText(element, query) {
                if (!query) {
                    element.innerHTML = element.textContent;
                    return;
                }

                const text = element.textContent;
                const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');

                element.innerHTML = text.replace(regex, '<mark>$1</mark>');
            }

            // Search & highlight cards
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const cardText = card.innerText.toLowerCase();
                if (cardText.includes(query)) {
                    card.style.display = 'flex';
                    const title = card.querySelector('h2');
                    if (title) highlightText(title, query);
                } else {
                    card.style.display = 'none';
                    const title = card.querySelector('h2');
                    if (title) highlightText(title, '');
                }
            });

            // Search & highlight rows in table
            const rows = document.querySelectorAll('#registrationTableBody tr');
            rows.forEach(row => {
                const rowText = row.innerText.toLowerCase();
                if (rowText.includes(query)) {
                    row.style.display = '';
                    const nameCell = row.querySelectorAll('td')[1];
                    if (nameCell) highlightText(nameCell, query);
                    row.querySelectorAll('td').forEach((td, i) => {
                        if (i !== 1) td.innerHTML = td.textContent;
                    });
                } else {
                    row.style.display = 'none';
                    row.querySelectorAll('td').forEach(td => {
                        td.innerHTML = td.textContent;
                    });
                }
            });
        });
    }

    // ✅ NEWLY ADDED: Check if submission is successful and add a row
    const params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === 'true') {
        const id = params.get('id');
        const name = decodeURIComponent(params.get('name'));
        const type = decodeURIComponent(params.get('type'));
        const status = params.get('status') || 'Pending';

        const tableBody = document.querySelector('#registrationTableBody');
        if (tableBody) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${type}</td>
        <td>${status}</td>
      `;
            tableBody.appendChild(newRow);
        }

        Swal.fire({
            icon: 'success',
            title: 'Thank you for your cooperation!',
            text: 'Kindly check your email to verify the payment and updates of your registration.',
            confirmButtonColor: '#3b82f6'
        });

        // Remove query params so popup doesn't reappear on refresh
        history.replaceState(null, '', window.location.pathname);
    }
});


// Function to open the home, about, and contact popups

function openHomePopup() {
    Swal.fire({
        icon: 'info',
        title: 'Home',
        text: 'This is the Home section.'
    });
}

function openAboutPopup() {
window.location.href = '../AboutUs/AboutUs.html';
}

function openLoginPopup() {
window.location.href = '../Loginweb/LoginPage.html';
}

function openContactPopup() {
    Swal.fire({ icon: 'info', title: 'Contact Us', text: 'This is the Contact Us section.' });
}

function openOtherCertificateAlert() {
    Swal.fire({
        icon: 'info',
        title: 'Other Certificate',
        text: 'Contact us Via email cris.support@gmail.com.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
    })
}

// Function for sweet alert for every card click

function openForm(type) {
    Swal.fire({
        title: 'Terms & Conditions',
        html: `<div style="text-align: left;">
      <p style="margin-bottom: 1rem;">By proceeding, you agree to:</p>
        <ul style="margin-left: 1.2rem; padding-left: 1rem; list-style-type: disc;">
          <li style="margin-bottom: 0.5rem;">Ensure all information provided is accurate and truthful</li>
          <li style="margin-bottom: 0.5rem;">Only upload valid and authentic supporting documents</li>
          <li style="margin-bottom: 0.5rem;">Settle any applicable fees in a timely manner</li>
          <li><strong>Please allow 5-7 business days for processing</strong></li>
          <li>If a field does not apply to you, enter <strong>N/A.</strong></li>
        </ul>
      <div style="margin-top: 1.5rem;">
        <input type="checkbox" id="termsCheckbox" style="margin-right: 0.5rem;" />
        <label for="termsCheckbox">I have read and agree to the Terms & Conditions</label>
      </div>
    </div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Agree & Continue',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3b82f6',
        width: '600px',
        preConfirm: () => {
            const checkbox = document.getElementById('termsCheckbox');
            if (!checkbox || !checkbox.checked) {
                Swal.showValidationMessage('You must agree to the terms before continuing.');
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showPopupForm(type);
        } else {
            closeForm();
        }
    });
}

// Function to show the popup form for certificate registration
function showPopupForm(type) {
    const popup = document.getElementById('popupForm');
    if (!popup) return;

    popup.style.display = 'flex';

    // Set title
    const formTitle = document.getElementById('formTitle');
    if (formTitle) formTitle.innerText = `Register for ${type}`;

    // ✅ Set certificate type in hidden input
    const certTypeInput = document.getElementById('certificateType');
    if (certTypeInput) certTypeInput.value = type;

    // Show correct section and hide others
    document.querySelectorAll('.type-fields').forEach(div => div.style.display = 'none');

    const fieldMap = {
        'Birth Certificate': 'birthFields',
        'Marriage Certificate': 'marriageFields',
        'Death Certificate': 'deathFields',
        'Cenomar Certificate': 'cenomarFields',
        'Cenodeath Certificate': 'cenodeathFields',
    };

    const showId = fieldMap[type];
    const section = document.getElementById(showId);
    if (section) section.style.display = 'block';

    currentStep = 0;
    resetFormAndStepper();
}

function resetFormAndStepper() {
    if (form) form.reset();
    document.getElementById('reviewSummary').innerHTML = '';
    showStep(0);  
}

function closeForm() {
    const popup = document.getElementById('popupForm');
    if (popup) {
        popup.style.display = 'none';
        popup.style.visibility = 'hidden';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    if (form) form.reset();
    resetFormAndStepper();
}


document.addEventListener('DOMContentLoaded', () => {
  const closeFormBtn = document.getElementById('closeFormBtn');

  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', (e) => {
      e.preventDefault();

      Swal.fire({
        title: 'Do you really want to exit?',
        text: 'Your changes will not be saved.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Discard',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3b82f6'
      }).then((result) => {
        if (result.isConfirmed) {
          closeForm();
        }
      });
    });
  }
});



// Form and UI elements
const form = document.getElementById('certificateForm');
const steps = document.querySelectorAll('.form-step');
const nextBtn = document.getElementById('nextBtn');
const verificationPrevBtn = document.getElementById('verificationPrevBtn');
const prevBtn = document.getElementById('prevBtn');
const downloadBtn = document.getElementById('downloadBtn');
let currentStep = 0;

// Map certificate type to its fields container id
const sectionMap = {
    'Birth Certificate': 'birthFields',
    'Marriage Certificate': 'marriageFields',
    'Death Certificate': 'deathFields',
    'Cenomar Certificate': 'cenomarFields',
    'Cenodeath Certificate': 'cenodeathFields'
};

document.addEventListener('DOMContentLoaded', () => {
  const dateInputs = document.querySelectorAll('input[type="date"]');

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const maxDate = `${year}-${month}-${day}`;

  dateInputs.forEach(input => {
    input.removeAttribute('min');        
    input.max = maxDate;
    input.addEventListener('keydown', e => e.preventDefault());
    input.addEventListener('change', (e) => {
      const selectedDate = new Date(e.target.value);
      const todayCheck = new Date();
      todayCheck.setHours(0, 0, 0, 0);

      if (selectedDate > todayCheck) {
        Swal.fire({
          toast: true,
          background: '#f8d7da',
          icon: 'error',
          title: 'Future dates are not allowed',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        e.target.value = '';
      }
    });
  });
});


//Function to reset the form and stepper
function showStep(step) {
    const steps = document.querySelectorAll('.form-step'); // move this inside to refresh each time
  steps.forEach((el, idx) => {
    if (el) {
      el.style.display = idx === step ? 'block' : 'none';
    }
  });

  const progressSteps = document.querySelectorAll('.progressbar li');
  progressSteps.forEach((li, index) => {
    li.classList.remove('active', 'current');
    if (index < step) {
      li.classList.add('active');
    } else if (index === step) {
      li.classList.add('current');
    }
  });

  // Button visibility
  if (nextBtn) nextBtn.style.display = (step === 0 || step === 1) ? 'inline-block' : 'none';
  if (prevBtn) prevBtn.style.display = step > 0 ? 'inline-block' : 'none';
  if (verificationPrevBtn) verificationPrevBtn.style.display = step === 2 ? 'inline-block' : 'none';

  const submitBtn = form.querySelector('button[type="submitBtn"]');
  if (submitBtn) submitBtn.style.display = step === 4 ? 'inline-block' : 'none';
  if (downloadBtn) downloadBtn.style.display = step === 2 ? 'inline-block' : 'none';
}

// Validate all visible inputs in the active certificate type section
function validateStep1() {
  const certType = document.getElementById('certificateType').value;
  const sectionId = sectionMap[certType];
  const section = document.getElementById(sectionId);
  if (!section) return false;

const inputs = section.querySelectorAll('input, select, textarea');


for (const input of inputs) {
  const skipFields = ['Middle Name', 'Suffix', "Mother's Middle Name", "Father's Middle Name", 'Jr. Sr. III, IV'];
  const identifier = input.placeholder;

  if (skipFields.includes(identifier)) {
    continue; 
  }

  if (!input.value.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: `Please fill out the required field: ${input.placeholder || input.name || input.id}`,
      confirmButtonColor: '#3b82f6'
    });
    input.focus();
    return false;
  }
}

  return true;
}

// --- Modern File Upload UI Logic for Step 2 ---
document.addEventListener('DOMContentLoaded', function () {
    const selectFileBtn = document.getElementById('selectFileBtn');
    const idImageInput = document.getElementById('idImage');
    const filePreview = document.getElementById('filePreview');

    if (selectFileBtn && idImageInput && filePreview) {
        selectFileBtn.addEventListener('click', function () {
            idImageInput.click();
        });

        idImageInput.addEventListener('change', function () {
            filePreview.innerHTML = '';
            if (idImageInput.files && idImageInput.files.length > 0) {
                const file = idImageInput.files[0];
                const fileType = file.type;
                const fileName = file.name;
                const fileSize = (file.size / 1024).toFixed(1) + ' KB';

                let previewContent = '';
                if (fileType.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        previewContent = `<img src="${e.target.result}" alt="Preview" style="max-width: 180px; max-height: 180px; display: block; margin-bottom: 8px; border-radius: 8px; border: 1px solid #ccc;" />`;
                        previewContent += `<div><strong>${fileName}</strong> (${fileSize})</div>`;
                        previewContent += `<button type="button" id="removeFileBtn">Remove</button>`;
                        filePreview.innerHTML = previewContent;
                        document.getElementById('removeFileBtn').onclick = function () {
                            idImageInput.value = '';
                            filePreview.innerHTML = '';
                        };
                    };
                    reader.readAsDataURL(file);
                } else if (fileType === 'application/pdf') {
                    previewContent = `<i class="fas fa-file-pdf fa-3x" style="color:#d32f2f;"></i><br>`;
                    previewContent += `<div><strong>${fileName}</strong> (${fileSize})</div>`;
                    previewContent += `<button type="button" id="removeFileBtn">Remove</button>`;
                    filePreview.innerHTML = previewContent;
                    document.getElementById('removeFileBtn').onclick = function () {
                        idImageInput.value = '';
                        filePreview.innerHTML = '';
                    };
                } else {
                    previewContent = `<span style="color: #d32f2f;">Unsupported file type.</span>`;
                    filePreview.innerHTML = previewContent;
                    idImageInput.value = '';
                }
            }
        });
    }
});

// Update validateStep2 to check the new UI
function validateStep2() {
  const idImageInput = document.getElementById('idImage');
  if (!idImageInput || !idImageInput.files || idImageInput.files.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please upload your ID or document for verification.',
      confirmButtonColor: '#3b82f6'
    });
    return false;
  }
  // Optionally, add file type/size validation here
  return true;
}

//Generate the summary of inputs for the selected certificate type and download as PDF basta ayon jusko po
function generateSummary() {
    const certType = document.getElementById('certificateType').value;
    const sectionId = sectionMap[certType];
    const section = document.getElementById(sectionId);
    if (!section) return;

    const inputs = section.querySelectorAll('input, textarea, select');
    let summaryHTML = `<h3>${certType} - Review Your Inputs</h3>`;

    inputs.forEach(input => {
        const label = input.getAttribute('placeholder') || input.name || input.id || 'Field';
        const value = input.value.trim() || '<em>Not provided</em>';
        summaryHTML += `
      <div class="review-item">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
      </div>`;
    });

    document.getElementById('reviewSummary').innerHTML = summaryHTML;
}

// Event listeners for buttons
prevBtn.addEventListener('click', () => {
  currentStep--;
    showStep(currentStep);
});

verificationPrevBtn.addEventListener('click', () => {
  currentStep = 1; // Go back to the Information step
    showStep(currentStep);
});

nextBtn.addEventListener('click', () => {
  if (currentStep === 0) {
    if (validateStep1()) {
      currentStep = 1;
      showStep(currentStep);
    }
  } else if (currentStep === 1) {
    if (validateStep2()) {
      currentStep = 2;
      generateSummary(); // ← add this
      showStep(currentStep);
    }
  } else if (currentStep === 2) {
    currentStep = 3;  // move to final step
    showStep(currentStep);
  }
});
const nextStep2Btn = document.getElementById('nextStep2Btn');

if (nextStep2Btn) {
  nextStep2Btn.addEventListener('click', () => {
    if (currentStep === 1) {
      if (validateStep2()) {
        currentStep = 2;
        generateSummary();
        showStep(currentStep);
      }
    }
  });
}

downloadBtn.type = 'button';

downloadBtn.addEventListener('click', () => {
  const certType = document.getElementById('certificateType').value;
  const sectionId = sectionMap[certType];
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Update the PDF template with the certificate type
  document.getElementById('pdfCertType').textContent = certType;
  const pdfDetails = document.getElementById('pdfDetails');
  pdfDetails.innerHTML = '';

  // Add all form fields to the PDF template
  section.querySelectorAll('input, textarea, select').forEach(input => {
    const label = input.getAttribute('placeholder') || input.name || input.id || 'Field';
    const value = input.value.trim().toUpperCase() || '<em>Not provided</em>';
    pdfDetails.innerHTML += `
      <p style="margin: 4px 0;">
        <strong>${label}:</strong> ${value}
      </p>`;
  });

  // Show the template right before capturing
  const template = document.getElementById('pdfTemplate');
  template.style.display = 'block'; 

  // Convert the template to PDF
  html2canvas(template).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('certificate-summary.pdf');
    
    // Hide the template again after generating PDF
    template.style.display = 'none';
  });
});

let registrationCount = 0;

// Handle form submission
if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();  // Prevent default form submission

        console.log("Form submission intercepted.");

        registrationCount++;

        const certType = document.getElementById('certificateType').value;
        const sectionId = sectionMap[certType];
        const section = document.getElementById(sectionId);
        if (!section) return;

        const firstName = section.querySelector('input[placeholder="First Name"]')?.value.trim() || '';
        const lastName = section.querySelector('input[placeholder="Last Name"]')?.value.trim() || '';
        const middleInitial = section.querySelector('input[placeholder="Middle Initial"]')?.value.trim() || '';
        const suffix = section.querySelector('input#suffix')?.value.trim() || '';

        const fullName = [firstName, middleInitial && middleInitial + '.', lastName, suffix].filter(Boolean).join(' ').trim();

        const formData = new FormData(form);
        // Add the transaction_number (REF...) from the payment summary
        const transactionNumber = document.getElementById('referenceId')?.textContent || '';
        formData.append('transaction_number', transactionNumber);
        // Add the calculated amount (final amount)
        const amount = document.getElementById('finalAmount')?.textContent || '';
        formData.append('amount', amount);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData
            });

            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Response text:', text);

            // Accept any 2xx status as success
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Submitted Successfully!',
                    text: 'Your payment and registration have been recorded.',
                    confirmButtonColor: '#3b82f6'
                }).then(() => {
                    closeForm();
                });
            } else {
                throw new Error('Submission failed with status ' + response.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while submitting the form. Please try again.',
                confirmButtonColor: '#ef4444'
            });
        }
    });
}

// Initialize the form
showStep(currentStep);

// PDF generation code
function generatePDF(certType) {
    const sectionId = sectionMap[certType];
    const section = document.getElementById(sectionId);

    if (!section) return null;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    return doc;
    doc.setFontSize(14);
    doc.text('Certificate Registration Summary', 10, 10);

    let y = 20;
    section.querySelectorAll('input, textarea').forEach(input => {
        const label = input.getAttribute('placeholder') || input.name;
        const value = input.value.trim();
        doc.text(`${label}: ${value}`, 10, y);
        y += 10;
    });

    doc.save('registration-summary.pdf');
}

function logout() {
    Swal.fire({
        title: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Call server to destroy session
            fetch('../Loginweb/logout.php', {
                method: 'POST',
                credentials: 'same-origin'
            })
            .then(response => {
                if (!response.ok) throw new Error('Logout failed');
                return response.json();
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You have been successfully logged out.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b82f6'
                }).then(() => {
                    window.location.href = '../Loginweb/LoginPage.html';
                });
            })
            .catch(error => {
                console.error('Logout error:', error);
                // Still redirect even if there's an error
                window.location.href = '../Loginweb/LoginPage.html';
            });
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userIcon && userDropdown) {
        // Toggle dropdown when clicking user icon
        userIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.style.display = 'none';
        });

        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });

       
    }
});

document.addEventListener('DOMContentLoaded', () => {
  // --- Payment Logic ---
  function updateTotalPrice() {
    const qty = parseInt(document.getElementById('quantity')?.value) || 1;
    const base = 350;
    const fee = 10;
    const total = qty * base;
    const final = total + fee;

    document.getElementById('totalAmount').textContent = total;
    document.getElementById('convenienceFee').textContent = fee;
    document.getElementById('finalAmount').textContent = final;
    document.getElementById('receiptAmount').textContent = final;
    document.getElementById('basePrice').textContent = base;
  }

  function generateReferenceId() {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REF${timestamp}`;
  }

  function generateReceiptDetails() {
    const now = new Date().toLocaleString();
    document.getElementById('receiptDate').textContent = now;
    document.getElementById('receiptReferenceId').textContent = document.getElementById('referenceId').textContent;
    document.getElementById('receiptPaymentMethod').textContent = selectedPayment;
  }

  // --- Payment Method Selection & OTP ---
  let selectedPayment = null;
  let otpTimers = {};

  window.selectPayment = function(method) {
    selectedPayment = method;
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('[id$="Details"]').forEach(el => el.classList.add('hidden'));
    document.querySelector(`#${method}Details`)?.classList.remove('hidden');
    document.querySelector(`[onclick="selectPayment('${method}')"]`)?.classList.add('selected');
  }

  window.sendOTP = function(method) {
    Swal.fire({ icon: 'success', title: 'OTP Sent!', text: 'OTP has been sent to your number.' });
    const section = document.getElementById(`${method}OtpSection`);
    if (section) section.classList.remove('hidden');
    startResendCountdown(method);
  }

  window.resendOTP = function(method) {
    sendOTP(method);
  }

  function startResendCountdown(method) {
    let timer = 300;
    const resendLink = document.getElementById(`resend-${method}`);

    if (otpTimers[method]) clearInterval(otpTimers[method]);

    resendLink.textContent = `Resend (${timer}s)`;
    resendLink.style.pointerEvents = 'none';

    otpTimers[method] = setInterval(() => {
      timer--;
      resendLink.textContent = `Resend (${timer}s)`;
      if (timer <= 0) {
        clearInterval(otpTimers[method]);
        resendLink.textContent = 'Resend';
        resendLink.style.pointerEvents = 'auto';
      }
    }, 1000);
  }

  function getEnteredOTP() {
    return [...document.querySelectorAll('.otp-box')].map(input => input.value).join('');
  }

  window.verifyAndProceed = function() {
    if (!selectedPayment) {
      Swal.fire({ icon: 'error', title: 'Select a payment method first!' });
      return;
    }
    if ((selectedPayment === 'ewallet' || selectedPayment === 'bank') && getEnteredOTP() !== '123456') {
      Swal.fire({ icon: 'error', title: 'Invalid OTP', text: 'Please enter correct OTP (123456)' });
      return;
    }
    generateReceiptDetails();
    currentStep = 4;
    showStep(currentStep);
  }

  // --- OTP Input Behavior ---
  document.addEventListener('input', e => {
    if (e.target.classList.contains('otp-box') && e.target.value.length === 1) {
      const next = e.target.nextElementSibling;
      if (next && next.classList.contains('otp-box')) next.focus();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.target.classList.contains('otp-box') && e.key === 'Backspace' && e.target.value === '') {
      const prev = e.target.previousElementSibling;
      if (prev && prev.classList.contains('otp-box')) prev.focus();
    }
  });

  // Step 3 → Step 4 transition
  const goToPaymentBtn = document.getElementById('goToPaymentBtn');
  if (goToPaymentBtn) {
    goToPaymentBtn.addEventListener('click', () => {
      const certType = document.getElementById('certificateType').value;
      document.getElementById('paymentCertificateType').textContent = certType;

      currentStep = 3;
      showStep(currentStep);
    });
  }
// Step 5: Final Submit
  document.getElementById('submitBtn').addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Registration Submitted Successfully!',
      text: 'Your payment and registration have been recorded.',
      confirmButtonColor: '#3b82f6'
    }).then(() => {
      form.dispatchEvent(new Event('submit'));
    });
  });

  // Step 5: Download Receipt PDF
  document.getElementById('downloadReceiptBtn').addEventListener('click', () => {
    const content = document.getElementById('receiptContent');

    if (!content) {
      console.error('Receipt content not found.');
      return;
    }

    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('payment-receipt.pdf');
    }).catch(error => {
      console.error('Error generating receipt PDF:', error);
    });
  });

  // Initialize default values
  document.getElementById('referenceId').textContent = generateReferenceId();
  updateTotalPrice();
  document.getElementById('quantity').addEventListener('input', updateTotalPrice);


});

document.addEventListener('DOMContentLoaded', function () {

  // --- Open and Reset Form ---
  function openWalkInForm() {
    document.getElementById('walkInPopup').style.display = 'flex';
    resetWalkInForm();
  }

  function closeWalkInForm() {
    document.getElementById('walkInPopup').style.display = 'none';
  }

  function resetWalkInForm() {
    document.querySelectorAll('.walk-in-step').forEach(step => step.style.display = 'none');
    document.querySelector('.walk-in-step[data-step="1"]').style.display = 'block';

    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.step[data-step="1"]').classList.add('active');

    document.getElementById('walkInApplicationForm').reset();
  }

  // --- Navigation ---
  window.nextWalkInStep = function (currentStep) {
    if (!validateWalkInStep(currentStep)) return;
    document.querySelector(`.walk-in-step[data-step="${currentStep}"]`).style.display = 'none';
    const nextStep = currentStep + 1;
    document.querySelector(`.walk-in-step[data-step="${nextStep}"]`).style.display = 'block';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${nextStep}"]`).classList.add('active');
    if (nextStep === 4) populateWalkInReview();
  }

  window.prevWalkInStep = function (currentStep) {
    document.querySelector(`.walk-in-step[data-step="${currentStep}"]`).style.display = 'none';
    const prevStep = currentStep - 1;
    document.querySelector(`.walk-in-step[data-step="${prevStep}"]`).style.display = 'block';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${prevStep}"]`).classList.add('active');
  }

  // --- Validation ---
  function validateWalkInStep(step) {
    if (step === 1) {
      const firstName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="First Name"]').value;
      const lastName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="Last Name"]').value;
      const dob = document.querySelector('.walk-in-step[data-step="1"] input[type="date"]').value;
      if (!firstName || !lastName || !dob) {
        Swal.fire('Validation Error', 'Please fill in all required fields', 'error');
        return false;
      }
    }
    if (step === 2) {
      const certType = document.getElementById('walkInCertType').value;
      if (!certType) {
        Swal.fire('Validation Error', 'Please select a certificate type', 'error');
        return false;
      }
    }
    if (step === 3) {
      const date = document.getElementById('appointmentDate').value;
      const time = document.getElementById('appointmentTime').value;
      if (!date || !time) {
        Swal.fire('Validation Error', 'Please choose a valid date and time for your appointment.', 'error');
        return false;
      }
    }
    return true;
  }

  // --- Review Population ---
  function populateWalkInReview() {
    const generatedID = generateRandomId();
    document.getElementById('walkInGeneratedID').textContent = generatedID;
    document.getElementById('walkInGeneratedID').setAttribute('data-id', generatedID);

    const firstName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="First Name"]').value;
    const lastName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="Last Name"]').value;
    const middleName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="Middle Name"]').value;
    const dob = document.querySelector('.walk-in-step[data-step="1"] input[type="date"]').value;
    const gender = document.querySelector('.walk-in-step[data-step="1"] select').value;
    const contact = document.querySelector('.walk-in-step[data-step="1"] input[type="tel"]').value;

    document.getElementById('walkInPersonalReview').innerHTML = `
      <p><strong>Name:</strong> ${firstName} ${middleName ? middleName + ' ' : ''}${lastName}</p>
      <p><strong>Date of Birth:</strong> ${new Date(dob).toLocaleDateString()}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Contact:</strong> ${contact}</p>
    `;

    const certType = document.getElementById('walkInCertType').value;
    const purpose = document.querySelector('.walk-in-step[data-step="2"] select').value;
    const copies = document.querySelector('.walk-in-step[data-step="2"] input[type="number"]').value;

    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const dateTime = date && time ? `<p><strong>Scheduled Visit:</strong> ${new Date(date).toLocaleDateString()} at ${time}</p>` : '';

    document.getElementById('walkInCertReview').innerHTML = `
      <p><strong>Certificate Type:</strong> ${certType}</p>
      <p><strong>Purpose:</strong> ${purpose}</p>
      <p><strong>Number of Copies:</strong> ${copies}</p>
      ${dateTime}
    `;
  }

  // --- Submit Handler ---
  document.getElementById('WalkinSubmit').addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Registration Submitted Successfully!',
      text: 'Your payment and registration have been recorded.',
      confirmButtonColor: '#3b82f6'
    }).then(() => {
      closeWalkInForm();
      const firstName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="First Name"]').value;
      const lastName = document.querySelector('.walk-in-step[data-step="1"] input[placeholder="Last Name"]').value;
      const certType = document.getElementById('walkInCertType').value;
      const walkInId = document.getElementById('walkInGeneratedID').getAttribute('data-id');

      addToRegistrationTable({
        id: walkInId,
        name: `${firstName} ${lastName}`,
        type: certType,
        status: 'Pending'
      });
    });
  });

  // --- Utility ---
  function generateRandomId() {
    return 'WI-' + Math.floor(100000 + Math.random() * 900000);
  }

  function addToRegistrationTable(data) {
    const tableBody = document.getElementById('registrationTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${data.type}</td>
      <td><span class="status-badge ${data.status.toLowerCase()}">${data.status}</span></td>
    `;
    tableBody.appendChild(row);
  }

  // --- Flatpickr & Time Options ---
  if (document.getElementById('appointmentDate')) {
    flatpickr('#appointmentDate', {
      dateFormat: "Y-m-d",
      minDate: new Date().fp_incr(1),
      disable: [
        function (date) {
          return date.getDay() === 0 || date.getDay() === 6;
        }
      ]
    });

    const timeSelect = document.getElementById('appointmentTime');
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const option = new Option(timeString, timeString);
        timeSelect.add(option);
      }
    }
  }

  // --- Certificate Type Switch ---
  document.getElementById('walkInCertType').addEventListener('change', function () {
    const certType = this.value;
    const fieldsContainer = document.getElementById('walkInCertFields');
    let fieldsHTML = '';

    switch (certType) {
      case 'birth':
        fieldsHTML = `<div class="form-group">
        <label>Child's Name</label>
        <div class="name-group">
        <input type="text" placeholder="First Name" required>
        <input type="text" placeholder="Last Name" required>
        <input type="text" placeholder="Middle Name">
        </div>
        </div>
        <div class="form-row"><div class="form-group"><label>Date of Birth</label>
        <input type="date" required></div>
        <div class="form-group"><label>Place of Birth</label>
        <input type="text" placeholder="City/Municipality" required></div></div>`;
        break;
      case 'marriage':
        fieldsHTML = `<div class="form-group"><label>Husband's Name</label><div class="name-group"><input type="text" placeholder="First Name" required><input type="text" placeholder="Last Name" required><input type="text" placeholder="Middle Name"></div></div><div class="form-group"><label>Wife's Name</label><div class="name-group"><input type="text" placeholder="First Name" required><input type="text" placeholder="Last Name" required><input type="text" placeholder="Middle Name (Maiden)"></div></div><div class="form-row"><div class="form-group"><label>Date of Marriage</label><input type="date" required></div><div class="form-group"><label>Place of Marriage</label><input type="text" placeholder="City/Municipality" required></div></div>`;
        break;
      case 'death':
        fieldsHTML = `<div class="form-group"><label>Deceased's Name</label><div class="name-group"><input type="text" placeholder="First Name" required><input type="text" placeholder="Last Name" required><input type="text" placeholder="Middle Name"></div></div><div class="form-row"><div class="form-group"><label>Date of Death</label><input type="date" required></div><div class="form-group"><label>Place of Death</label><input type="text" placeholder="City/Municipality" required></div></div><div class="form-group"><label>Cause of Death</label><input type="text" placeholder="If known"></div>`;
        break;
      case 'cenomar':
        fieldsHTML = `<div class="form-group"><label>Applicant's Name</label><div class="name-group"><input type="text" placeholder="First Name" required><input type="text" placeholder="Last Name" required><input type="text" placeholder="Middle Name"></div></div><div class="form-row"><div class="form-group"><label>Date of Birth</label><input type="date" required></div><div class="form-group"><label>Place of Birth</label><input type="text" placeholder="City/Municipality" required></div></div>`;
        break;
      case 'cenodeath':
        fieldsHTML = `<div class="form-group"><label>Person's Name</label><div class="name-group"><input type="text" placeholder="First Name" required><input type="text" placeholder="Last Name" required><input type="text" placeholder="Middle Name"></div></div><div class="form-row"><div class="form-group"><label>Date of Birth</label><input type="date"></div><div class="form-group"><label>Last Known Residence</label><input type="text" placeholder="City/Municipality"></div></div>`;
        break;
      case 'correction':
        fieldsHTML = `<div class="form-group"><label>Person's Name</label><div class="name-group"><input type="text" placeholder="First Name" required><input type="text" placeholder="Last Name" required><input type="text" placeholder="Middle Name"></div></div><div class="form-row"><div class="form-group"><label>Date of Birth</label><input type="date"></div><div class="form-group"><label>Last Known Residence</label><input type="text" placeholder="City/Municipality"></div><div class="remark"><label>Reason for Document Correction</label><textarea rows="3"></textarea></div></div>`;
        break;
    }
    fieldsContainer.innerHTML = fieldsHTML;
  });

  // --- PDF Download ---
  window.downloadWalkInPDF = function () {
    const element = document.getElementById('walkInSummaryPrintable');
    html2pdf().set({
      margin: 10,
      filename: 'WalkIn_Application_Summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }

  window.openWalkInForm = openWalkInForm;
  window.closeWalkInForm = closeWalkInForm;
});

let uploadedFiles = [];

function handleFileSelection(input) {
  const MAX_SIZE = 500 * 1024 * 1024; // 500MB total limit
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

  if (input.files && input.files.length > 0) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];

      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: `${file.name} is ${formatFileSize(file.size)} (max 100MB per file)`,
          confirmButtonColor: '#3498db'
        });
        continue;
      }

      const fileExists = uploadedFiles.some(
        existingFile => existingFile.name === file.name && existingFile.size === file.size
      );

      if (!fileExists) uploadedFiles.push(file);
    }
  }

  updateFilePreview();
  updateInputFiles();
}

function updateFilePreview() {
  const fileList = document.getElementById('fileList');
  const totalSizeElement = document.getElementById('totalSize');
  let totalSize = 0;

  fileList.innerHTML = '';

  if (uploadedFiles.length === 0) {
    fileList.innerHTML = '<div class="no-files">No files selected yet</div>';
    totalSizeElement.textContent = '0 MB';
    return;
  }

  uploadedFiles.forEach((file, index) => {
    totalSize += file.size;
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    let iconClass = 'fa-file-alt';
    if (file.type.startsWith('image/')) iconClass = 'fa-file-image';
    else if (file.type === 'application/pdf') iconClass = 'fa-file-pdf';
    else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      iconClass = 'fa-file-word';
    }

    fileItem.innerHTML = `
      <i class="fas ${iconClass} file-icon"></i>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-size">${formatFileSize(file.size)}</div>
      </div>
      <i class="fas fa-times remove-file" data-index="${index}"></i>
    `;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const previewContent = document.createElement('div');
        previewContent.innerHTML = `<img src="${e.target.result}" class="preview-image" alt="Preview">`;
        fileItem.appendChild(previewContent);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      const previewContent = document.createElement('div');
      previewContent.className = 'pdf-preview';
      previewContent.innerHTML = `
        <i class="fas fa-file-pdf pdf-preview-icon"></i>
        <div class="pdf-preview-text">PDF Document</div>
      `;
      fileItem.appendChild(previewContent);
    }

    fileList.appendChild(fileItem);
  });

  totalSizeElement.textContent = formatFileSize(totalSize);

  document.querySelectorAll('.remove-file').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      removeFile(index);
    });
  });
}

function removeFile(index) {
  uploadedFiles.splice(index, 1);
  updateFilePreview();
  updateInputFiles();
}

function updateInputFiles() {
  const input = document.getElementById('documentUpload');
  const dataTransfer = new DataTransfer();
  uploadedFiles.forEach(file => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

document.getElementById('prevBtn').addEventListener('click', function() {
  console.log('Previous button clicked');
});

document.getElementById('nextStep2Btn').addEventListener('click', function() {
  if (uploadedFiles.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'No Files Selected',
      text: 'Please upload at least one file',
      confirmButtonColor: '#3498db'
    });
    return;
  }
  console.log('Next button clicked with files:', uploadedFiles);
});

function validateStep2() {
  const idImageInput = document.getElementById('documentUpload');
  if (!idImageInput || !idImageInput.files || idImageInput.files.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please upload your ID or document for verification.',
      confirmButtonColor: '#3b82f6'
    });
    return false;
  }
  // Optionally, add file type/size validation here
  return true;
}