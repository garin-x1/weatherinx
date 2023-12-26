window.addEventListener("load", () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position) => {
            let lon;
            let lat;
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            const API_KEY = "b580ae74327645d1a56152716232212"
            const baseLink = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`;
            const data = await fetch(baseLink).then(Response => Response.json());

            document.querySelector(".container").removeChild(document.querySelector(".permission"));
            document.querySelector("header").style.visibility = "visible";
            document.querySelector(".stat-container").style.visibility = "visible";

            if(!data.current.is_day){
                document.body.classList.add("dark-body");
                document.body.querySelector(".container").classList.add("dark-container");
            }
            // console.log(window.matchMedia("(prefers-color-scheme: dark)"));

            // Get the temperature
            const {temp_c, temp_f, feelslike_c, feelslike_f} = data.current;
            const tempElement = document.querySelector(".temp-degree");
            const tempFeel = document.querySelector(".temp-value");
            let celcius = true;
            tempElement.innerHTML = (celcius)?`${temp_c}°C`:`${temp_f}°F`;
            tempFeel.innerHTML = (celcius)?`${feelslike_c}°C`:`${feelslike_f}°F`;
            
            // Get the location
            const cityElement = document.querySelector(".location-city");
            const regCountElement = document.querySelector(".location-reg-count");
            const {name, region, country} = data.location;
            cityElement.innerText = name;
            regCountElement.innerText = `${region}, ${country}`;

            // Get last update
            const { last_updated } = data.current;
            const lastUpdate = document.querySelector(".last-update");
            const [year, month, date] = last_updated.split(" ")[0].split("-");
            const time = last_updated.split(" ")[1];
            lastUpdate.innerHTML = (celcius)?
                `${time}<br> ${date}-${month}-${year}`
                :
                `${time}<br> ${month}-${date}-${year}`;

            // Get the weather condition
            const weather = document.querySelector(".weather-condition");
            const weatherIcon = document.querySelector(".weather-icon");
            const cloudPercentage = document.querySelector(".cloud-value");
            const { condition, cloud } = data.current;
            weather.innerText = condition.text;
            weatherIcon.alt = `${condition.text} icon`;
            weatherIcon.src = `https:${condition.icon}`;
            cloudPercentage.innerHTML = `${cloud}%`;

            // Tab icon
            const tabIcon = document.createElement("link");
            tabIcon.rel = "icon";
            tabIcon.href = `https:${condition.icon}`;
            document.head.appendChild(tabIcon);

            // Get the humidity
            const humidElement = document.querySelector(".humid-value");
            const { humidity } = data.current;
            humidElement.innerHTML = `${humidity}%`;

            // Get the wind
            const windElement = document.querySelector(".wind-value");
            const { wind_mph, wind_kph } = data.current;
            windElement.innerHTML = (celcius)?`${wind_kph} km/h`:`${wind_mph} mph`;

            // Get the pressure
            const pressElement = document.querySelector(".press-value");
            const { pressure_mb, pressure_in } = data.current;
            pressElement.innerHTML = (celcius)?`${pressure_mb/10} kPa`:`${(pressure_in/2.03602).toPrecision(4)} psi`;

            // Get the UV index
            const uvElement = document.querySelector(".uv-value");
            const { uv } = data.current;
            if(uv >= 11){
                uvElement.innerHTML = `${uv} (Extreme)`;
            }else if(uv >= 8){
                uvElement.innerHTML = `${uv} (Very high)`;
            }else if(uv >= 6){
                uvElement.innerHTML = `${uv} (High)`;
            }else if(uv >= 3){
                uvElement.innerHTML = `${uv} (Moderate)`;
            }else{
                uvElement.innerHTML = `${uv} (Low)`;
            }

            tempElement.addEventListener("click", e => {
                celcius = !celcius;
                tempElement.innerHTML = (celcius)?`${temp_c}°C`:`${temp_f}°F`;
                tempFeel.innerHTML = (celcius)?`${feelslike_c}°C`:`${feelslike_f}°F`;
                windElement.innerHTML = (celcius)?`${wind_kph} km/h`:`${wind_mph} mph`;
                pressElement.innerHTML = (celcius)?`${pressure_mb/10} kPa`:`${(pressure_in/2.03602).toPrecision(4)} psi`;
                lastUpdate.innerHTML = (celcius)?
                `${time}<br> ${date}-${month}-${year}`
                :
                `${time}<br> ${month}-${date}-${year}`;
            })
        })
    }
})