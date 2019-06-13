import React from 'react';

const app = () => {
  
	const handleZipCode = (e) => {
    //get zip value from field
		let zip = e.target.value;
    //proxyurl workaround for cors
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
    //api endpoit for finding city/state
    const url = `https://firstfamilyinsurance.com/api/zipLookup?ZipCode=${zip}`;
    //performs lookup when zip code is correct length
		if (zip.length === 5) {
      //get request
	    fetch(proxyurl + url)
      .then(response => response.json())
      .then(data => {
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
			      <input required type="text" name="fName" />
            <br/>
			      Last Name
			      <input required type="text" name="lName" />
            <br/>
			      Street Adress
			      <input required type="text" name="adress" />
            <br/>
			      Zip Code
			      <input onChange={handleZipCode} required type="text" name="zip" />
            <br/>
			      State
			      <input required type="text" name="state" />
            <br/>
			      City&nbsp;&nbsp;&nbsp;
			      <input required type="text" name="city" />
            <br/>
			      </label>
            <div id='container'></div>
            <input id="submit" type="submit" value="Submit" />
        </form>
                
    </div>
  )
}

export default app;