import axios, { AxiosResponse } from 'axios'

// Define interfaces for the request parameters
interface AirPollutionParams {
  lat: string
  lon: string
  start: string
  end: string
}

interface ForecastParams {
  lat: string
  lon: string
}

class WeatherService {
  public async getAirPollution({
    lat,
    lon,
    start,
    end,
  }: AirPollutionParams): Promise<AirPollution | []> {
    try {
      /* let response = await axios.get(`${process.env.WEATHER_END_POINT}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${process.env.WEATHER_API_KEY}`) */
      let response: AxiosResponse<AirPollution> = await axios.get(
        'http://api.openweathermap.org/data/2.5/air_pollution/history?lat=10.96854&lon=-74.78132&start=1606223802&end=1606482999&appid=941989c630db569c05cf3278218b2974'
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
      /* let response = await axios.get(`${process.env.WEATHER_END_POINT}/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`) */
      let response: AxiosResponse<Forecast> = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=941989c630db569c05cf3278218b2974`
      )
      return response.data
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default WeatherService
