document.addEventListener('DOMContentLoaded', function () {
const adminUser = sessionStorage.getItem('adminUsername');
const adminRole = sessionStorage.getItem('adminRole') || 'Guest';

if (adminUser && adminRole) {
  const infoBox = document.getElementById('adminInfo');
  if (infoBox) {
    infoBox.textContent = `${adminUser} (${adminRole})`;
  }
}

document.querySelectorAll('.menu-item').forEach(item => {
  const role = item.dataset.role;
  const visibleTo = item.dataset.visibleTo;

  if (adminRole === 'Super Admin') {
    item.style.display = 'block';
  } else if (visibleTo === 'all') {
    item.style.display = 'block';
  } else if (role === adminRole) {
    item.style.display = 'block';
  } else {
    item.style.display = 'none';
  }
});

const exportBtn = document.getElementById("exportBtn");
if (exportBtn) {
  exportBtn.addEventListener("click", function () {
    const content = document.getElementById("printArea").innerHTML;
    const printWindow = window.open("", "", "height=800,width=1000");

    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  });
}

const exportExcelBtn = document.getElementById('exportExcelBtn');
if (exportExcelBtn) {
  exportExcelBtn.addEventListener('click', function () {
    var table = document.querySelector('table'); 
    var workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, 'Transactions.xlsx');
  });
}

});

function logout() {
  sessionStorage.clear();
  window.location.href = '../AdminPortal/AdminLogin.html';
}


