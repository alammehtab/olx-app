//shortcuts to some important elements
var dropDownAdCategory = document.querySelector("#Adcategory");
var categoryChildsContainer = document.querySelector("#categoryChilds");
var dropDownAdProvince = document.querySelector("#provinceOption");
var dropDownAdCity = document.querySelector("#cityOption");
var textBoxname = document
  .getElementById("contactInfo")
  .getElementsByClassName("name")[0];
var db = firebase.database();
var userEmail = "";
//check if the any user if logged in than set the user email
(() => {
  const user = localStorage["authUser"]
    ? JSON.parse(localStorage["authUser"])
    : null;
  if (user) {
    textBoxname.value = user.name;
    userEmail = user.email;
  }
})();

//adding change event to combo box category
dropDownAdCategory.addEventListener("change", event => {
  if (dropDownAdCategory.selectedIndex > 0) {
    filterAdCategory(
      dropDownAdCategory.options[dropDownAdCategory.selectedIndex].value
    );
  } else {
    categoryChildsContainer.style.display = "none";
  }
});

//adding change event to combo box province
dropDownAdProvince.addEventListener("change", event => {
  if (dropDownAdProvince.selectedIndex > 0) {
    filterCity(
      dropDownAdProvince.options[dropDownAdProvince.selectedIndex].value
    );
  } else {
    dropDownAdCity.innerHTML = `<option>Select city</option>`;
  }
});

//method to filter the selected category from combo box and will
// display new form elements according to that
function filterAdCategory(selectedValue) {
  switch (selectedValue) {
    case "Property for Sale": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
              <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
              <span class="form-validate validate-img text-red">
                <img src="./Assets/Images/Warning.png" alt="alert">
              </span>
              <p class="form-validate validate-text text-red">Please enter price of item</p>
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description include the brand, Area, bedrooms, floor level etc, to make this ad responsive..." class="text-box form-element"></textarea></div>`;
      break;
    }

    case "Property for Rent": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description include the brand, Area, bedrooms, floor level etc, to make this ad responsive..." class="text-box form-element" ></textarea></div>`;
      break;
    }

    case "Vehicles": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price</p>
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p> 
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description include the brand, model, registeration, used etc, to make this ad responsive..." class="text-box form-element"></textarea></div>`;
      break;
    }

    case "Bikes": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p>      
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description include the brand, model, registeration, used etc, to make this ad responsive..." class="text-box form-element" ></textarea></div>`;
      break;
    }

    case "Electronics & Home Appliances": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description include the brand, model or anything speciacl etc, to make this ad responsive..." class="text-box form-element" ></textarea></div>`;
      break;
    }

    case "Mobiles": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description include the brand, model etc, to make this ad responsive..." class="text-box form-element" ></textarea></div>`;
      break;
    }

    case "Jobs": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
                <div style="margin-bottom:20px;" class="form-controls">
                    <label class="custom-control-container">Seeking
                        <input type="radio" checked="checked" name="radio" id="Seeking" class="form-element">
                        <span class="checkmark"></span>
                    </label>
                    <label class="custom-control-container">Offering
                        <input type="radio" name="radio" id="Offering" class="form-element">
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div class="form-controls"><textarea name="catDescription" placeholder="Description about the job, seeking/offering, salary etc.." class="text-box form-element" ></textarea>
                </div>`;
      break;
    }

    case "Bussiness, Industrial & Agriculture": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price of item..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description about the item.." class="text-box form-element" ></textarea>
            </div>`;
      break;
    }

    case "Furniture & Home Decor": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description.." class="text-box form-element" ></textarea>
            </div>`;
      break;
    }

    case "Animals": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
                <div class="form-controls"><textarea name="catDescription" placeholder="Description.." class="text-box form-element" ></textarea>
                </div>`;
      break;
    }

    case "Books, Sports & Hobbies": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please condition price of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" placeholder="Description.." class="text-box form-element" ></textarea>
            </div>`;
      break;
    }

    case "Fashion & Beauty": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" id="" placeholder="Description.." class="text-box form-element" ></textarea>
            </div>`;
      break;
    }

    case "Kids": {
      categoryChildsContainer.style.display = "block";
      categoryChildsContainer.innerHTML = `
            <div class="form-controls">
            <input type="text" name="price_amount" class="text-box form-element not-validated" placeholder="Price..." onkeydown="return filterNumbers(event)" onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter price of item</p>            
            </div>
            <div class="form-controls">
            <input type="text" name="condition" class="text-box form-element not-validated" placeholder="Conditon..." onblur="filterInput(this)">
            <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
            </span>
            <p class="form-validate validate-text text-red">Please enter condition of item</p>            
            </div>
            <div class="form-controls"><textarea name="catDescription" id="" placeholder="Description.." class="text-box form-element" ></textarea>
            </div>`;
      break;
    }
  }
}

