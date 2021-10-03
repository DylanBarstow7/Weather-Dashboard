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
init();