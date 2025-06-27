<?php
include '../connect.php';

$id = $_GET['id'] ?? 0;
$type = $_GET['type'] ?? '';

// Map URL types to table names
$tableMap = [
    'birth' => 'birth_certi',
    'death' => 'death_certi',
    'marriage' => 'marriage_certi',
    'cenomar' => 'cenomar_certi',
    'cenodeath' => 'cenodeath_certi'
];

$table = $tableMap[$type] ?? '';
$certificate = null;

if ($table && $id) {
    $stmt = $conn->prepare("SELECT * FROM $table WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $certificate = $result->fetch_assoc();
}
?>
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Certificate #<?= htmlspecialchars($id) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body, html {
            height: 100%;
            font-family: 'Times New Roman', serif;
        }
        .certificate-container {
            max-width: 8.5in;
            margin: 0 auto;
            position: relative;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .watermark {
            position: absolute;
            opacity: 0.1;
            font-size: 8rem;
            width: 100%;
            text-align: center;
            z-index: 1;
            top: 30%;
            transform: rotate(-30deg);
            pointer-events: none;
        }
        .content {
            position: relative;
            z-index: 2;
        }
        .header {
            padding: 2rem;
            text-align: center;
            border-bottom: 2px solid #000;
        }
        .header h1 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            letter-spacing: 1px;
        }
        .header p {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        .certificate-body {
            padding: 2rem;
            position: relative;
        }
        .field-group {
            display: flex;
            margin-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.5rem;
        }
        .field-label {
            font-weight: bold;
            min-width: 200px;
            padding-right: 1rem;
        }
        .field-value {
            flex: 1;
        }
        .signature-section {
            margin-top: 3rem;
            display: flex;
            justify-content: space-between;
        }
        .signature {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-top: 1px solid #000;
            margin: 40px 0 5px;
        }
        .action-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
        }
</head>
<body class="bg-gray-100 h-full p-4">
    <div class="certificate-container">
        <div class="watermark">
            <i class="fas fa-certificate"></i>
        </div>
        <div class="content">
            <!-- Header -->
            <div class="header">
                <h1>REPUBLIC OF THE PHILIPPINES</h1>
                <p>MUNICIPAL CIVIL REGISTRY</p>
                <p>MUNICIPALITY OF TAYTAY</p>
                <p>PROVINCE OF PALAWAN</p>
                <h2 class="mt-4 font-bold text-xl">CERTIFICATE OF LIVE BIRTH</h2>
            </div>
            
            <!-- Certificate Content -->
            <div class="certificate-body">
                <?php if ($certificate): ?>
                    <div class="mb-8">
                        <div class="field-group">
                            <div class="field-label">CHILD'S NAME:</div>
                            <div class="field-value"><?= htmlspecialchars($certificate['child_first_name'] ?? '') ?> 
                            <?= htmlspecialchars($certificate['child_middle_name'] ?? '') ?> 
                            <?= htmlspecialchars($certificate['child_last_name'] ?? '') ?></div>
                        </div>
                        
                        <div class="field-group">
                            <div class="field-label">DATE OF BIRTH:</div>
                            <div class="field-value">
                                <?= isset($certificate['date_of_birth']) ? date('F j, Y', strtotime($certificate['date_of_birth'])) : '' ?>
                            </div>
                        </div>
                        
                        <div class="field-group">
                            <div class="field-label">PLACE OF BIRTH:</div>
                            <div class="field-value"><?= htmlspecialchars($certificate['place_of_birth'] ?? '') ?></div>
                        </div>
                        
                        <div class="field-group">
                            <div class="field-label">SEX:</div>
                            <div class="field-value"><?= htmlspecialchars($certificate['sex'] ?? '') ?></div>
                        </div>
                        
                        <div class="field-group">
                            <div class="field-label">FATHER'S NAME:</div>
                            <div class="field-value">
                                <?= htmlspecialchars($certificate['father_first_name'] ?? '') ?> 
                                <?= htmlspecialchars($certificate['father_middle_name'] ?? '') ?> 
                                <?= htmlspecialchars($certificate['father_last_name'] ?? '') ?>
                            </div>
                        </div>
                        
                        <div class="field-group">
                            <div class="field-label">MOTHER'S NAME:</div>
                            <div class="field-value">
                                <?= htmlspecialchars($certificate['mother_first_name'] ?? '') ?> 
                                <?= htmlspecialchars($certificate['mother_middle_name'] ?? '') ?> 
                                <?= htmlspecialchars($certificate['mother_last_name'] ?? '') ?>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Signature Section -->
                    <div class="signature-section">
                        <div class="signature">
                            <div class="signature-line"></div>
                            <p>Signature of Applicant</p>
                        </div>
                        <div class="signature">
                            <div class="signature-line"></div>
                            <p>Municipal Civil Registrar</p>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                            <i class="fas fa-print mr-2"></i>Print
                        </button>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            <i class="fas fa-download mr-2"></i>Download
                        </button>
                        <a href="AdminDashboard.html" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 inline-flex items-center">
                            <i class="fas fa-times mr-2"></i>Close
                        </a>
                    </div>
                    
                <?php else: ?>
                    <div class="text-center py-12">
                        <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Certificate not found or no longer available.</p>
                        <a href="AdminDashboard.html" class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Return to Dashboard
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
            </div>
        </div>
    </div>
</body>
</html>
