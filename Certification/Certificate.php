<?php
session_start();
include "../connect.php";

if (!isset($_SESSION['user_id'])&& !isset($_SESSION['isAdmin'])) {
    echo "Please log in to view your records.";
    exit;
}

$user_id = $_SESSION['user_id'];

$sql_full = "SELECT document.reg_id, users.username, document.certif_type, document.status
             FROM document
             INNER JOIN users ON document.user_id = users.id
             WHERE users.id = ?
             ORDER BY CAST(SUBSTRING(document.reg_id, 5) AS UNSIGNED) DESC";

$stmt = $conn->prepare($sql_full);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result_full = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"> 
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="Certificate.css">
</head>

<body>

   <header class="head">
  <div class="header-main">
    <div class="logo-container">
      <img src="../resources/Logo.png" alt="Logo" class="logo">
    </div>

    <!-- Search Bar -->
    <div class="search-tab">
      <div class="search-cluster">
        <input class="searchInput" type="text" placeholder="Search your input Register Certificate...">
        <i class="fas fa-microphone"></i>
        <button class="searchButton" id="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
            <g clip-path="url(#clip0_2_17)">
              <g filter="url(#filter0_d_2_17)">
                <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
              </g>
            </g>
            <defs>
              <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"/>
              </filter>
              <clipPath id="clip0_2_17">
                <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <!-- Navigation Section -->
  <div class="header-right">
    <nav class="nav-links">
      <a href="#" data-translate="aboutus" onclick="openAboutPopup()">About us</a>

      <div id="userIconContainer">
        <i class="fas fa-user-circle" id="userIcon"></i>
        <div id="userDropdown">
          <p>Hello, <span id="userNameDisplay"></span></p><br>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    </nav>
  </div>

</header>

<div class="title">
    <h1> <strong> Registration Portal for Vital Records </strong> 
    </h1>
    <p>
    Register and manage your vital records with our secure and efficient certificate services.
                <p>&copy; <span id="year"></span> CRIS. All rights reserved.</p>

    </p>
