import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "",
      soloCity: "",
      extraCities: [],
      state: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleZipCode = this.handleZipCode.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //handles radio button cluck
  //sets selected state to selected city
  //unselects other cities
  handleChange(e) {
    console.log(e.target.value)
    this.setState({
      selected: e.target.value
    })
  }

  
  //handles submit press collect data from form
  handleSubmit(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let firstName = data.get('fName');
    let lasttName = data.get('lName');
    let address = data.get('address');
    let zip = data.get('zip');
    let state = data.get('state');
    let city = ""
    if (this.state.selected) {
      city = this.state.selected
    } else {
      city = data.get('city');
    }
    let info = {
      firstName,
      lasttName,
      address,
      zip,
      state,
      city
    }
    console.log(info)
  }


  //handles input of zip code
  //runes when there is a change of input in zip code field
	handleZipCode(e) {
    //set zip value from field
		let zip = e.target.value;
    //set zip code element
    let zipElement = e.target;
    //set error text container
    let errorField = document.getElementById("error-field");
    //set hidden radio element
    let hiddenRadio = document.getElementById("hidden-radio");

    //remove error text after error occurs
    if (errorField.firstChild) {
      errorField.removeChild(errorField.firstChild);
      document.getElementById('submit').disabled = false;

  }
    //hide error text
    errorField.setAttribute("hidden", true)
    //remove error border
    zipElement.removeAttribute('style');
    
		//when the zip code is correct length...
    if (zip.length === 5) {
      //hide radio button
      hiddenRadio.style.display = 'none';

      //proxyurl workaround for cors error issues
		  const proxyurl = "https://cors-anywhere.herokuapp.com/";
      //api endpoit for finding city/state
      const url = `https://firstfamilyinsurance.com/api/zipLookup?ZipCode=${zip}`;
      //performs lookup when zip code is correct length
      //get request
	    fetch(proxyurl + url)
      .then(response => response.json())
      .then(data => {
        //if no data returned
        if (data.data.length === 0) {
          errorField.removeAttribute('hidden');
          zipElement.style = 'border:5px solid red';
          errorField.appendChild(document.createTextNode("Zip Code Invalid"));
          document.getElementById('submit').disabled = true;
        }
        
        console.log(data)
        
        this.setState({
          soloCity: data.data[0].City_Name,
          state: data.data[0].State_Abbr,
          extraCities: [],
          selected: ""
        })

        //set variable for form
        let form = document.forms['form'];
        //find city and state elements in form
        let stateElement = form.elements['state'];
        let cityElement = form.elements['city'];
        //set value of text fields to correct city and state
        stateElement.value = this.state.state;
        cityElement.value = this.state.soloCity;
        
        //if more than one city...
        if (data.data.length > 1) {
          //reveal radio button for first city
          hiddenRadio.removeAttribute('hidden');
          hiddenRadio.style = "display:inline-block";
          //create array storage for multiple cities and sets state
          let cities = [];
          for (let i = 0; i < data.data.length; i++) {
            cities.push(data.data[i].City_Name);
          }
          //remove first city so there is not a duplicate
          cities.shift()
          this.setState({
            extraCities: cities
          })
        }

        //Old code. Updated to use state.
         /*
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
        */
      })
      .catch(err => console.log(err))
	}
}

render() {


	return(
    <div className='page-container'>
	  <h1>Form</h1>

			  <form id="form" onSubmit={this.handleSubmit}>
			    <label>
			      <input className="text-field" required type="text" name="fName" placeholder="First Name" />
            <br/>
			      <input className="text-field" required type="text" name="lName" placeholder="Last Name" />
            <br/>
			      <input className="text-field" required type="text" name="address" placeholder="Street Address"/>
            <br/>
			      <input className="text-field" onChange={this.handleZipCode} required type="text" pattern="[0-9]{5}" maxLength='5' name="zip" placeholder="Zip Code" />
            <div hidden id='error-field'></div>
            <br/>
			      <input className="text-field" required type="text" name="state" placeholder="State"/>
            <br/>
            <div hidden id="hidden-radio"><input type="radio" value={this.state.soloCity} checked={this.state.selected === this.state.soloCity} onChange={this.handleChange} /></div>
            <input className="text-field" required type="text" name="city" placeholder="City" />
            <div id='cities-container'>
            {this.state.extraCities.map((city,index) => {
              return <span key={index}><input type="radio" value={city} checked={this.state.selected === city} onChange={this.handleChange} />
              <input className="text-field" required type="text" name={city} defaultValue={city} />
              </span>

            })}
            </div>
			      </label>
            <input id="submit" type="submit" value="Submit" />
        </form>
                
    </div>
  )
 }
}

export default App;