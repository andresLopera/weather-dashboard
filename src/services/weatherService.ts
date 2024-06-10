import axios, { AxiosResponse } from 'axios'

// Define interfaces for the request parameters
interface AirPollutionParams {
  lat: number
  lon: number
  start: string
  end: string
}

interface ForecastParams {
  lat: number
  lon: number
}

class WeatherService {
  private endPoint = process.env.NEXT_PUBLIC_WEATHER_END_POINT
  private apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

  public async getAirPollution({
    lat,
    lon,
    start,
    end,
  }: AirPollutionParams): Promise<AirPollution | []> {
    try {
      let response = await axios.get(
        `${this.endPoint}/air_pollution/history?lat=${lat}&lon=${lon}&start=1606223802&end=1606482999&appid=${this.apiKey}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  public async getForecast({
    lat,
    lon,
  }: ForecastParams): Promise<Forecast | []> {
    try {
      let response = await axios.get(
        `${this.endPoint}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default WeatherService