</div>

    <div class="card-container">
        <!-- Birth Certificate -->
        <div class="card" onclick="openForm('Birth Certificate')">
            <div class="card-content">
                <div class="header-with-icon">
                    <div class="icon-badge birth">
                        <i class="fas fa-baby icon-blue"></i>
                    </div>
                    <h2>Birth Certificate</h2>
                </div>
                <p>Register or request a copy of a birth certificate for official identification, school enrollment, and
                    other legal purposes.</p>
                <div class="card-footer">
                    <a href="#" class="read-more">Read More</a>
                    <span class="courier">
                        <i class="fas fa-truck icon-birth"></i> 5–7 days
                    </span>
                </div>
            </div>
        </div>

        <!-- Marriage Certificate -->
        <div class="card" onclick="openForm('Marriage Certificate')">
            <div class="card-content">
                <div class="header-with-icon">
                    <div class="icon-badge marriage">
                        <i class="fas fa-ring icon-purple"></i>
                    </div>
                    <h2>Marriage Certificate</h2>
                </div>
                <p>Register your marriage or request a copy of your marriage certificate for legal, immigration, or
                    personal purposes.</p>
                <div class="card-footer">
                    <a href="#" class="read-more">Read More</a>
                    <span class="courier">
                        <i class="fas fa-truck"></i> 5–7 days
                    </span>
                </div>
            </div>
        </div>

        <!-- Death Certificate -->
        <div class="card" onclick="openForm('Death Certificate')">
            <div class="card-content">
                <div class="header-with-icon">
                    <div class="icon-badge death">
                        <i class="fas fa-cross icon-red"></i>
                    </div>
                    <h2>Death Certificate</h2>
                </div>
                <p>Request a death certificate for legal proceedings, insurance claims, or other official purposes.</p>
                <div class="card-footer">
                    <a href="#" class="read-more">Read More</a>
                    <span class="courier">
                        <i class="fas fa-truck"></i> 5–7 days
                    </span>
                </div>
            </div>
        </div>

        <!-- Cenomar Certificate -->
        <div class="card" onclick="openForm('Cenomar Certificate')">
            <div class="card-content">
                <div class="header-with-icon">
                    <div class="icon-badge cenomar">
                        <i class="fas fa-file-medical icon-green"></i>
                    </div>
                    <h2>Cenomar Certificate</h2>
                </div>
                <p>Certificate of No Marriage Record (CENOMAR) required for marriage license applications and other
                    legal purposes.</p>
                <div class="card-footer">
                    <a href="#" class="read-more">Read More</a>
                    <span class="courier">
                        <i class="fas fa-truck"></i> 5–7 days
                    </span>
                </div>
            </div>
        </div>

        <!-- Cenodeath Certificate -->
        <div class="card" onclick="openForm('Cenodeath Certificate')">
            <div class="card-content">
                <div class="header-with-icon">
                    <div class="icon-badge cenodeath">
                        <i class="fas fa-file-medical icon-gray"></i>
                    </div>
                    <h2>Cenodeath Certificate</h2>
                </div>
                <p>Certificate of No Death Record (CENODEATH) required for legal and inheritance purposes.</p>
                <div class="card-footer">
                    <a href="#" class="read-more">Read More</a>
                    <span class="courier">
                        <i class="fas fa-truck"></i> 5–7 days
                    </span>
                </div>
            </div>
        </div>

        <!-- other Certificate -->
        <div class="card" onclick="openOtherCertificateAlert()">
            <div class="card-content">
                <div class="header-with-icon">
                    <div class="icon-badge other">
                        <i class="fas fa-question icon-yellow"></i>
                    </div>
                    <h2>Other Certificate</h2>
                </div>
                <p>Need another type of certificate or document? Contact our support team for assistance.</p>
                <div class="card-footer">
                    <a href="#" class="read-more">Contact us!</a>
                </div>
            </div>
        </div>
    </div>


    <!-- Popup -->
    <div class="popup-overlay" id="popupForm">
        <div class="popup-content">
            <span class="close-btn" id="closeFormBtn">&times;</span>
            <h2 id="formTitle">Register</h2>
            <!-- Progress Bar -->
            <ul class="progressbar" id="progressbar">
                <li class="active">Information</li>
                <li>Review</li>
            </ul>

            <form id="certificateForm" action="handle_certificate.php" method="post">
                <input type="hidden" name="certificateType" id="certificateType" />


                <!-- Step 1 -->
                <div class="form-step" data-step="0">
                    <!-- Birth Certificate Fields -->
                    <div id="birthFields" class="type-fields">
                        <div class="user">
                            <label id="info">Child's Information</label>
                            <div class="name-group">
                                <input type="text" id="birthFirstName" name="birthFirstName" placeholder="First Name" />
                                <input type="text" id="birthLastName" name="birthLastName" placeholder="Last Name" />
                                <input type="text" id="birthMiddleInitial" name="birthMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>
                            <label>Only if applicable</label>
                            <div class="suffix-container">
                                <input type="text" id="birthSuffix" name="birthSuffix" maxlength="5"
                                    placeholder="Suffix" />
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="birthDateOfBirth">Date of Birth</label>
                                    <input type="date" id="birthDateOfBirth" name="birthDateOfBirth" placeholder="Date of Birth" />
                                </div>
                                <div class="input-group">
                                    <label for="birthPlaceOfBirth">Place of Birth</label>
                                    <input type="text" id="birthPlaceOfBirth" name="birthPlaceOfBirth"
                                        placeholder="Street, Barangay, City, Province" />
                                </div>
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="birthOrientation">Sexual Orientation</label>
                                    <select name="birthOrientation" id="birthOrientation" placeholder="Sex">
                                        <option value="Select">-- Select --</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-Binary</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label for="birthNationality">Nationality</label>
                                    <select name="birthNationality" id="birthNationality" placeholder="Nationality">
                                        <option value="Select">-- Select --</option>
                                        <option value="FIlipino">Filipino</option>
                                        <option value="Foreigner">Foreigner</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="parent">
                            <label id="info">Parent's Information</label>
                            <br>
                            <br>
                            <label>Mother's Maiden Name</label>
                            <div class="name-group">
                                <input type="text" id="birthMotherMaidenName" name="birthMotherMaidenName"
                                    placeholder="Mother's First Name" />
                                <input type="text" id="birthMotherLastName" name="birthMotherLastName"
                                    placeholder="Mother's Last Name" />
                                <input type="text" id="birthMotherMiddleInitial" name="birthMotherMiddleInitial"
                                    placeholder="Mother's Middle Name" />
                            </div>

                            <label>Father's Name</label>
                            <div class="name-group">
                                <input type="text" id="FatherstName" name="birthFatherFirstName"
                                    placeholder="Father's First Name" />
                                <input type="text" id="birthFatherLastName" name="birthFatherLastName"
                                    placeholder="Father's Last Name" />
                                <input type="text" id="birthFatherMiddleInitial" name="birthFatherMiddleInitial"
                                    placeholder="Father's Middle Name" />
                            </div>

                            <label>Suffix (If any)</label>
                            <div class="suffix-container">
                                <input type="text" id="birthSuffix" name="birthFatherSuffix" maxlength="5"
                                    placeholder="Jr. Sr. III, IV" />
                            </div>
                        </div>

                        <div class="delivery-info">
                            <label id="info">Delivery Information</label><br><br>
                            <label for="deliveryAddress">Address</label><br>
                                <input type="text" id="deliveryAddress" name="birthdeliveryAddress" placeholder="Full delivery address" />
                        <br>          
                            <label for="deliveryOption">Delivery Options:</label>
                        <br>
                            <select name="birthdeliveryOption" id="deliveryOption" placeholder="Delivery Options">
                                <option value="">-- Select --</option>
                                <option value="delivery">Delivery</option>
                                <option value="pickup">Pick-up</option>
                            </select>
                        </div>



                        <label for="birthPurpose">Purpose of the certification</label><br>
                        <select name="birthPurpose" id="birthPurpose" placeholder="Purpose">
                            <option value="death_record">-- Select -- </option>
                            <option value="Proof of No Death Record">Proof of No Death Record</option>
                            <option value="Legal and Administrative Purposes">Legal and Administrative Purposes</option>
                            <option value="Demonstrating Potential Alive Status">Demonstrating Potential Alive Status
                            </option>
                            <option value="others">Others</option>
                        </select>
                        <br>
                        <br>
                        <label for="birthCopiesNeeded">Number of copies needed</label><br>
                        <div class="suffix-container">
                            <input type="number" id="birthCopiesNeeded" name="birthCopiesNeeded"
                                placeholder="Number of copies needed" />
                        </div>
                    </div>

                    <!-- Marriage Certificate Fields -->
                    <div id="marriageFields" class="type-fields">
                        <div class="user">
                            <label id="info">Couple's Information</label><br><br>

                            <label>Wife's Name</label>
                            <div class="name-group">
                                <input type="text" id="marriageWifeFirst" name="marriageWifefirst"
                                    placeholder="First Name" />
                                <input type="text" id="marriageWifeLast" name="marriageWifelast"
                                    placeholder="Last Name" />
                                <input type="text" id="marriageWifeMiddle" name="marriageWifeMiddle"
                                    placeholder="Middle Name" />
                            </div>

                            <label>Husband's Name</label>
                            <div class="name-group">
                                <input type="text" id="marriageHusbandFirst" name="marriageHusbandfirst"
                                    placeholder="First Name" />
                                <input type="text" id="marriageHusbandLast" name="marriageHusbandlast"
                                    placeholder="Last Name" />
                                <input type="text" id="marriageHusbandMiddle" name="marriageHusbandmiddle"
                                    placeholder="Middle Name" />
                            </div>

                            <label for="marriageHusbandSuffix">Suffix (if any)</label>
                            <div class="suffix-container">
                                <input type="text" id="marriageHusbandSuffix" name="marriageHusbandSuffix" maxlength="5"
                                    placeholder="Jr., Sr., III, IV" />
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="marriageDateOfMarriage">Date of Marriage</label>
                                    <input type="date" id="marriageDateOfMarriage" name="marriageDateOfMarriage" placeholder="Date of Marriage"/>
                                </div>

                                <div class="input-group">
                                    <label for="marriagePlaceOfMarriage">Place of Marriage</label>
                                    <input type="text" id="marriagePlaceOfMarriage" name="marriagePlaceOfMarriage"
                                        placeholder="Street, Barangay, City, Province" />
                                </div>
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="marriageWifeNationality">Wife's Nationality</label>
                                    <select name="marriageWifeNationality" id="marriageWifeNationality" placeholder="Wife's Nationality">
                                        <option value="">-- Select --</option>
                                        <option value="Filipino">Filipino</option>
                                        <option value="Foreigner">Foreigner</option>
                                    </select>
                                </div>

                                <div class="input-group">
                                    <label for="marriageHusbandNationality">Husband's Nationality</label>
                                    <select name="marriageHusbandNationality" id="marriageHusbandNationality" placeholder="Husband's Nationality">
                                        <option value="">-- Select --</option>
                                        <option value="Filipino">Filipino</option>
                                        <option value="Foreigner">Foreigner</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="delivery-info">
                            <label id="info">Delivery Information</label><br><br>
                            <label for="deliveryAddress">Address</label><br>
                                <input type="text" id="deliveryAddress" name="marriagedeliveryAddress" placeholder="Full delivery address" />
                        <br>          
                            <label for="deliveryOption">Delivery Options:</label>
                        <br>
                            <select name="marriagedeliveryOption" id="deliveryOption" placeholder="Delivery Option">
                                <option value="">-- Select --</option>
                                <option value="delivery">Delivery</option>
                                <option value="pickup">Pick-up</option>
                            </select>
                        </div>


                        <label for="marriagePurpose">Purpose of the certification</label><br>
                        <select name="marriagePurpose" id="marriagePurpose" placeholder="Purpose">
                            <option value="">-- Select --</option>
                            <option value="proof_no_death_record">Proof of No Death Record</option>
                            <option value="legal_and_administrative_purposes">Legal and Administrative Purposes</option>
                            <option value="demonstrating_potential_alive_status">Demonstrating Potential Alive Status
                            </option>
                            <option value="others">Others</option>
                        </select>
                        <br><br>

                        <label for="marriageCopiesNeeded">Number of copies needed</label><br>
                        <div class="suffix-container">
                            <input type="number" id="marriageCopiesNeeded" name="marriageCopiesNeeded"
                                placeholder="Number of copies needed" />
                        </div>
                    </div>


                    <!-- Death Certificate Fields -->
                    <div id="deathFields" class="type-fields">
                        <div class="user">
                            <label id="info"> Deceased Information </label><br><br>
                            <div class="name-group">
                                <input type="text" id="deathFirstName" name="deathFirstName" placeholder="First Name" />
                                <input type="text" id="deathLastName" name="deathLastName" placeholder="Last Name" />
                                <input type="text" id="deathMiddleInitial" name="deathMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>
                            <div class="suffix-container">
                                <label> Suffix (If any)</label>
                                <input type="text" id="deathSuffix" name="deathSuffix" maxlength="5"
                                    placeholder="Jr. Sr. III, IV" />
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="birthofdeath">Date of Birth</label>
                                    <input type="date" id="birthofdeath" name="birthofdeath" placeholder="Date of Birth" />
                                    <label for="deathDateOfDeath">Date of Death</label>
                                    <input type="date" id="deathDateOfDeath" name="deathDateOfDeath" placeholder="Date of Death" />
                                </div>

                                <div class="input-row">
                                    <div class="input-group">
                                        <label for="birthOrientation">Sexual Orientation</label>
                                        <select name="deathOrientation" id="birthOrientation" placeholder="Sex">
                                            <option value="Select">-- Select --</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-Binary</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label for="birthNationality">Nationality</label>
                                        <select name="deathNationality" id="birthNationality" placeholder="Nationality">
                                            <option value="Select">-- Select --</option>
                                            <option value="Filipino">Filipino</option>
                                            <option value="Foreigner">Foreigner</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--<label for="deathCompleteAddress">Place of Death</label>
                        <input type="text" id="deathCompleteAddress" name="deathCompleteAddress"
                            placeholder="(e.g. Medical Hospital)" />
                        -->
                        <div class="delivery-info">
                            <label id="info">Delivery Information</label><br><br>
                            <label for="deliveryAddress">Address</label><br>
                                <input type="text" id="deliveryAddress" name="deathdeliveryAddress" placeholder="Full delivery address" />
                        <br>          
                            <label for="deliveryOption">Delivery Options:</label>
                        <br>
                            <select name="deathdeliveryOption" id="deliveryOption" placeholder="Delivery Option">
                                <option value="">-- Select --</option>
                                <option value="delivery">Delivery</option>
                                <option value="pickup">Pick-up</option>
                            </select>
                        </div>

                        <label for="deathPurpose">Purpose of the certification</label><br>
                        <select name="deathPurpose" id="deathPurpose" placeholder="Purpose">
                            <option value="">-- Select --</option>
                            <option value="proof_no_death_record">Proof of No Death Record</option>
                            <option value="legal_and_administrative_purposes">Legal and Administrative Purposes</option>
                            <option value="demonstrating_potential_alive_status">Demonstrating Potential Alive Status
                            </option>
                            <option value="others">Others</option>
                        </select>
                        <br>
                        <br>

                        <label for="deathCopiesNeeded">Number of copies needed</label>
                        <div class="suffix-container">
                            <input type="number" id="deathCopiesNeeded" name="deathCopiesNeeded"
                                placeholder="Number of copies needed" />
                        </div>
                    </div>

                    <!-- Cenomar Certificate Fields -->
                    <div id="cenomarFields" class="type-fields">
                        <div class="user">
                            <label id="info"> Child's Information </label><br><br>
                            <label>Child's Name</label>
                            <div class="name-group">
                                <input type="text" id="cenomarChildFirstName" name="cenomarChildFirstName"
                                    placeholder="First Name" />
                                <input type="text" id="cenomarChildLastName" name="cenomarChildLastName"
                                    placeholder="Last Name" />
                                <input type="text" id="cenomarChildMiddleInitial" name="cenomarChildMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>
                            <div class="suffix-container">
                                <label> Suffix (If any)</label>
                                <input type="text" id="cenomarChildSuffix" name="cenomarChildSuffix" maxlength="5"
                                    placeholder="Jr. Sr. III" />
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="cenomarDateOfBirth">Date of Birth</label>
                                    <input type="date" id="cenomarDateOfBirth" name="cenomarDateOfBirth" placeholder="Date of Birth" />
                                </div>
                                <div class="input-group">
                                    <label for="cenomarPlaceOfBirth">Place of Birth</label>
                                    <input type="text" id="cenomarPlaceOfBirth" name="cenomarPlaceOfBirth"
                                        placeholder="Street, Barangay, City, Province" />
                                </div>
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="cenomarOrientation">Sexual Orientation</label>
                                    <select name="cenomarOrientation" id="cenomarOrientation" placeholder="Sex">
                                        <option value="Select">-- Select --</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-Binary</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label for="cenomarNationality">Nationality</label>
                                    <select name="cenomarNationality" id="cenomarNationality" placeholder="Nationality">
                                        <option value="Select">-- Select --</option>
                                        <option value="Filipino">Filipino</option>
                                        <option value="Foreigner">Foreigner</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="parent">
                            <label id="info">Parent's Information</label><br> <br>
                            <label>Mother's Maiden Name</label>
                            <div class="name-group">
                                <input type="text" id="cenomarMotherFirstName" name="cenomarMotherFirstName"
                                    placeholder="First Name" />
                                <input type="text" id="cenomarMotherLastName" name="cenomarMotherLastName"
                                    placeholder="Last Name" />
                                <input type="text" id="cenomarMotherMiddleInitial" name="cenomarMotherMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>

                            <label>Father's Name</label>
                            <div class="name-group">
                                <input type="text" id="cenomarFatherFirstName" name="cenomarFatherFirstName"
                                    placeholder="First Name" />
                                <input type="text" id="cenomarFatherLastName" name="cenomarFatherLastName"
                                    placeholder="Last Name" />
                                <input type="text" id="cenomarFatherMiddleInitial" name="cenomarFatherMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>
                            <div class="suffix-container">
                                <label> Suffix (If any)</label>
                                <input type="text" id="cenomarFatherSuffix" name="cenomarFatherSuffix" maxlength="5"
                                    placeholder="Jr. Sr. III" />
                            </div>
                        </div>

                        <div class="delivery-info">
                            <label id="info">Delivery Information</label><br><br>
                            <label for="deliveryAddress">Address</label><br>
                                <input type="text" id="deliveryAddress" name="cenomardeliveryAddress" placeholder="Full delivery address" />
                        <br>          
                            <label for="deliveryOption">Delivery Options:</label>
                        <br>
                            <select name="cenomardeliveryOption" id="deliveryOption" placeholder="Delivery Option">
                                <option value="">-- Select --</option>
                                <option value="delivery">Delivery</option>
                                <option value="pickup">Pick-up</option>
                            </select>
                        </div>

                        <!--<label for="cenomarCompleteAddress">Complete Address</label>
                        <input type="text" id="cenomarCompleteAddress" name="cenomarCompleteAddress"
                            placeholder="Complete Address" />
                        -->

                         <label for="cenomarPurpose">Purpose of the certification</label><br>
                        <select name="cenomarPurpose" id="cenomarPurpose" placeholder="Purpose">
                            <option value="">-- Select --</option>
                            <option value="proof_no_death_record">Proof of No Death Record</option>
                            <option value="legal_and_administrative_purposes">Legal and Administrative Purposes</option>
                            <option value="demonstrating_potential_alive_status">Demonstrating Potential Alive Status
                            </option>
                            <option value="others">Others</option>
                        </select> 
                        <br>
                        <br>

                        <label for="cenomarCopiesNeeded">Number of copies needed</label>
                        <div class="suffix-container">
                            <input type="number" id="cenomarCopiesNeeded" name="cenomarCopiesNeeded"
                                placeholder="Number of copies needed" />
                        </div>
                    </div>

                    <!-- Cenodeath Certificate Fields -->
                    <div id="cenodeathFields" class="type-fields">
                        <div class="user">
                            <label id="info">Deceased Information</label>
                            <div class="name-group">
                                <input type="text" id="cenodeathFirstName" name="cenodeathFirstName"
                                    placeholder="First Name" />
                                <input type="text" id="cenodeathLastName" name="cenodeathLastName"
                                    placeholder="Last Name" />
                                <input type="text" id="cenodeathMiddleInitial" name="cenodeathMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>
                            <div class="suffix-container">
                                <label> Suffix (If any)</label>
                                <input type="text" id="cenodeathSuffix" name="cenodeathSuffix" maxlength="5"
                                    placeholder="Jr. Sr. III" />
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="cenodeathDateOfBirth">Date of Birth</label>
                                    <input type="date" id="cenodeathDateOfBirth" name="cenodeathDateOfBirth" placeholder="Date of Birth"/>
                                </div>
                                <div class="input-group">
                                    <label for="cenodeathPlaceOfBirth">Place of Birth</label>
                                    <input type="text" id="cenodeathPlaceOfBirth" name="cenodeathPlaceOfBirth"
                                        placeholder="Street, Barangay, City, Province" />
                                </div>
                            </div>

                            <div class="input-row">
                                <div class="input-group">
                                    <label for="cenodeathOrientation">Sexual Orientation</label>
                                    <select name="cenodeathOrientation" id="cenodeathOrientation" placeholder="Sex">
                                        <option value="Select">-- Select --</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-Binary</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label for="cenodeathNationality">Nationality</label>
                                    <select name="cenodeathNationality" id="cenodeathNationality" placeholder="Nationality">
                                        <option value="Select">-- Select --</option>
                                        <option value="Filipino">Filipino</option>
                                        <option value="Foreigner">Foreigner</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="parent">
                            <label id="info">Parent's Information</label>
                            <br>
                            <br>
                            <label>Mother's Maiden Name</label>
                            <div class="name-group">
                                <input type="text" id="cenodeathMotherFirstName" name="cenodeathMotherFirstName"
                                    placeholder="First Name" />
                                <input type="text" id="cenodeathMotherLastName" name="cenodeathMotherLastName"
                                    placeholder="Last Name" />
                                <input type="text" id="cenodeathMotherMiddleInitial" name="cenodeathMotherMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>

                            <label>Father's Name</label>
                            <div class="name-group">
                                <input type="text" id="cenodeathFatherFirstName" name="cenodeathFatherFirstName"
                                    placeholder="First Name" />
                                <input type="text" id="cenodeathFatherLastName" name="cenodeathFatherLastName"
                                    placeholder="Last Name" />
                                <input type="text" id="cenodeathFatherMiddleInitial" name="cenodeathFatherMiddleInitial"
                                    placeholder="Middle Name" />
                            </div>
                            <div class="suffix-container">
                                <label> Suffix (If any)</label>
                                <input type="text" id="cenodeathFatherSuffix" name="cenodeathFatherSuffix" maxlength="5"
                                    placeholder="Jr. Sr. III" />
                            </div>
                        </div>

                        <div class="delivery-info">
                            <label id="info">Delivery Information</label><br><br>
                            <label for="deliveryAddress">Address</label><br>
                                <input type="text" id="deliveryAddress" name="cenodeathdeliveryAddress" placeholder="Full delivery address" />
                        <br>          
                            <label for="deliveryOption">Delivery Options:</label>
                        <br>
                            <select name="cenodeathdeliveryOption" id="deliveryOption" placeholder="Delivery Option">
                                <option value="">-- Select --</option>
                                <option value="delivery">Delivery</option>
                                <option value="pickup">Pick-up</option>
                            </select>
                        </div>

                        <!--<label for="cenodeathCompleteAddress">Complete Address</label>
                        <input type="text" id="cenodeathCompleteAddress" name="cenodeathCompleteAddress"
                            placeholder="Complete Address" />
                        -->

                        <label for="cenodeathPurpose">Purpose of the certification</label>
                        <select name="cenodeathPurpose" id="cenodeathPurpose" placeholder="Purpose">
                            <option value="">-- Select --</option>
                            <option value="proof_no_death_record">Proof of No Death Record</option>
                            <option value="legal_and_administrative_purposes">Legal and Administrative Purposes</option>
                            <option value="demonstrating_potential_alive_status">Demonstrating Potential Alive Status
                            </option>
                            <option value="others">Others</option>
                        </select>

                        <label for="cenodeathCopiesNeeded">Number of copies needed</label>
                        <div class="suffix-container">
                            <input type="number" id="cenodeathCopiesNeeded" name="cenodeathCopiesNeeded"
                                placeholder="Number of copies needed" />
                        </div>
                    </div>
                    <button type="button" id="nextBtn" onclick="changeStep(1)">Next</button>

                </div>

                <!-- Step 2: Review -->
                <div class="form-step" data-step="1">
                    <h3>Review Your Information</h3>
                    <p>Please verify all your data before submitting.</p>
                    <div id="reviewSummary" class="review-summary"></div>
                    <button type="button" id="prevBtn">Previous</button>
                    <button type="button" id="downloadBtn">Download PDF</button>
                    <button type="submit" id="submitBtn">Submit</button>
                </div>
        </div>
        </form>
    </div>
    </div>

    <div class="table-container">
        <div class="table-header">
            <h2 class="table-title">Registered Certificates</h2>
        </div>
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID Number</th>
                        <th>UserName</th>
                        <th>Certificate Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="registrationTableBody">
                    <?php
                    if ($result_full && $result_full->num_rows > 0) {
                        while ($row = $result_full->fetch_assoc()) {
                            echo "<tr>
                    <td>" . htmlspecialchars($row['reg_id']) . "</td>
                    <td>" . htmlspecialchars($row['username']) . "</td>
                    <td>" . htmlspecialchars($row['certif_type']) . "</td>
                    <td>" . htmlspecialchars($row['status']) . "</td>
                    </tr>";
                        }
                    } else {
                        echo "<tr><td colspan='4'>No registrations found.</td></tr>";
                    }
                    ?>
                </tbody>
            </table>

        </div>
    </div>

<div id="pdfTemplate">
  <div class="pdf-body">
    <h2>Certificate Registration Summary</h2>
    <p style="font-size: 18px;"><strong>CERTIFICATE TYPE: </strong> <span id="pdfCertType"></span></p>
    <div id="pdfDetails"></div>
  </div>
  <p class="pdf-note">* This is a system-generated summary. Please keep it for your records.</p>
</div>

    <script src="Certificate.js"> </script>
</body>

</html>