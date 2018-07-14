function openDropdown() {
    if (ddstate == 0) {
        document.getElementById("myDropdown").style.display = "inline-block";
        document.getElementById("dropbtn").style.backgroundImage = "url('arrow_up.png')";
        document.getElementById("dropbtn").style.borderColor = "#cccccc";
        ddstate = 1;
    } else {
        document.getElementById("myDropdown").style.display = "none";
        document.getElementById("dropbtn").style.backgroundImage = "url('arrow_down.png')";
        document.getElementById("dropbtn").style.borderColor = "#ededed";
        ddstate = 0;
    }
}

function femaleClicked(){
    this.gender = 1;
    updateGender();
    openDropdown();
}

function maleClicked(){
    this.gender = 2;
    updateGender();
    openDropdown();
}

function nothingClicked(){
    this.gender = 0;
    updateGender();
    openDropdown();
}