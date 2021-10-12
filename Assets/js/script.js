// Adding functionality to pull chosen cities weather
function init(){

	// Elements being called from the index.html file
	// Gives "inputE1" a reference to "city-input" from the index.html file
	const inputEl = document.getElementById("city-input");
	const searchEl = document.getElementById("search-button");
	const clearEl = document.getElementById("clear-history");
	const nameEl = document.getElementById("city-name");
	const currentPicEl = document.getElementById("current-pic");
	const currentTempEl = document.getElementById("temperature");
	const currentHumidityEl = document.getElementById("humidity");4
	const currentWindEl = document.getElementById("wind-speed");
	const currentUVEl = document.getElementById("UV-index");
	const historyEl = document.getElementById("history");

	let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
	console.log(searchHistory);

	// key used to verify api access
	const APIKey = "6d85a3f0dd4ed112ca2bc9e97032cbd3";

	function getWeather(cityName) {
		// Using the input city "cityName" we make our URL to call data from the open weather map api WEATHER server.  The ApiKey associated with my open weather map api account gives access.
		let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
		// Axios is a shortcut way to make a GET request to the URL
		axios.get(queryURL)
			.then(function(response){
					console.log(response);
					// When a cityName is called it activates this function creating a 'Date' object. Plus date formatting
					const currentDate = new Date(response.data.dt*1000);
					console.log(currentDate);
					// Gets the day-of-the-month
					const day = currentDate.getDate();
					// Gets the month of a Date object
					const month = currentDate.getMonth() + 1;
					// Gets the year using Universal Coordinated Time (UTC)
					const year = currentDate.getFullYear();
					// building URL response based on cityName entry and current date responses
					nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
					// setting up weatherPic variable according to Open weather map icon requests
					let weatherPic = response.data.weather[0].icon;
					// setting current picture attribute to the url + 'weatherPic' reference.  Pulling icon data from server side
					currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
					// setting the alt text to a description of the icon in case it fails
					currentPicEl.setAttribute("alt",response.data.weather[0].description);
					// displays the current temperature
					currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
					// displays the current humidity
					currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
					// displays the current wind
					currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
				// setting latitude variable for UV index
				let lat = response.data.coord.lat;
				// setting longitude variable for UV index
				let lon = response.data.coord.lon;
				// building URL to call server for UV index data
				let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
				axios.get(UVQueryURL)
				.then(function(response){
					let UVIndex = document.createElement("span");
				UVIndex.setAttribute("class","badge badge-danger");
					UVIndex.innerHTML = response.data[0].value;
					currentUVEl.innerHTML = "UV Index: ";
					currentUVEl.append(UVIndex);
				});
				// cityID = cityName but used for 5 day forecasting request
				let cityID = response.data.id;
				// Using the input city "cityName" we make our URL to call data from the open weather map api 5 day weather FORECAST server.  The ApiKey associated with my open weather map api account gives access.
				let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
				axios.get(forecastQueryURL)
				.then(function(response){
						console.log(response);
						// declaring forecastEls object that has a return of .forecast selectors 
						const forecastEls = document.querySelectorAll(".forecast");
						// enter the forecastEls object into the loop until you get 5 more days returned
						for (i=0; i<forecastEls.length; i++) {
								forecastEls[i].innerHTML = "";
								const forecastIndex = i*8 + 4;
								const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
								// Gets the day-of-the-month
								const forecastDay = forecastDate.getDate();
								// Gets the month of a Date object
								const forecastMonth = forecastDate.getMonth() + 1;
								// Gets the year using Universal Coordinated Time (UTC)
								const forecastYear = forecastDate.getFullYear();
								// creating object with p element to be used later
								const forecastDateEl = document.createElement("p");
								// creating card like objects for forecast responses
								forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
								// building a request path
								forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
								// mutating forecastEl to the updated request
								forecastEls[i].append(forecastDateEl);
								// starting icon request
								const forecastWeatherEl = document.createElement("img");
								// server call to bring back an icon image
								forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
								// setting up alternate text for icon image
								forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
								// mutates the 'forecastWeatherE1' data for the current day onto this forecastEls object
								forecastEls[i].append(forecastWeatherEl);
								// building description to fill forecastTempE1 p tag
								const forecastTempEl = document.createElement("p");
								// calls for temperature response
								forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
								// mutates the 'forecastTempEl' data for the current day onto this forecastEls object
								forecastEls[i].append(forecastTempEl);
								// building description to fill forecastHumidity p tag
								const forecastHumidityEl = document.createElement("p");
								// response with information shown in p tag
								forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
								// mutates the 'forecastHumidityEl' data for the current day onto this forecastEls object
								forecastEls[i].append(forecastHumidityEl);
								}
						})
				});
		}
		// on click 'search' - the input value is added to local storage for search history 
		searchEl.addEventListener("click",function() {
			const searchTerm = inputEl.value;
			getWeather(searchTerm);
				searchHistory.push(searchTerm);
				localStorage.setItem("search",JSON.stringify(searchHistory));
				renderSearchHistory();
		})
		clearEl.addEventListener("click",function() {
			// clears search history on clear-history button click
			searchHistory = [];
			renderSearchHistory();})
			function k2f(K) {
				return Math.floor((K - 273.15) *1.8 +32);
		}
		function renderSearchHistory() {
			// renders search history adding the newest addition
				historyEl.innerHTML = "";
				for (let i=0; i<searchHistory.length; i++) {
						const historyItem = document.createElement("input");
						historyItem.setAttribute("type","text");
						historyItem.setAttribute("readonly",true);
						historyItem.setAttribute("class", "form-control d-block bg-white");
						historyItem.setAttribute("value", searchHistory[i]);
						historyItem.addEventListener("click",function() {
							getWeather(historyItem.value);
					})
				historyEl.append(historyItem);
			}
			renderSearchHistory();
			if (searchHistory.length > 0) {
				getWeather(searchHistory[searchHistory.length - 1]);
		}
		}
}
init();