//method to filter the cities available in the selected province
// and than bind into city combo box
function filterCity(province) {
  switch (province) {
    case "Azad Kashmir": {
      dropDownAdCity.innerHTML = `
                <option>Select city</option>
                <option>Bagh</option>
                <option>Bhimber</option>
                <option>Mirpur</option>
                <option>Muzaffarabad</option>
                <option>Pallandri</option>`;
      break;
    }

    case "Balochistan": {
      dropDownAdCity.innerHTML = `
                <option>Select city</option>
                <option>Bela</option>
                <option>Gwadar</option>
                <option>Jiwani</option>
                <option>Kalat</option>
                <option>Khuzdar</option>
                <option>Lasbela</option>
                <option>Loralai</option>
                <option>Ormara</option>
                <option>Pasni</option>
                <option>Quetta</option>
                `;
      break;
    }

    case "Federally Administered Tribal Areas": {
      dropDownAdCity.innerHTML = `
            <option>Select city</option>
            <option>Ali Masjid</option>
<option>Jamrud</option>
<option>Jandola</option>
<option>Kandhura</option>
<option>Landi Kotal</option>
<option>Miram Shah</option>
<option>Parachinar</option>
<option>Torkham</option>
<option>Wana</option>`;
      break;
    }

    case "Islamabad Capital Territory": {
      dropDownAdCity.innerHTML = `
            <option>Select city</option>
            <option>Islamabad</option>`;
      break;
    }

    case "Khyber Pakhtunkhwa": {
      dropDownAdCity.innerHTML = `
            <option>Select city</option>
            <option>Abbottabad</option>
<option>Bannu</option>
<option>Batagram</option>
<option>Buner</option>
<option>Charsadda</option>
<option>Chitral</option>
<option>Darra Adam Khel</option>
<option>Dera Ismail Khan</option>
<option>Hangu</option>
<option>Haripur</option>
<option>Karak</option>
<option>Kohat</option>
<option>Kohistan</option>
<option>Lakki Marwat</option>
<option>Lower Dir</option>
<option>Malakand</option>
<option>Mansehra</option>
<option>Mardan</option>
<option>Mingaora</option>
<option>Nowshera</option>
<option>Peshawar</option>
<option>Shangla</option>
<option>Swabi</option>
<option>Swat</option>
<option>Tank</option>
<option>Upper Dir</option>`;
      break;
    }

    case "Northern Areas": {
      dropDownAdCity.innerHTML = `
            <option>Select city</option>
            <option>Askoley</option>
<option>Chilas</option>
<option>Ghanche</option>
<option>Ghizer</option>
<option>Gilgit</option>
<option>Khaplu</option>
<option>Skardu</option>`;
      break;
    }

    case "Punjab": {
      dropDownAdCity.innerHTML = `
            <option>Select city</option>
            <option>Ahmadpur East</option>
<option>Arifwala</option>
<option>Attock</option>
<option>Bahawalnagar</option>
<option>Bahawalpur</option>
<option>Bhakkar</option>
<option>Burewala</option>
<option>Chakwal</option>
<option>Chichawatni</option>
<option>Chiniot</option>
<option>Chishtian Mandi</option>
<option>Daska</option>
<option>Dera Ghazi Khan</option>
<option>Faisalabad</option>
<option>Gojra</option>
<option>Gujar Khan</option>
<option>Gujranwala</option>
<option>Gujrat</option>
<option>Hafizabad</option>
<option>Hasan Abdal</option>
<option>Hasilpur</option>
<option>Haveli lakha</option>
<option>Jaranwala</option>
<option>Jhang Sadar</option>
<option>Jhelum</option>
<option>Kamoke</option>
<option>Kasur</option>
<option>Khanewal</option>
<option>Khanpur</option>
<option>Khushab</option>
<option>Kot Addu</option>
<option>Kotli</option>
<option>Lahore</option>
<option>Layyah</option>
<option>Mailsi</option>
<option>Mandi Bahauddin</option>
<option>Mian Chunnu</option>
<option>Mianwali</option>
<option>Multan</option>
<option>Muridike</option>
<option>Murree</option>
<option>Muzaffargarh</option>
<option>Narowal</option>
<option>Okara</option>
<option>Pakpattan</option>
<option>Pindi Bhattian</option>
<option>Pirmahal</option>
<option>Rahimyar Khan</option>
<option>Rajanpur</option>
<option>Rawalpindi</option>
<option>Sadiqabad</option>
<option>Safdar Abad</option>
<option>Sahiwal</option>
<option>Sargodha</option>
<option>Shakargarh</option>
<option>Sheikhüpura</option>
<option>Sialkot</option>
<option>Sohawa</option>
<option>Talagang</option>
<option>Toba Tek singh</option>
<option>Vehari</option>
<option>Wah</option>
<option>Wazirabad</option>`;
      break;
    }

    case "Sindh": {
      dropDownAdCity.innerHTML = `
            <option>Select city</option>
            <option>Badin</option>
<option>Dadu</option>
<option>Ghotki</option>
<option>Hala</option>
<option>Hyderabad</option>
<option>Jacobabad</option>
<option>Jamshoro</option>
<option>Karachi</option>
<option>Khairpur</option>
<option>Larkana</option>
<option>Mirpur Khas</option>
<option>Mithi</option>
<option>Nawabshah</option>
<option>Ratodero</option>
<option>Sanghar</option>
<option>Shikarpur</option>
<option>Sukkar</option>
<option>Sukkur</option>
<option>Tando Adam</option>
<option>Thatta</option>
            `;
      break;
    }
  }
}

