console.log('✅ JS loaded');
function openAboutPopup() {
window.location.href = '../AboutUs/AboutUs.html';
}
function generateAppointmentID() {
  const timestamp = Date.now().toString(36); // base36 timestamp
  const random = Math.random().toString(36).substring(2, 8); // random suffix
  return `APT-${timestamp}-${random}`.toUpperCase();
}

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Category Tabs
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqSections = document.querySelectorAll('.faq-questions');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Show selected FAQ section
            faqSections.forEach(section => {
                section.classList.remove('active');
                if (section.dataset.category === category) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // FAQ Accordion
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        const title = question.querySelector('h3');
        title.addEventListener('click', () => {
            questions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                }
            }); 
           question.classList.toggle('active');
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    document.querySelector('.footer-bottom p').insertAdjacentHTML('beforeend', ' &copy; ');
    document.querySelector('.footer-bottom p').appendChild(yearSpan);
});

  function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('show');
  }
// Feedback Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const feedbackPopup = document.getElementById('feedbackPopup');
  const feedbackTrigger = document.getElementById('feedbackTrigger');
  const closeFeedback = document.getElementById('closeFeedback');
  const feedbackForm = document.getElementById('feedbackForm');
  const stars = document.querySelectorAll('.stars i');
  const ratingValue = document.getElementById('ratingValue');
  
  // Open popup
  feedbackTrigger.addEventListener('click', function() {
    feedbackPopup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  });
  
  // Close popup
  closeFeedback.addEventListener('click', function() {
    closeFeedbackPopup();
  });
  
  // Close when clicking outside
  feedbackPopup.addEventListener('click', function(e) {
    if (e.target === feedbackPopup) {
      closeFeedbackPopup();
    }
  });
  
  // Star rating functionality
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      ratingValue.value = rating;
      updateStars(rating);
    });
    
    star.addEventListener('mouseover', function() {
      const hoverRating = parseInt(this.getAttribute('data-rating'));
      updateStars(hoverRating, true);
    });
    
    star.addEventListener('mouseout', function() {
      const currentRating = parseInt(ratingValue.value);
      updateStars(currentRating);
    });
  });
  
  // Form submission
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const feedbackType = document.getElementById('feedbackType').value;
    const feedbackMessage = document.getElementById('feedbackMessage').value;
    const rating = ratingValue.value;
    const email = document.getElementById('feedbackEmail').value;
    
    // Here you would typically send this data to your server
    console.log({
      type: feedbackType,
      message: feedbackMessage,
      rating: rating,
      email: email
    });
    
    // Show thank you message
    alert('Thank you for your feedback! We appreciate your input.');
    feedbackForm.reset();
    ratingValue.value = '0';
    updateStars(0);
    closeFeedbackPopup();
  });
  
  function closeFeedbackPopup() {
    feedbackPopup.classList.remove('active');
    document.body.style.overflow = ''; 
  }
  
  function updateStars(rating, isHover = false) {
    stars.forEach(star => {
      const starRating = parseInt(star.getAttribute('data-rating'));
      
      star.classList.remove('active', 'hovered');
      
      if (isHover) {
        if (starRating <= rating) {
          star.classList.add('hovered');
        }
      } else {
        if (starRating <= rating) {
          star.classList.add('active');
        }
      }
    });
  }
});


const toggleBtn = document.getElementById('toggleHolidays');
const hiddenHolidays = document.querySelectorAll('.holiday.hidden');
let expanded = false;

const icon = document.createElement('i');
icon.className = 'fas fa-chevron-down';
toggleBtn.prepend(icon);

