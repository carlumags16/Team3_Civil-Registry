<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Philippine Civil Registry Information System</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="head">
  <div class="header-main">
    <div class="logo-container">
      <img src="resources/Logo.png" alt="Logo" class="logo">
    </div>
    <div class="title-container">
      <h1>CIVIL REGISTRY INFORMATION SYSTEM</h1>
      <p class="tagline">Preserving Life's Milestones, One Record at a Time</p>
    </div>

  </div>

  <!--  Hamburger Menu (for Mobile) -->
  <div class="hamburger" onclick="toggleMenu()">
    <div></div>
    <div></div>
    <div></div>
  </div>

  <!-- Navigation Section -->
  <div class="header-right">
    <nav class="nav-links">
      <a href="#" data-translate="aboutus" onclick="openAboutPopup()">About us</a>
      <a href="#feedback" data-translate="feedback" id="headerFeedbackLink">Feedback</a>
      <a href="Loginweb/LoginPage.html" class="btn">Login</a>


    </nav>
  </div>
</header>


    <section class="hero">
        <div class="container">
            <h2>Need a Birth, Marriage, or Death certificate?</h2>
            <p>Register online securely and stay informed about official holidays to plan ahead!</p>
            <a href="Loginweb/LoginPage.html" class="btn">Start Registration Now</a>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Why Use Our System?</h2>
            <div class="features-grid">
                <div class="feature">
                    <i class="fas fa-bolt"></i>
                    <h3>Fast & Secure Requests</h3>
                    <p>Get government certificates without long queues.</p>
                </div>
                <div class="feature">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Real-Time Tracking</h3>
                    <p>Monitor your application status anytime.</p>
                </div>
                <div class="feature">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>Holiday Alerts</h3>
                    <p>Avoid delays by checking non-working days upfront.</p>
                </div>
                <div class="feature">
                    <i class="fas fa-mobile-alt"></i>
                    <h3>Mobile-Friendly</h3>
                    <p>Accessible on any device, anywhere.</p>
                </div>
            </div>
        </div>
    </section>

<section class="appointment" id="appointment">
  <div class="container">
    <h2>Walk in application? Book Online to see available date and time!</h2>
    <p class="subtitle">Select a service, choose a date and time, and confirm your visit—fast and easy.</p>
    
    <div class="appointment-steps">
      <!-- Step 1: Select Service and Email -->
      <div class="appointment-step">
        <div class="step-number">1</div>
        <h3>Your Information</h3>
                <div class="form-group">
          <label for="serviceType">Service Needed</label>
          <select id="serviceType" name="service" class="form-select" required>
            <option value="">-- Select Certificate --</option>
            <option value="birth">Birth Certificate Registration</option>
            <option value="marriage">Marriage Certificate Registration</option>
            <option value="death">Death Certificate Registration</option>
            <option value="cenomar">CENOMAR Request</option>
            <option value="cenodeath">CENODEATH Registration</option>
            <option value="correction">Document Correction | R.A 9048 </option>
          </select>
        </div>
        <div class="form-group">
          <label for="appointmentEmail">Email Address</label>
          <input type="email" id="appointmentEmail" name="email" class="form-input" 
                 placeholder="Your email for confirmation" required>
        </div>
        

      </div>
      
      <!-- Step 2: Choose Date & Time -->
      <div class="appointment-step">
        <div class="step-number">2</div>
        <h3>Choose Date & Time</h3>
        <div class="datetime-picker">
          <div class="form-group">
            <label for="appointmentDate">Date</label>
            <input type="date" id="appointmentDate" name="date" class="form-input" min="" required>
          </div>
          <div class="form-group">
            <label for="appointmentTime">Time</label>
            <select id="appointmentTime" name="time" class="form-select" required>
              <option value="">-- Select Time --</option>
              <!-- Times will be populated by JavaScript -->
            </select>
          </div>
        </div>
        <p class="note">Note: Appointments available from 9AM to 4PM, Monday to Friday</p>
      </div>
      
      <!-- Step 3: Confirm Details -->
      <div class="appointment-step">
        <div class="step-number">3</div>
        <h3>Confirm Details</h3>
        <div class="confirmation-details">
          <p><strong>Email:</strong> <span id="displayEmail">Not provided</span></p>
          <p><strong>Service:</strong> <span id="displayService">Not selected</span></p>
          <p><strong>Date:</strong> <span id="displayDate">Not selected</span></p>
          <p><strong>Time:</strong> <span id="displayTime">Not selected</span></p>
        </div>
        <button id="confirmAppointment" class="book-btn">Confirm Appointment</button>
        <p class="note">By confirming, you agree to our <a href="#">terms of service</a></p>
      </div>

            <button id="downloadReceiptBtn" style="display:none;" class="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        Download Receipt (PDF)
      </button>

      <!-- Hidden receipt content -->
      <div id="appointmentReceipt" style="display: none;">
        <form id="appointmentForm">
        <h2>Appointment Receipt</h2>
        <p><strong>ID:</strong> <span id="rID"></span></p>
        <p><strong>Service:</strong> <span id="rService"></span></p>
        <p><strong>Date:</strong> <span id="rDate"></span></p>
        <p><strong>Time:</strong> <span id="rTime"></span></p>
        <p><strong>Email:</strong> <span id="rEmail"></span></p>
        </form>
      </div>


    </div>
  </div>
