import { Injectable } from "@angular/core";
import { Observable, map, tap, catchError } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WeatherService {

    apiBaseUrl: string = 'http://api.weatherstack.com/';
    apiKey: string = process.env.NG_APP_API_KEY;

    constructor(
        private http: HttpClient,
    ) {}

    getWeatherData(location: string): Observable<any> {
        const forecastUrl = `${this.apiBaseUrl}forecast?access_key=${this.apiKey}&query=${location}&units=f`;
        return this.http.get(forecastUrl).pipe(
            map((response: any) => {
                if (response.error) {
                    console.error(`Error from weatherstack API: ${response.error.info}`)
                };
                window.localStorage.setItem('location', response.location.name);
                return response;
            }),
            catchError((err) => {
                throw new Error(`Error while retrieving weather data in WeatherService: ${err.message}`)
            }),
        )
    }
}
