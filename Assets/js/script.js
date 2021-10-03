function init(){

	const APIKey = "c2b57ce6c568bc5d04209e2700a7de85";

	function getWeather(cityName) {
		let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
		axios.get(queryURL)
			.then(function(response){
					console.log(response);
					const currentDate = new Date(response.data.dt*1000);
					console.log(currentDate);
					const day = currentDate.getDate();
					const month = currentDate.getMonth() + 1;
					const year = currentDate.getFullYear();
					nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
					let weatherPic = response.data.weather[0].icon;
					currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
					currentPicEl.setAttribute("alt",response.data.weather[0].description);
					currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
					currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
					currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
				let lat = response.data.coord.lat;
				let lon = response.data.coord.lon;
				let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
				axios.get(UVQueryURL)
				.then(function(response){
					let UVIndex = document.createElement("span");
				UVIndex.setAttribute("class","badge badge-danger");
					UVIndex.innerHTML = response.data[0].value;
					currentUVEl.innerHTML = "UV Index: ";
					currentUVEl.append(UVIndex);
				});
				let cityID = response.data.id;
				let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
				axios.get(forecastQueryURL)
				.then(function(response){
						console.log(response);
						const forecastEls = document.querySelectorAll(".forecast");
						for (i=0; i<forecastEls.length; i++) {
								forecastEls[i].innerHTML = "";
								const forecastIndex = i*8 + 4;
								const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
								const forecastDay = forecastDate.getDate();
								const forecastMonth = forecastDate.getMonth() + 1;
								const forecastYear = forecastDate.getFullYear();
								const forecastDateEl = document.createElement("p");
								forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
								forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
								forecastEls[i].append(forecastDateEl);
								const forecastWeatherEl = document.createElement("img");
								forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
								forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
								forecastEls[i].append(forecastWeatherEl);
								const forecastTempEl = document.createElement("p");
								forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
								forecastEls[i].append(forecastTempEl);
								const forecastHumidityEl = document.createElement("p");
								forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
								forecastEls[i].append(forecastHumidityEl);
								}
						})
				});
		}

}			
init();