</section>

<section class="announcements">
  <div class="container">
    <h2>Latest Announcements</h2>
    <div class="announcement-list">
      <div class="announcement-item">
        <h3>System Maintenance Scheduled</h3>
        <p class="announcement-date">Posted: June 15, 2025</p>
        <p>Our online services will be temporarily unavailable on <strong>June 25, 2025 (9:00 PM to 3:00 AM)</strong> for system upgrades. We apologize for any inconvenience.</p>
      </div>
      <div class="announcement-item">
        <h3>New Mobile App Released</h3>
        <p class="announcement-date">Posted: June 10, 2025</p>
        <p>Download our new mobile app for faster certificate requests and real-time notifications. Available now on <strong>Google Play Store and Apple App Store</strong>.</p>
      </div>
      <div class="announcement-item">
        <h3>Extended Office Hours</h3>
        <p class="announcement-date">Posted: June 5, 2025</p>
        <p>To accommodate increased demand, our Quezon City office will have extended hours <strong>every Saturday in June from 8:00 AM to 2:00 PM</strong>.</p>
      </div>
    </div>
  </div>
</section>

<section class="holidays">
  <div class="container">
    <h2>Latest Philippine Holiday Announcements</h2>

    <div class="holiday-list">
      <!-- JUNE HOLIDAYS -->
      <div class="holiday"> <span class="date">June 12 (Wed)</span> <span class="name">Independence Day</span> </div>
      <div class="holiday"> <span class="date">June 24 (Tue)</span> <span class="name">Special non-working Holiday</span> </div>
      <div class="holiday"> <span class="date">June 24 (Tue)</span> <span class="name">Special non-working Holiday</span> </div>

      <!-- Hidden holidays initially -->
      <div class="holiday hidden"> <span class="date">August 21 (Thurs)</span> <span class="name">Ninoy Aquino Day</span> </div>
      <div class="holiday hidden"> <span class="date">August 25 (Mon)</span> <span class="name">National Heroes Day</span> </div>
      <div class="holiday hidden"> <span class="date">November 1 (Fri)</span> <span class="name">All Saints' Day</span> </div>
      <div class="holiday hidden"> <span class="date">November 2 (Sat)</span> <span class="name">All Souls' Day</span> </div>
      <div class="holiday hidden"> <span class="date">November 30 (Sun)</span> <span class="name">Bonifacio Day</span> </div>
      <div class="holiday hidden"> <span class="date">December 8 (Mon)</span> <span class="name">Feast of the Immaculate Conception</span> </div>
      <div class="holiday hidden"> <span class="date">December 25 (Thu)</span> <span class="name">Christmas Day</span> </div>
    </div>

    <button id="toggleHolidays" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Show More Holidays</button>
    <p class="tip mt-2">Submit applications before holidays to expedite processing!</p>
  </div>
