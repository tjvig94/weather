import { Component, OnInit } from '@angular/core';
import { CurrentWeather } from './services/weather-api/weather-api.interface';
import { WeatherService } from './services/weather-api/weather-api.service';
import { catchError, Observable, map, tap, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string;
  currentWeather$: Observable<CurrentWeather> | null;
  location: string | null;
  locationForm: FormGroup = this.formBuilder.group({
    location: '',
  });
  errorMessage: string;

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder,
  ) {};

  ngOnInit(): void {
    this.location = window.localStorage.getItem('location')
    this.getCurrentWeather();
  }

  onSubmit(): void {
    this.location = this.locationForm.value.location;
    this.getCurrentWeather();
  }

  clear(): void {
    window.localStorage.removeItem('location');
    this.currentWeather$ = null;
    this.title = "Weather"
  }

  getCurrentWeather(): void {
    if (!this.location) {
      console.error('no location - can not retrieve weather data.');
      this.title = "Weather";
      return;
    };

    this.currentWeather$ = this.weatherService.getWeatherData(this.location).pipe(
      map(response => {
        // extract the data we need, and assign to fields for type assertion
        const { location, current } = response;

        if (!location && !current) {
          this.errorMessage = 'Oops! There was a problem with your request. Please make sure your entry is a valid location, check for spelling, and try again.';
        } else {
          this.errorMessage = '';
        }

        const weatherData: CurrentWeather = {
          location: {
            name: location.name,
            country: location.country,
            region: location.region,
            timezone_id: location.timezone_id,
            localtime: location.localtime,
          },
          current: {
            observation_time: current.observation_time,
            temperature: current.temperature,
            weather_code: current.weather_code,
            weather_icons: current.weather_icons,
            weather_descriptions: current.weather_descriptions,
            wind_speed: current.wind_speed,
            wind_degree: current.wind_degree,
            wind_dir: current.wind_dir,
            pressure: current.pressure,
            precip: current.precip,
            humidity: current.humidity,
            cloudcover: current.cloudcover,
            feelslike: current.feelslike,
            uv_index: current.uv_index,
            visibility: current.visibility,
            is_day: current.is_day, // yes or no
          },
        };
        this.title = `It is ${weatherData.current.weather_descriptions[0].toLowerCase()} in ${weatherData.location.name}.`
        return weatherData;
      }),
      catchError(err => {
        throw new Error(`Error after retrieving weather data: ${err.message}`)
      }),
    );
  }

}
