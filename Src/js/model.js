function showModel(Header,Body,isTouchClosing){
// Get the modal
var model = document.getElementById('modelDialog');
var modelContent = document.getElementsByClassName('model-content')[0];

modelContent.getElementsByClassName('model-header')[0].innerHTML = Header;

modelContent.getElementsByClassName('model-body')[0]
.innerHTML = Body;
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("model-close")[0];

model.style.display = "block";


if(isTouchClosing){
    // When the user clicks on <span> (x), close the model
    span.onclick = function() {
    model.style.display = "none";
}

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == model) {
            model.style.display = "none";
        }
    }
}
}

function closeModel(){
    var model = document.getElementById('modelDialog');
    model.style.display = "none";
}

function showSpinModel(){
var spinerModel = document.getElementById('spinerDialog');
spinerModel.style.display = "block";
}
function hideSpinModel(){
    document.getElementById('spinerDialog').style.display = "none";
}