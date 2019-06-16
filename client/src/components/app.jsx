import React from 'react';

const app = () => {
  
	const handleZipCode = (e) => {
    //get zip value from field
		var zip = e.target.value;
    //get zip code element
    var zipElement = e.target;
    //get error text container
    let errorField = document.getElementById("error-field");
    //remove error text after error occurs
    if (errorField.firstChild) {
    errorField.removeChild(errorField.firstChild);
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
      //get request
	    fetch(proxyurl + url)
      .then(response => response.json())
      .then(data => {
        if (data.data.length === 0) {
          errorField.removeAttribute('hidden');
          console.log(zipElement.style = 'border:5px solid red');
          errorField.appendChild(document.createTextNode("Zip Code Invalid"));

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
         while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
        //if there is more than one city in zipcode
        if (data.data.length > 1) {
          //create new city input for each city in zip
          for (let i=1; i < data.data.length ;i++){
                let container = document.getElementById("container");
                container.appendChild(document.createTextNode("City " + (i+1)));
                var input = document.createElement("input");
                input.className = 'text-field';
                input.type = "text";
                input.name = "city" + i;
                container.appendChild(input);
                input.value = cities[i];
                //create line break
                container.appendChild(document.createElement("br"));
            }
        }
      })
      .catch(err => console.log(err))
	}
}
	return (
    <div className='page-container'>
	  <h1>Form Registration</h1>

			  <form id="form">
			    <label>
			      First Name
			      <input className="text-field" required type="text" name="fName" />
            <br/>
			      Last Name
			      <input className="text-field" required type="text" name="lName" />
            <br/>
			      Street Adress
			      <input className="text-field" required type="text" name="adress" />
            <br/>
			      Zip Code
			      <input className="text-field" onChange={handleZipCode} required type="text" pattern="[0-9]*" maxLength='5' name="zip" />
            <div hidden id='error-field'></div>
            <br/>
			      State
			      <input className="text-field" required type="text" name="state" />
            <br/>
			      City&nbsp;&nbsp;&nbsp;
            <input className="text-field" required type="text" name="city" />

            <br/>
			      </label>
            <div id='container'></div>
            <input id="submit" type="submit" value="Submit" />
        </form>
                
    </div>
  )
}

export default app;