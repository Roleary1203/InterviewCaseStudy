import React from 'react';

const app = () => {
  

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    let firstName = data.get('fName');
    let lasttName = data.get('lName');
    let address = data.get('address');
    let zip = data.get('zip');
    let state = data.get('state');
    let city = data.get('radio');
    console.log(city);
    


  }
  
	const handleZipCode = (e) => {
    //get zip value from field
		let zip = e.target.value;
    //get zip code element
    let zipElement = e.target;
    //get error text container
    let errorField = document.getElementById("error-field");
    let cityRadio = document.getElementById("city-radio");
    let citiesContainer = document.getElementById("cities-container");

    //remove error text after error occurs
    if (errorField.firstChild) {
      errorField.removeChild(errorField.firstChild);
      document.getElementById('submit').disabled = false;

  }
    //hide error text
    errorField.setAttribute('hidden',true)
    //remove error border
    zipElement.removeAttribute('style');
    
    //proxyurl workaround for cors error issues
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
    //api endpoit for finding city/state
    const url = `https://firstfamilyinsurance.com/api/zipLookup?ZipCode=${zip}`;
    //performs lookup when zip code is correct length
		if (zip.length === 5) {
      cityRadio.setAttribute("style","display:none;");

      //get request
	    fetch(proxyurl + url)
      .then(response => response.json())
      .then(data => {
        if (data.data.length === 0) {
          errorField.removeAttribute('hidden');
          zipElement.style = 'border:5px solid red';
          errorField.appendChild(document.createTextNode("Zip Code Invalid"));
          document.getElementById('submit').disabled = true;
        }
        console.log(data)
        let cities = []
        //array of all cities in zipcode
        for (let i = 0; i < data.data.length; i++) {
          cities.push(data.data[i].City_Name);
        }
        let state = data.data[0].State_Abbr;
        //set variable for form
        let form = document.forms['form'];
        //find city and state elements in form
        let stateElement = form.elements['state'];
        let cityElement = form.elements['city'];
        stateElement.value = state;
        cityElement.value = cities[0];

        //clear extra city inputs on each new lookup
         while (citiesContainer.hasChildNodes()) {
                citiesContainer.removeChild(citiesContainer.lastChild);
            }
        //if there is more than one city in zipcode
        if (data.data.length > 1) {
          //create new city input for each city in zip
          for (let i=1; i < data.data.length ;i++){
                cityRadio.removeAttribute('hidden');
                cityRadio.style = "display:inline-block";
                var radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "radio";
                citiesContainer.appendChild(radio);
                var input = document.createElement("input");
                input.className = 'text-field';
                input.type = "text";
                input.name = "city" + i;
                input.placeholder = "City " + (i+1);
                citiesContainer.appendChild(input);
                input.value = cities[i];
                //create line break
                citiesContainer.appendChild(document.createElement("br"));
            }
        }
      })
      .catch(err => console.log(err))
	}
}
	return (
    <div className='page-container'>
	  <h1>Form</h1>

			  <form id="form" onSubmit={handleSubmit}>
			    <label>
			      <input className="text-field" required type="text" name="fName" placeholder="First Name" />
            <br/>
			      <input className="text-field" required type="text" name="lName" placeholder="Last Name" />
            <br/>
			      <input className="text-field" required type="text" name="address" placeholder="Street Address"/>
            <br/>
			      <input className="text-field" onChange={handleZipCode} required type="text" pattern="[0-9]{5}" maxLength='5' name="zip" placeholder="Zip Code" />
            <div hidden id='error-field'></div>
            <br/>
			      <input className="text-field" required type="text" name="state" placeholder="State"/>
            <br/>
            <div hidden id="city-radio"><input type="radio" name="radio" /></div><input className="text-field" required type="text" name="city" placeholder="City" />

            <br/>
			      </label>
            <div id='cities-container'></div>
            <input id="submit" type="submit" value="Submit" />
        </form>
                
    </div>
  )
}

export default app;