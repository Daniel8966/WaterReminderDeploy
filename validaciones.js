function changePassword() {
    let pass1=document.getElementById('pass1').value;
    let pass2=document.getElementById('pass2').value;

    if (pass1===pass2) {
        return true
    }else{
        alert('Wrong Paswword')
        return false
        
    }
}