toggleBtn.addEventListener('click', () => {
  expanded = !expanded;
  toggleBtn.classList.toggle('expanded');
  
  toggleBtn.innerHTML = expanded ? 
    `<i class="fas fa-chevron-up"></i> Show Fewer Holidays` : 
    `<i class="fas fa-chevron-down"></i> Show More Holidays`;
  
  // Animate holidays
  hiddenHolidays.forEach((item, index) => {
    if (expanded) {
      setTimeout(() => {
        item.style.display = 'flex';
        setTimeout(() => {
          item.classList.remove('hidden');
        }, 10);
      }, index * 100);
    } else {
      setTimeout(() => {
        item.classList.add('hidden');
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }, index * 50);
    }
  });
  
  if (expanded) {
    setTimeout(() => {
      toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, hiddenHolidays.length * 100 + 100);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const feedbackLink = document.querySelector('a[href="#feedback"]');
  const feedbackTrigger = document.getElementById('feedbackTrigger');
  
  if (feedbackLink) {
    feedbackLink.addEventListener('click', function(e) {
      e.preventDefault();
      feedbackTrigger.classList.add('feedback-shake');
      feedbackTrigger.style.color = '#FFA500';
      setTimeout(() => {
        feedbackTrigger.classList.remove('feedback-shake');
      }, 500);
      setTimeout(() => {
        feedbackTrigger.style.color = '';
      }, 2000);

  })}   
});
// Updated Appointment Booking Functionality
document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('appointmentDate');
  const timeSelect = document.getElementById('appointmentTime');
  let selectedDate = null;

  // Set up flatpickr for weekday selection only
  if (dateInput) {
    flatpickr(dateInput, {
      dateFormat: "Y-m-d",
      minDate: new Date().fp_incr(2),
      disable: [
        function (date) {
          // Disable Saturday (6) and Sunday (0)
          return date.getDay() === 0 || date.getDay() === 6;
        }
      ],
      onChange: function (selectedDates) {
        selectedDate = selectedDates[0];
        updateConfirmation();
      }
    });

    // Generate time slots (9AM–4PM every 30 min)
    const startHour = 9;
    const endHour = 16;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        timeSelect.appendChild(option);
      }
    }

    // Update Confirmation Summary
    function updateConfirmation() {
      const email = document.getElementById('appointmentEmail').value;
      document.getElementById('displayEmail').textContent = email || 'Not provided';

      const serviceSelect = document.getElementById('serviceType');
      const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
      document.getElementById('displayService').textContent = serviceText || 'Not selected';

      document.getElementById('displayDate').textContent =
        selectedDate ? selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Not selected';

      const timeText = timeSelect.options[timeSelect.selectedIndex].text;
      document.getElementById('displayTime').textContent = timeText || 'Not selected';
    }

    // Listeners to auto-update confirmation
    document.getElementById('appointmentEmail').addEventListener('input', updateConfirmation);
    document.getElementById('serviceType').addEventListener('change', updateConfirmation);
    timeSelect.addEventListener('change', updateConfirmation);

    // Confirmation Logic
    document.getElementById('confirmAppointment').addEventListener('click', function () {
      const email = document.getElementById('appointmentEmail').value;
      const service = document.getElementById('serviceType').value;
      const time = timeSelect.value;
      const date = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

      if (!email || !service || !date || !time) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Information',
          text: 'Please complete all appointment details.',
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.',
        });
        return;
      }

      const appointmentID = generateAppointmentID();
      const appointmentData = {
        id: appointmentID,
        email: email,
        service: document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text,
        date: date,
        time: time,
        timestamp: new Date(`${date}T${time}`).toISOString()
      };

      console.log('Appointment booked:', appointmentData);
            
      Swal.fire({
        icon: 'success',
        title: 'Appointment Confirmed!',
        html: `
          <div style="text-align: left; line-height: 1.6;">
            <p><strong>Appointment ID:</strong> <code>${appointmentID}</code></p>
            <p><strong>Service:</strong> ${appointmentData.service}</p>
            <p><strong>Date:</strong> ${new Date(appointmentData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Time:</strong> ${appointmentData.time}</p>
            <p>A confirmation has been sent to <strong>${appointmentData.email}</strong>.</p>
            <button id="downloadReceiptBtnSwal" class="swal2-styled" style="margin-top: 1em; background-color: #3085d6;">
              Download Receipt (PDF)
            </button>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        didRender: () => {
          // Populate receipt info
          document.getElementById('rID').textContent = appointmentID;
          document.getElementById('rService').textContent = appointmentData.service;
          document.getElementById('rDate').textContent = new Date(appointmentData.date).toLocaleDateString();
          document.getElementById('rTime').textContent = appointmentData.time;
          document.getElementById('rEmail').textContent = appointmentData.email;

          // Attach download functionality
          document.getElementById('downloadReceiptBtnSwal').addEventListener('click', () => {
            const receipt = document.getElementById('appointmentReceipt');
            html2pdf().from(receipt).save(`Appointment_${appointmentID}.pdf`);
          });
        }
      }).then(() => {
        // Reset form after user clicks OK
        document.getElementById('appointmentForm').reset();

        // Optional: clear display summary values
        document.getElementById('displayEmail').textContent = '';
        document.getElementById('displayService').textContent = '';
        document.getElementById('displayDate').textContent = '';
        document.getElementById('displayTime').textContent = '';
      });



    });
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-requirements`).classList.add('active');
        });
    });

});

function openCertificate(certificateType) {
    // Hide all certificate contents
    var contents = document.getElementsByClassName("correction-type");
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }
    
    // Remove active class from all tabs
    var tabs = document.getElementsByClassName("certificate-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    // Show the selected certificate content and mark tab as active
    document.getElementById(certificateType).style.display = "block";
    event.currentTarget.classList.add("active");
}
window.openCertificate = openCertificate;

document.addEventListener('DOMContentLoaded', function () {
  const downloadBtn = document.getElementById('downloadRequirementsBtn');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // 1. Clone the requirements content
      const originalContent = document.querySelector('.requirements-content');
      const clonedContent = originalContent.cloneNode(true);

      // 2. Force all hidden elements to be shown
      clonedContent.querySelectorAll('.tab-content, .correction-type').forEach(el => {
        el.style.display = 'block';
        el.style.pageBreakInside = 'avoid';
        el.style.breakInside = 'avoid';
        el.style.marginBottom = '20px';
        el.style.padding = '10px';
        el.style.background = '#fff';
      });

      clonedContent.querySelectorAll('ul').forEach(ul => {
        ul.style.marginBottom = '15px';
      });

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '900px'; 
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.lineHeight = '1.6';
      tempContainer.style.fontSize = '12px';
      tempContainer.appendChild(clonedContent);
      document.body.appendChild(tempContainer);

      html2pdf()
        .from(clonedContent)
        .set({
          filename: 'Civil_Registry_Requirements.pdf',
          margin: [0.3, 0.3, 0.3, 0.3], 
          html2canvas: {
            scale: 2,
            scrollY: 0
          },
          jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
          }
        })
        .save()
        .then(() => {
          document.body.removeChild(tempContainer);
        });
    });
  }
});