//method to restrict the user to input only numbers
function filterNumbers(event) {
  var code = event.keyCode;
  return (
    (code >= 48 && code <= 57) ||
    (code >= 96 && code <= 105) ||
    (code == 8 || code == 9) ||
    (code == 37 || code == 39) ||
    (code == 35 || code == 36)
  );
}
// firebase.database().ref("ads/car").push(obj);
// console.log(obj);

// firebase.database().ref('ads/car').on('child_added',(data)=>{
//     //console.log(data.key);
//     console.log(data.key,data.val().name);
// });

//reads the image url from open file dialog from
//client browser
function readImgUrl(input) {
  //    console.log('in read image url');
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      input.parentNode.style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

//open the uplod dialog
function uploadImg(element) {
  // document.getElementById('').getElementsByTagName('i')
  element.nextSibling.click();
}

//get the input images from the client browser
function getImages() {
  var images = [];
  var imgDiv = document.getElementsByClassName("img-container");
  for (var i = 0; i < imgDiv.length; i++) {
    if (imgDiv[i].style.backgroundImage != "") {
      images.push(
        imgDiv[i].style.backgroundImage.slice(4, -1).replace(/"/g, "")
      );
    }
  }
  return images;
}

function getAdObj(formControls, imagesArray) {
  var obj = {};
  // console.log('updating user obj',obj);
  if (
    formControls[1].selectedIndex === 1 ||
    formControls[1].selectedIndex === 2 ||
    formControls[1].selectedIndex === 8 ||
    formControls[1].selectedIndex === 10
  ) {
    obj = {
      title: formControls[0].value,
      category: formControls[1].options[formControls[1].selectedIndex].value,
      price: formControls[2].value,
      description: formControls[3].value,
      images: imagesArray,
      owner: formControls[4].value,
      ownerEmail: userEmail,
      phone: formControls[5].value,
      province: formControls[6].options[formControls[6].selectedIndex].value,
      city: formControls[7].options[formControls[7].selectedIndex].value,
      timestamp: new Date().getTime()
    };
    //console.log('in the obj category : Price, Description');
  } else if (
    formControls[1].selectedIndex === 3 ||
    formControls[1].selectedIndex === 4 ||
    formControls[1].selectedIndex === 5 ||
    formControls[1].selectedIndex === 6 ||
    formControls[1].selectedIndex === 9 ||
    formControls[1].selectedIndex === 11 ||
    formControls[1].selectedIndex === 12 ||
    formControls[1].selectedIndex === 13
  ) {
    obj = {
      title: formControls[0].value,
      category: formControls[1].options[formControls[1].selectedIndex].value,
      price: formControls[2].value,
      condition: formControls[3].value,
      description: formControls[4].value,
      images: imagesArray,
      owner: formControls[5].value,
      ownerEmail: userEmail,
      phone: formControls[6].value,
      province: formControls[7].options[formControls[7].selectedIndex].value,
      city: formControls[8].options[formControls[8].selectedIndex].value,
      timestamp: new Date().getTime()
    };
    // console.log('in the obj category : Price , Condtion , Description');
  } else if (formControls[1].selectedIndex === 7) {
    obj = {
      title: formControls[0].value,
      category: formControls[1].options[formControls[1].selectedIndex].value,
      type: formControls[2].checked ? formControls[2].id : formControls[3].id,
      description: formControls[4].value,
      images: imagesArray,
      owner: formControls[5].value,
      ownerEmail: userEmail,
      phone: formControls[6].value,
      province: formControls[7].options[formControls[7].selectedIndex].value,
      city: formControls[8].options[formControls[8].selectedIndex].value,
      timestamp: new Date().getTime()
    };
  }
  return obj;
}

//method to submit the add
function submitAd() {
  var formControls = getFormControls();
  var adObj = getAdObj(formControls, getImages());
  if (validateForm(formControls)) {
    showSpinModel();
    var adObj = getAdObj(formControls, getImages());
    let category = adObj.category
      .trim()
      .split(" ")
      .join("_");
    category = category.split(",").join("");
    let JSONObj = JSON.stringify(adObj);
    fetch(`http://localhost:5001/Ads/${category}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSONObj
    })
      .then(ev => {
        refreshForm(formControls);
        var Header = `<h2 class="heading text-medium text-green">Ad Submited Successfully!</h2>
              <span class="model-close text-large hover-text-blue"><i class="fa fa-window-close"></i></span>`;
        var Body = `
          <p class="text-blue text-bold">Your ad is sumbit successfull your name and phone number will be made
              public if any one is interested in your ad, so he/she can contact you
          </p>`;
        hideSpinModel();
        showModel(Header, Body, true);
      })
      .catch(e => {
        hideSpinModel();
        var Header = `<h2 class="heading text-medium text-red">Failed to submit your ad!!</h2>
              <span class="model-close text-large hover-text-blue"><i class="fa fa-window-close"></i></span>`;
        var Body = `
          <p class="text-blue text-bold">Sorry to say but we are enable to submit your ad,
          something may be wrong or the connection was interepted please try again later.
          </p>`;
        showModel(Header, Body);
        console.log(e);
      });
  } else {
    for (let index = 0; index < formControls.length; index++) {
      filterInput(formControls[index]);
    }
  }
}

function getFormControls() {
  return document
    .getElementById("adForm")
    .getElementsByClassName("form-element");
}

function validateForm(formControls, images) {
  // var checkFlag = true;
  var form = document.getElementById("adForm");
  var noalerts = form.getElementsByClassName("alert");
  var notValidates = form.getElementsByClassName("not-validated");
  return !(notValidates.length > 0 || noalerts.length > 0);
  // if (notValidates.length > 0 || noalerts.length > 0) checkFlag = false;
  // else checkFlag = true;
  // return checkFlag;
}

function refreshImages() {
  var imgDiv = document.getElementsByClassName("img-container");
  for (var i = 0; i < imgDiv.length; i++) {
    imgDiv[i].style.backgroundImage = "";
  }
}

function refreshForm(formControls) {
  for (let index = 0; index < formControls.length; index++) {
    //refreshing feilds
    if (
      formControls[index].type === "text" ||
      formControls[index].type === "textarea"
    ) {
      formControls[index].value = "";
    } else if (formControls[index].nodeName == "SELECT") {
      formControls[index].selectedIndex = 0;
    }
  }
  refreshImages();
}

//method to validate input if it is empty
function filterInput(element) {
  element.classList.remove("not-validated");
  let validaters = element.parentNode.getElementsByClassName("form-validate");
  if (element.nodeName === "INPUT") {
    if (element.value.trim() === "") {
      validaters[0].style.display = "inline-block";
      validaters[1].style.display = "block";
      element.classList.add("alert");
    } else {
      validaters[0].style.display = "none";
      validaters[1].style.display = "none";
      element.classList.remove("alert");
    }
  } else if (element.nodeName === "SELECT") {
    if (element.selectedIndex == 0) {
      validaters[0].style.display = "inline-block";
      validaters[1].style.display = "block";
      element.classList.add("alert");
    } else {
      validaters[0].style.display = "none";
      validaters[1].style.display = "none";
      element.classList.remove("alert");
    }
  }
  if (element.name == "phone") {
    if (filterContact(element.value)) {
      validaters[0].style.display = "none";
      validaters[1].style.display = "none";
      element.classList.remove("alert");
    } else {
      validaters[0].style.display = "inline-block";
      validaters[1].style.display = "block";
      element.classList.add("alert");
    }
  }
}

function filterContact(inputText) {
  var re = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/g;
  var res = re.test(inputText);
  return res;
}

//CONVERTS THE BASE64 STRING DATA TO BUFFER BYTES ARRAY
function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(
    base64.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
  );
  var byteNumbers = new Array(binary_string.length);
  for (var i = 0; i < binary_string.length; i++) {
    byteNumbers[i] = binary_string.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
  // var len = binary_string.length;
  // var bytes = new Uint8Array(len);
  // for (var i = 0; i < len; i++) {
  //   bytes[i] = binary_string.charCodeAt(i);
  // }
  // return bytes.buffer;
}

//CONVERTS THE BUFFER BYTES ARRAY STRING DATA TO BASE64 STRING
function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// function filterSubmitBtn(){
//   var btnSubmit = document.getElementById('btnSubmit');
//   var form = document.getElementById('adForm');
//   var notValidates = []
//   notValidates.push(form.getElementsByClassName('not-validated'));
//   notValidates.push(form.getElementsByClassName('alert'));
//   console.log(notValidates[0],notValidates[1]);
//   ! (notValidates[0].length > 0 || notValidates[1].length > 0)  ? btnSubmit.disabled = false
//   : btnSubmit.disabled = true
// }
