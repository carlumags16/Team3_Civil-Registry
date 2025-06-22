document.addEventListener('DOMContentLoaded',function(){
  const username=sessionStorage.getItem('adminUsername');
  const role=sessionStorage.getItem('adminRole');

  const nameDisplay=document.getElementById('adminUsername');
  if(username&&nameDisplay)nameDisplay.textContent=username;

  const roleDisplay=document.getElementById('adminRole');

  if(role&&roleDisplay)roleDisplay.textContent=role;

  const menuItems=document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item=>{
    const requiredRole=item.getAttribute('data-role');
    if(requiredRole&&requiredRole!==currentRole){
      item.style.display='none';
    }
  });
});