</section>


    <section id="register" class="registration-steps">
        <div class="container">
            <h2>How to Register Online in 5 Easy Steps</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Log In</h3>
                    <p>Use your registered email/password. New user? <a href="Loginweb/LoginPage.html">Sign up here</a>.</p>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Complete the Form</h3>
                    <p>Fill in personal details and upload a <strong>valid ID</strong> (e.g., passport, driver's license).</p>
                    <p class="note">Not applicable? Write "N/A" in empty fields.</p>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Pay the Fee</h3>
                    <p>Choose: <strong>GCash, PayMaya, online banking, QR code, or over-the-counter</strong>.</p>
                    <p>Enter OTP if prompted.</p>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <h3>Review & Submit</h3>
                    <p>Download your PDF receipt. Double-check details before finalizing.</p>
                </div>
                <div class="step">
                    <div class="step-number">5</div>
                    <h3>Track Your Application</h3>
                    <p>Check your dashboard for updates (processing time: <strong>3-7 business days</strong>).</p>
                </div>
            </div>
            <a href="Loginweb/LoginPage.html" class="btn btn-large">Start Registration Now</a>
        </div>
    </section>

    <section class="document-requirements">
    <div class="container">
        <h2>Document Requirements</h2>        
        <div class="requirements-tabs">
            <button class="tab-btn active" data-tab="birth">Birth Certificate</button>
            <button class="tab-btn" data-tab="marriage">Marriage Certificate</button>
            <button class="tab-btn" data-tab="death">Death Certificate</button>
            <button class="tab-btn" data-tab="cenomar">CENOMAR</button>
            <button class="tab-btn" data-tab="cenodeath">CENODEATH</button>
        </div>
        
        <div class="requirements-content">
            <!-- Birth Certificate Requirements -->
            <div class="tab-content active" id="birth-requirements">
                <h3>Requirements for Birth Certificate Registration</h3>
                <ul>
                    <li><strong>Parents' Marriage Certificate</strong> (if parents are married)</li>
                    <li><strong>Valid IDs of parents</strong> (at least two government-issued IDs)</li>
                    <li><strong>Affidavit of Acknowledgement/Admission of Paternity</strong> (for illegitimate children)</li>
                    <li><strong>Affidavit of Delayed Registration</strong> (if registered after 30 days from birth)</li>
                </ul>
                <div class="note">
                    <p><strong>Note:</strong> Additional documents may be required for special cases like foreign parentage or foundlings.</p>
                </div>
            </div>
            
            <!-- Marriage Certificate Requirements -->
            <div class="tab-content" id="marriage-requirements">
                <h3>Requirements for Marriage Certificate Registration</h3>
                <ul>
                    <li><strong>Marriage License</strong> (issued by the local civil registrar)</li>
                    <li><strong>Valid IDs of both spouses</strong> (at least two government-issued IDs each)</li>
                    <li><strong>Certificate of Attendance</strong> from pre-marriage counseling seminar</li>
                    <li><strong>Affidavit of Delayed Registration</strong> (if registered beyond 15 days from marriage)</li>
                </ul>
                <div class="note">
                    <p><strong>Note:</strong> For foreign marriages, additional authentication may be required.</p>
                </div>
            </div>
            
            <!-- Death Certificate Requirements -->
            <div class="tab-content" id="death-requirements">
                <h3>Requirements for Death Certificate Registration</h3>
                <ul>
                    <li><strong>Funeral Permit</strong></li>
                    <li><strong>Valid ID of the informant</strong> (usually next of kin)</li>
                    <li><strong>Affidavit of Delayed Registration</strong> (if registered beyond 30 days from death)</li>
                    <li><strong>Medical Certificate</strong> (stating cause of death)</li>
                </ul>
                <div class="note">
                    <p><strong>Note:</strong> For deaths without medical attendance, additional requirements may apply.</p>
                </div>
            </div>
            
            <!-- CENOMAR Requirements -->
            <div class="tab-content" id="cenomar-requirements">
                <h3>Requirements for CENOMAR Request</h3>
                <ul>
                    <li><strong>Valid ID</strong> (government-issued with photo)</li>
                    <li><strong>Notarized Application Form</strong></li>
                    <li><strong>Authorization Letter</strong> (if requested by another person)</li>
                    <li><strong>Payment Receipt</strong> (official receipt of payment)</li>
                </ul>
                <div class="note">
                    <p><strong>Note:</strong> CENOMAR (Certificate of No Marriage) is typically required for marriage license applications.</p>
                </div>
            </div>
            
            <!-- CENODEATH Requirements -->
            <div class="tab-content" id="cenodeath-requirements">
                <h3>Requirements for CENODEATH Request</h3>
                <ul>
                    <li><strong>Valid ID</strong> (government-issued with photo)</li>
                    <li><strong>Proof of Relationship</strong> (if requesting for a relative)</li>
                    <li><strong>Notarized Application Form</strong></li>
                    <li><strong>Authorization Letter</strong> (if requested by another person)</li>
                    <li><strong>Payment Receipt</strong> (official receipt of payment)</li>
                </ul>
                <div class="note">
                    <p><strong>Note:</strong> CENODEATH (Certificate of No Death Record) is often required for legal or inheritance purposes.</p>
                </div>
            </div>
        </div>
        
        <div class="requirements-footer">
            <p><strong>Important:</strong> All documents must be original or certified true copies. Photocopies must be presented with original documents for verification.</p>
            <a href="#" class="btn btn-outline">Download Complete Requirements PDF</a>
        </div>
    </div>
</section>

    <section class="faq">
        <div class="container">
            <h2>Frequently Asked Questions (FAQs)</h2>
            <div class="faq-categories">
                <button class="category-btn active" data-category="general">General</button>
                <button class="category-btn" data-category="requirements">Requirements</button>
                <button class="category-btn" data-category="payment">Payment & Processing</button>
                <button class="category-btn" data-category="support">Support</button>
            </div>
            
            <div class="faq-questions active" data-category="general">
                <div class="question">
                    <h3>What certificates can I request?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Birth, Marriage, Death, Cenomar, and Cenodeath certificates issued by the Philippine government. For other certificate kindly contact our support.</p>
                    </div>
                </div>
                <div class="question">
                    <h3>How can I submit and download the Request for Correction (R.A. 9048) form?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>For walk-in Application. Kindly, submit the form and select <strong>Document Correction</strong> from there you can submit and download the form
                        you will be also given an <em>Appointment ID.</em></p>
                    </div>
                </div>
                <div class="question">
                    <h3>Can I register for a family member?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Yes, with their written authorization and your valid ID.</p>
                    </div>
                </div>
            </div>
            
            <div class="faq-questions" data-category="requirements">
                <div class="question">
                    <h3>What if I don't have all the documents?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Provide available IDs and explain gaps in the "Remarks" section.</p>
                    </div>
                </div>
                <div class="question">
                    <h3>Is my data secure?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Yes! We use encryption and comply with the <strong>Data Privacy Act</strong>.</p>
                    </div>
                </div>
            </div>
            
            <div class="faq-questions" data-category="payment">
                <div class="question">
                    <h3>What's the fee for certificates?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Fees vary by document type. The system will display the amount before payment.</p>
                    </div>
                </div>
                <div class="question">
                    <h3>What if my payment fails?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Retry or contact your bank. For issues, email <strong>support@civilregistry.gov.ph</strong>.</p>
                    </div>
                </div>
            </div>
            
            <div class="faq-questions" data-category="support">
                <div class="question">
                    <h3>How do I correct a form?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Edit details in your dashboard <em>before</em> payment. After submission, contact support.</p>
                    </div>
                </div>
                <div class="question">
                    <h3>Where's my certificate?<i class="fas fa-chevron-down"></i></h3>
                    <div class="answer">
                        <p>Log in to track status. Delays may occur during holidays.</p>
                    </div>
                </div>
            </div>
            
        </div>
    </section>

<footer>
  <div class="container">
    <!-- Main Footer Content -->
    <div class="footer-content">

      <!-- Contact Info -->
      <div class="footer-info">
        <h3>📞 Need Help?</h3>
        <p>Email us at <strong><a href="mailto:support@civilregistry.gov.ph" style="color: skyblue;">support@civilregistry.gov.ph</a></strong></p>
        <p>Call <strong>+1 234 567 890</strong> <br><span style="font-size: 0.9rem; color: rgba(255,255,255,0.7);">(Mon–Fri, 8AM–5PM)</span></p>
        <p>Visit us: <br><strong>Cyberpark Tower 2, General Araneta, Cubao, Quezon City, Metro Manila 1109</strong></p>
        <p><a href="faq.html" style="color: skyblue; text-decoration: underline;">Frequently Asked Questions (FAQ)</a></p>
      </div>

      <!-- Social Media -->
      <div class="footer-social">
        <h3>📢 Follow Us</h3>
        <div class="social-icons">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
        <p style="margin-top: 10px; color: rgba(255,255,255,0.8); font-size: 0.9rem;">Stay informed on announcements and holiday schedules.</p>
      </div>

      <!-- About Section -->
      <div class="footer-info">
        <h3>🏢 About Civil Registry</h3>
        <p>We provide fast, reliable, and secure civil registration services including birth, marriage, death, and certificate issuance across the Philippines.</p>
        <p><a href="careers.html" style="color: skyblue; text-decoration: underline;">We're hiring – Join our team!</a></p>
      </div>
    </div>

    <!-- Enhanced Footer Bottom -->
    <div class="footer-bottom">
      <p class="powered-by">
        &copy; 2025 Civil Registry Philippines. All rights reserved.<br>
        <span style="display: block; margin-top: 8px;">
          <a href="terms.html" style="color: skyblue; text-decoration: underline;">Terms of Service</a> |
          <a href="privacy.html" style="color: skyblue; text-decoration: underline;">Privacy Policy</a> |
          <a href="accessibility.html" style="color: skyblue; text-decoration: underline;">Accessibility</a> 
        </span>
        <span style="display: block; margin-top: 8px; font-style: italic; color: rgba(255,255,255,0.7); cursor: default;">
          Empowering every Filipino through trusted digital civil services <a href="AdminPortal/AdminLogin.html" style="text-decoration: none;
          color: rgba(255,255,255,0.7); cursor: default;"  >
          🇵🇭 </a>
        </span>
      </p>
    </div>

  </div>
</footer>



<!-- Feedback Popup -->
<div id="feedbackPopup" class="feedback-popup">
  <div class="feedback-container">
    <button id="closeFeedback" class="close-btn">&times;</button>
    <h3>We'd Love Your Feedback!</h3>
    <form id="feedbackForm">
      <div class="form-group">
        <label for="feedbackType">Feedback Type</label>
        <select id="feedbackType" required>
          <option value="">Select type</option>
          <option value="suggestion">Suggestion</option>
          <option value="bug">Bug Report</option>
          <option value="compliment">Compliment</option>
          <option value="complaint">Complaint</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="feedbackMessage">Your Feedback</label>
        <textarea id="feedbackMessage" rows="4" required></textarea>
      </div>
      
      <div class="form-group rating-group">
        <label>Rating</label>
        <div class="stars">
          <i class="far fa-star" data-rating="1"></i>
          <i class="far fa-star" data-rating="2"></i>
          <i class="far fa-star" data-rating="3"></i>
          <i class="far fa-star" data-rating="4"></i>
          <i class="far fa-star" data-rating="5"></i>
        </div>
        <input type="hidden" id="ratingValue" value="0">
      </div>
      
      <div class="form-group">
        <label for="feedbackEmail">Email (optional)</label>
        <input type="email" id="feedbackEmail" placeholder="If you'd like a response">
      </div>
      
      <button type="submit" class="submit-btn">Submit Feedback</button>
    </form>
  </div>
</div>

<!-- Feedback Trigger Button -->
<button id="feedbackTrigger" class="feedback-trigger">
  <i class="fas fa-comment-dots"></i>
</button>

    <script src="style.js"></script>
</body>
</html>