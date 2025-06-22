 document.addEventListener('DOMContentLoaded', function() {
const username = sessionStorage.getItem('adminUsername');
  const role = sessionStorage.getItem('adminRole');

  const nameDisplay = document.getElementById('adminUsername');
  if (username && nameDisplay) nameDisplay.textContent = username;

  const roleDisplay = document.getElementById('adminRole');
  if (role && roleDisplay) roleDisplay.textContent = role;
 });

function openModal() {
            document.getElementById('inspectionModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('inspectionModal').style.display = 'none';
        }

        function verifyDocument() {
            alert('Document marked as verified! It will now proceed to the Signature module.');
            closeModal();
            // In a real application, you would update the status in the database and refresh the table
        }

        function logout() {
            // Logout functionality
            alert('You have been logged out.');
            // In a real application, this would redirect to the login page
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('inspectionModal');
            if (event.target == modal) {
                closeModal();
            }
        }
