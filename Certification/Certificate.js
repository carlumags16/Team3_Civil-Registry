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
          <li><strong>Please allow 3–10 business days for processing</strong></li>
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
    showStep(currentStep);  
}

function closeForm() {
    const popup = document.getElementById('popupForm');
    if (popup) popup.style.display = 'none';
    certificateForm?.reset();
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



const form = document.getElementById('certificateForm');
const steps = document.querySelectorAll('.form-step');

const nextBtn = document.getElementById('nextBtn');
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
    steps.forEach((el, idx) => {
        el.style.display = idx === step ? 'block' : 'none';
    });
    prevBtn.disabled = step === 0;
    nextBtn.style.display = step === steps.length - 1 ? 'none' : 'inline-block';
    form.querySelector('button[type="submit"]').style.display = step === steps.length - 1 ? 'inline-block' : 'none';
    downloadBtn.style.display = step === steps.length - 1 ? 'inline-block' : 'none';
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

nextBtn.addEventListener('click', () => {
    if (!validateStep1()) return;

    generateSummary();
    currentStep = 1;
    showStep(currentStep);
});

prevBtn.addEventListener('click', () => {
    currentStep = 0;
    showStep(currentStep);
});

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
                title: 'Thank you for your cooperation!',
                text: 'Kindly check your email to verify the payment and updates of your registration.',
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
            title: 'Submission Failed',
            text: 'Please try again later.',
            confirmButtonColor: '#ef4444'
        });
    }
});


//First AAAAAAAAAAARRGGHHH
showStep(currentStep);


async function downloadPDF() {
    const certType = document.getElementById('certificateType').value;
    const sectionMap = {
        'Birth Certificate': 'birthFields',
        'Marriage Certificate': 'marriageFields',
        'Death Certificate': 'deathFields',
        'Cenomar Certificate': 'cenomarFields',
        'Cenodeath Certificate': 'cenodeathFields'
    };
    const sectionId = sectionMap[certType];
    const section = document.getElementById(sectionId);

    if (!section) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
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