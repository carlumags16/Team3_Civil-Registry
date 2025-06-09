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
        }
        .certificate-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .field-group {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 1rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .field-label {
            font-weight: 500;
            color: #6b7280;
            text-transform: capitalize;
        }
        .field-value {
            color: #1f2937;
        }
        @media (max-width: 640px) {
            .field-group {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body class="bg-gray-100 h-full">
    <div class="min-h-full flex items-center justify-center p-4">
        <div class="certificate-container w-full">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- Header -->
                <div class="bg-blue-600 text-white p-6">
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold">
                            <i class="fas fa-file-certificate mr-2"></i>
                            Certificate Details
                        </h1>
                        <a href="AdminDashboard.html" class="text-white hover:text-blue-200 flex items-center">
                            <i class="fas fa-arrow-left mr-1"></i> Back
                        </a>
                    </div>
                    <div class="mt-2 flex items-center text-blue-100">
                        <span class="bg-blue-500 px-2 py-1 rounded text-xs font-medium">
                            <?= strtoupper(htmlspecialchars($type)) ?> CERTIFICATE
                        </span>
                        <?php if (isset($certificate['status'])): ?>
                            <span class="ml-3 px-2 py-1 rounded text-xs font-medium 
                                      <?= $certificate['status'] === 'Approved' ? 'bg-green-100 text-green-800' : 
                                         ($certificate['status'] === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                         'bg-yellow-100 text-yellow-800') ?>">
                                <?= htmlspecialchars($certificate['status']) ?>
                            </span>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Certificate Content -->
                <div class="p-6">
                    <?php if ($certificate): ?>
                        <div class="space-y-1">
                            <?php 
                            // Skip these fields from display
                            $skipFields = ['id', 'user_id', 'status', 'created_at'];
                            
                            foreach ($certificate as $key => $value): 
                                if (in_array($key, $skipFields) || $value === null || $value === '') continue;
                                
                                // Format the key for display
                                $displayKey = ucwords(str_replace('_', ' ', $key));
                                $displayValue = is_string($value) ? htmlspecialchars($value) : $value;
                                ?>
                                <div class="field-group">
                                    <div class="field-label"><?= $displayKey ?></div>
                                    <div class="field-value"><?= $displayValue ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <!-- Timestamp -->
                        <?php if (isset($certificate['created_at'])): ?>
                            <div class="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                                <p>Created on: <?= date('F j, Y, g:i a', strtotime($certificate['created_at'])) ?></p>
                            </div>
                        <?php endif; ?>
                        
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
                
                <!-- Footer -->
                <div class="bg-gray-50 px-6 py-4 flex justify-end">
                    <a href="AdminDashboard.html" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Close
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
