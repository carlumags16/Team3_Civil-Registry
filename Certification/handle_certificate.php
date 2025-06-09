<?php
session_start();
include "../connect.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo "User not logged in.";
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $certificateType = $_POST['certificateType'] ?? '';

    if ($certificateType === 'Birth Certificate') {
        $birthFirstName = $_POST['birthFirstName'] ?? '';
        $birthLastName = $_POST['birthLastName'] ?? '';
        $birthMiddleInitial = $_POST['birthMiddleInitial'] ?? '';
        $birthSuffix = $_POST['birthSuffix'] ?? '';
        $birthDateOfBirth = $_POST['birthDateOfBirth'] ?? '';
        $birthPlaceOfBirth = $_POST['birthPlaceOfBirth'] ?? '';
        $birthOrientation = $_POST['birthOrientation'] ?? '';
        $birthNationality = $_POST['birthNationality'] ?? '';

        $birthMotherMaidenName = $_POST['birthMotherMaidenName'] ?? '';
        $birthMotherLastName = $_POST['birthMotherLastName'] ?? '';
        $birthMotherMiddleInitial = $_POST['birthMotherMiddleInitial'] ?? '';

        $birthFatherFirstName = $_POST['birthFatherFirstName'] ?? '';
        $birthFatherLastName = $_POST['birthFatherLastName'] ?? '';
        $birthFatherMiddleInitial = $_POST['birthFatherMiddleInitial'] ?? '';
        $birthFatherSuffix = $_POST['birthFatherSuffix'] ?? '';

        $address = $_POST['birthdeliveryAddress'] ?? '';
        $address_option = $_POST['birthdeliveryOption'] ?? '';
        $birthPurpose = $_POST['birthPurpose'] ?? '';
        $birthCopiesNeeded = (int)($_POST['birthCopiesNeeded'] ?? 0);

        $sql = "INSERT INTO birth_certi (
            user_id,
            child_firstname, child_middlename, child_lastname, child_suffix,
            child_date_birth, child_place_birth, sexual_orientation, nationality,
            mother_maiden_firstname, mother_maiden_middlename, mother_maiden_lastname,
            father_firstname, father_middlename, father_lastname, father_suffix,
            address, address_option, purpose_certi, number_copies, created_at
        ) VALUES (
            ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, NOW()
        )";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo "Failed to prepare statement: " . $conn->error;
            exit;
        }

        $stmt->bind_param(
            "issssssssssssssssssi",
            $user_id,
            $birthFirstName,
            $birthMiddleInitial,
            $birthLastName,
            $birthSuffix,
            $birthDateOfBirth,
            $birthPlaceOfBirth,
            $birthOrientation,
            $birthNationality,
            $birthMotherMaidenName,
            $birthMotherMiddleInitial,
            $birthMotherLastName,
            $birthFatherFirstName,
            $birthFatherMiddleInitial,
            $birthFatherLastName,
            $birthFatherSuffix,
            $address,
            $address_option,
            $birthPurpose,
            $birthCopiesNeeded
        );

        $stmt->execute();
        $cert_id = $conn->insert_id;
        $message_cert = "Birth certificate";
    } elseif ($certificateType === 'Marriage Certificate') {
        $wife_firstname = $_POST['marriageWifefirst'] ?? '';
        $wife_middlename = $_POST['marriageWifeMiddle'] ?? '';
        $wife_lastname = $_POST['marriageWifelast'] ?? '';

        $husband_firstname = $_POST['marriageHusbandfirst'] ?? '';
        $husband_middlename = $_POST['marriageHusbandmiddle'] ?? '';
        $husband_lastname = $_POST['marriageHusbandlast'] ?? '';
        $husband_suffix = $_POST['marriageHusbandSuffix'] ?? '';

        $date_of_marriage = $_POST['marriageDateOfMarriage'] ?? '';
        $place_of_marriage = $_POST['marriagePlaceOfMarriage'] ?? '';

        $wife_nationality = $_POST['marriageWifeNationality'] ?? '';
        $husband_nationality = $_POST['marriageHusbandNationality'] ?? '';

        $address = $_POST['marriagedeliveryAddress'] ?? '';
        $address_option = $_POST['marriagedeliveryOption'] ?? '';
        $purpose_certi = $_POST['marriagePurpose'] ?? '';
        $number_copies = (int)($_POST['marriageCopiesNeeded'] ?? 0);

        $sql = "INSERT INTO marriage_certi (
        user_id,
        wife_firstname, wife_middle_name, wife_lastname,
        husband_firstname, husband_middle_name, husband_lastname, husband_suffix,
        date_marriage, place_marriage,
        wife_nationality, husband_nationality,
        address, address_option, purpose_certi, number_copies, created_at
    ) VALUES (
        ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?, ?, ?, NOW()
    )";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "issssssssssssssi",
            $user_id,
            $wife_firstname,
            $wife_middlename,
            $wife_lastname,
            $husband_firstname,
            $husband_middlename,
            $husband_lastname,
            $husband_suffix,
            $date_of_marriage,
            $place_of_marriage,
            $wife_nationality,
            $husband_nationality,
            $address,
            $address_option,
            $purpose_certi,
            $number_copies
        );

        $stmt->execute();
        $cert_id = $conn->insert_id;
        $message_cert = "Marriage certificate";
    } elseif ($certificateType === 'Death Certificate') {
        $dead_firstname = $_POST['deathFirstName'] ?? '';
        $dead_middlename = $_POST['deathMiddleInitial'] ?? '';
        $dead_lastname = $_POST['deathLastName'] ?? '';
        $dead_suffix = $_POST['deathSuffix'] ?? '';
        $date_birth = $_POST['birthofdeath'] ?? '';
        $date_death = $_POST['deathDateOfDeath'] ?? '';
        $sexual_orientation = $_POST['deathOrientation'] ?? '';
        $nationality = $_POST['deathNationality'] ?? '';
        $place_death = $_POST['deathCompleteAddress'] ?? '';
        $address = $_POST['deathdeliveryAddress'] ?? '';
        $address_option = $_POST['deathdeliveryOption'] ?? '';
        $purpose_certi = $_POST['deathPurpose'] ?? '';
        $number_copies = (int)($_POST['deathCopiesNeeded'] ?? 0);

        $sql = "INSERT INTO death_certi (
            user_id,
            dead_firstname, dead_middlename, dead_lastname, dead_suffix,
            date_birth, date_death, sexual_orientation, nationality, place_death,
            address, address_option, purpose_certi, number_copies, created_at
        ) VALUES (
            ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, NOW()
        )";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "issssssssssssi",
            $user_id,
            $dead_firstname,
            $dead_middlename,
            $dead_lastname,
            $dead_suffix,
            $date_birth,
            $date_death,
            $sexual_orientation,
            $nationality,
            $place_death,
            $address,
            $address_option,
            $purpose_certi,
            $number_copies
        );
        $stmt->execute();

        $cert_id = $conn->insert_id;
        $message_cert = "Death certificate";
    } elseif ($certificateType === 'Cenomar Certificate') {
        $child_firstname = $_POST['cenomarChildFirstName'] ?? '';
        $child_middlename = $_POST['cenomarChildMiddleInitial'] ?? '';
        $child_lastname = $_POST['cenomarChildLastName'] ?? '';
        $child_suffix = $_POST['cenomarChildSuffix'] ?? '';
        $date_birth = $_POST['cenomarDateOfBirth'] ?? '';
        $place_birth = $_POST['cenomarPlaceOfBirth'] ?? '';
        $sexual_orientation = $_POST['cenomarOrientation'] ?? '';
        $child_nationality = $_POST['cenomarNationality'] ?? '';

        $mother_firstname = $_POST['cenomarMotherFirstName'] ?? '';
        $mother_middlename = $_POST['cenomarMotherMiddleInitial'] ?? '';
        $mother_lastname = $_POST['cenomarMotherLastName'] ?? '';

        $father_firstname = $_POST['cenomarFatherFirstName'] ?? '';
        $father_middlename = $_POST['cenomarFatherMiddleInitial'] ?? '';
        $father_lastname = $_POST['cenomarFatherLastName'] ?? '';
        $father_suffix = $_POST['cenomarFatherSuffix'] ?? '';

        $address = $_POST['cenomardeliveryAddress'] ?? '';
        $address_option = $_POST['cenomardeliveryOption'] ?? '';
        $purpose_certi = $_POST['cenomarPurpose'] ?? '';
        $number_copies = (int)($_POST['cenomarCopiesNeeded'] ?? 0);

        $sql = "INSERT INTO cenomar_certi (
        user_id,
        child_firstname, child_middlename, child_lastname, child_suffix,
        date_birth, place_birth, sexual_orientation, nationality,
        mother_maiden_firstname, mother_maiden_middlename, mother_maiden_lastname,
        father_firstname, father_middlename, father_lastname, father_suffix,
        address, address_option, purpose_certi, number_copies, created_at
    ) VALUES (
        ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, NOW()
    )";

        $stmt = $conn->prepare($sql);

        $stmt->bind_param(
            "issssssssssssssssssi",
            $user_id,
            $child_firstname,
            $child_middlename,
            $child_lastname,
            $child_suffix,
            $date_birth,
            $place_birth,
            $sexual_orientation,
            $child_nationality,
            $mother_firstname,
            $mother_middlename,
            $mother_lastname,
            $father_firstname,
            $father_middlename,
            $father_lastname,
            $father_suffix,
            $address,
            $address_option,
            $purpose_certi,
            $number_copies
        );

        $stmt->execute();

        $cert_id = $conn->insert_id;
        $message_cert = "Cenomar certificate";
    } elseif ($certificateType === 'Cenodeath Certificate') {
        $deceased_firstname = $_POST['cenodeathFirstName'] ?? '';
        $deceased_middlename = $_POST['cenodeathMiddleInitial'] ?? '';
        $deceased_lastname = $_POST['cenodeathLastName'] ?? '';
        $deceased_suffix = $_POST['cenodeathSuffix'] ?? '';
        $date_birth = $_POST['cenodeathDateOfBirth'] ?? '';
        $place_birth = $_POST['cenodeathPlaceOfBirth'] ?? '';
        $sexual_orientation = $_POST['cenodeathOrientation'] ?? '';
        $nationality = $_POST['cenodeathNationality'] ?? '';

        $mother_firstname = $_POST['cenodeathMotherFirstName'] ?? '';
        $mother_middlename = $_POST['cenodeathMotherMiddleInitial'] ?? '';
        $mother_lastname = $_POST['cenodeathMotherLastName'] ?? '';

        $father_firstname = $_POST['cenodeathFatherFirstName'] ?? '';
        $father_middlename = $_POST['cenodeathFatherMiddleInitial'] ?? '';
        $father_lastname = $_POST['cenodeathFatherLastName'] ?? '';
        $father_suffix = $_POST['cenodeathFatherSuffix'] ?? '';

        $address = $_POST['cenodeathdeliveryAddress'] ?? '';
        $address_option = $_POST['cenodeathdeliveryOption'] ?? '';
        $purpose_certi = $_POST['cenodeathPurpose'] ?? '';
        $number_copies = (int)($_POST['cenodeathCopiesNeeded'] ?? 0);

        $sql = "INSERT INTO cenodeath_certi (
            user_id,
            deceased_firstname, deceased_middlename, deceased_lastname, deceased_suffix,
            sexual_orientation, nationality,
            mother_firstname, mother_middlename, mother_lastname,
            father_firstname, father_middlename, father_lastname, father_suffix,
            date_birth, place_birth, address, address_option, purpose_cert, number_copies, created_at
        ) VALUES (
            ?,
            ?, ?, ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?,
            NOW()
        )";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "isssssssssssssssssis",
            $user_id,
            $deceased_firstname,
            $deceased_middlename,
            $deceased_lastname,
            $deceased_suffix,
            $sexual_orientation,
            $nationality,
            $mother_firstname,
            $mother_middlename,
            $mother_lastname,
            $father_firstname,
            $father_middlename,
            $father_lastname,
            $father_suffix,
            $date_birth,
            $place_birth,
            $address,
            $address_option,
            $purpose_certi,
            $number_copies
        );


        $stmt->execute();

        $cert_id = $conn->insert_id;
        $message_cert = "Cenodeath certificate";
    } else {
        http_response_code(400);
        echo "Invalid certificate type.";
    }

    // Get latest reg_id
    $lastRegIdSql = "SELECT reg_id FROM document ORDER BY CAST(SUBSTRING(reg_id, 5) AS UNSIGNED) DESC LIMIT 1";
    $result = $conn->query($lastRegIdSql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $lastRegId = $row['reg_id'];
        $num = intval(substr($lastRegId, 4));
        $nextNum = $num + 1;
    } else {
        $nextNum = 1;
    }

    $newRegId = 'REG-' . str_pad($nextNum, 5, '0', STR_PAD_LEFT);

    $doc_sql = "INSERT INTO document (reg_id, user_id, cert_id, certif_type, status) VALUES (?, ?, ?, ?, 'PENDING')";
    $document_stmt = $conn->prepare($doc_sql);

    if (!$document_stmt) {
        http_response_code(500);
        echo "Failed to prepare document statement: " . $conn->error;
        exit;
    }

    $document_stmt->bind_param("siss", $newRegId, $user_id, $cert_id, $certificateType);

    if ($document_stmt->execute()) {
        echo $message_cert . " submitted successfully with registration ID: $newRegId.";
    } else {
        http_response_code(500);
        echo "Error executing document insert: " . $document_stmt->error;
    }

    $stmt->close();
    $document_stmt->close();
    $conn->close();
}
