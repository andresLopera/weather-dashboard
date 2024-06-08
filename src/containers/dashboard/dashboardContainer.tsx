'use client'

import { Button, Card, CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Skeleton } from "@nextui-org/react"
import { MdOutlineBookmark, MdOutlineImageSearch, MdOutlineSearch } from "react-icons/md"
import { useMutation } from '@tanstack/react-query';
import WeatherService from "@/services/weatherService";
import { useEffect, useState } from "react";
import Image from "next/image";

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CURRENT_HOUR_FILTER = "09:00:00"

function getDayOfWeek(date: string) {
    const dayOfWeekNumber = new Date(date).getDay();
    return DAYS_OF_WEEK[dayOfWeekNumber];
}

function toCelcious(kelvin: number) {
    return Math.round(kelvin - 273.15)
}

function getWeatherIcon(weather: any) {
    let icon = weather[0].icon
    return <Image width={30} height={30} src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
}


interface IDashboardContainerProps {

}

const TopSection = () => {
    return (
        <div className='flex justify-between mb-5'>
            <div className="flex flex-1 justify-end max-w-[1280px] gap-2">
                <div className=" flex gap-2">
                    <Input className="dark:bg-red" type="text" label="" placeholder="Search KPI" endContent={<MdOutlineSearch className="text-2x" />} />
                    <Button isIconOnly color="default" aria-label="Like">
                        <MdOutlineImageSearch />
                    </Button>
                </div>
            </div>
            <Button isIconOnly color="default" aria-label="Like">
                <MdOutlineBookmark />
            </Button>
        </div>
    )
}

const ForecastTable = (data: any, loading: boolean) => {
    return (
        <Table>
            <TableHeader>
                <TableColumn className='min-w-16'>{""}</TableColumn>
                <TableColumn className='min-w-16'>{""}</TableColumn>
                <TableColumn>Temp</TableColumn>
                <TableColumn>Feels Like</TableColumn>
                <TableColumn>Temp Min</TableColumn>
                <TableColumn>Temp Max</TableColumn>
                <TableColumn>Humidity</TableColumn>
                <TableColumn>Prob Prec</TableColumn>
            </TableHeader>
            <TableBody className="min-h-350">
                {loading && Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, i) => (<TableCell key={i}>
                            <Skeleton className="rounded-lg">
                                <div className="h-5 rounded-lg bg-default-400"></div>
                            </Skeleton>
                        </TableCell>
                        ))}
                    </TableRow>
                ))}
                {
                    data && data.map((item: any, i: number) => (
                        <TableRow key={i}>
                            <TableCell>{item.day}</TableCell>
                            <TableCell>{getWeatherIcon(item.weather)}</TableCell>
                            <TableCell>{item.temp}°C</TableCell>
                            <TableCell>{item.feels_like}°C</TableCell>
                            <TableCell>{item.temp_min}°C</TableCell>
                            <TableCell>{item.temp_max}°C</TableCell>
                            <TableCell>{item.humidity}%</TableCell>
                            <TableCell>{Math.round(item.pop * 100)}%</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}


const DashboardContainer = (props: IDashboardContainerProps) => {
    const weatherService = new WeatherService()
    const [airPollution, setAirPollution] = useState({})
    const [forecastDataTable, setForecastDataTable] = useState<[]>()

    const {
        mutate: getAirPollution,
        isPending: isGetPollutionPending,
    } = useMutation({
        mutationFn: () => {
            return weatherService.getAirPollution({ lat: '', lon: '', start: '', end: '' })
        },
        onSuccess: (result) => {
            console.log('success andres', result)
            setAirPollution(result)
        },
        onError: () => {
            alert('error')
        },
    });

    const {
        mutate: getForecast,
        isPending: isForecastPending,
    } = useMutation({
        mutationFn: () => {
            return weatherService.getForecast({ lat: '', lon: '' })
        },
        onSuccess: (result: any) => {
            proccessDataForecast(result)
        },
        onError: () => {
            alert('error')
        },
    });

    useEffect(() => {
        getAirPollution()
        getForecast()
    }, [])


    const proccessDataForecast = (forecast: any) => {
        let data = forecast.list
        let transformData: any = {}
        data.forEach(({ dt_txt, pop, main, clouds, weather }: any) => {
            let day = getDayOfWeek(dt_txt)
            if (!transformData[day]) {
                transformData[day] = {
                    day,
                    weather,
                    humidity: main.humidity,
                    pop,
                    feels_like: main.feels_like,
                    clouds: clouds.all,
                    temp_min: main.temp_min,
                    temp_max: main.temp_max,
                    temp: main.temp
                }
            } else {
                if (dt_txt.includes(CURRENT_HOUR_FILTER)) {
                    transformData[day].weather = weather
                    transformData[day].humidity = main.humidity,
                        transformData[day].pop = pop,
                        transformData[day].temp = main.temp
                    transformData[day].clouds = clouds.all
                    transformData[day].feels_like = main.feels_like
                }
                transformData[day].temp_min > main.temp_min ? transformData[day].temp_min = main.temp_min : null
                transformData[day].temp_max < main.temp_max ? transformData[day].temp_max = main.temp_max : null
            }
        })

        data = Object.values(transformData).map(function parseToCelcious(item: any) {
            return {
                ...item,
                temp: toCelcious(item.temp),
                feels_like: toCelcious(item.feels_like),
                temp_min: toCelcious(item.temp_min),
                temp_max: toCelcious(item.temp_max)
            }
        })
        setForecastDataTable(data)
    }

    return (
        <div>
            <TopSection />
            <div className="flex flex-col max-w-[1280px]">
                <div className="flex gap-4">
                    <div className="w-50">
                        <Card>
                            <CardBody>
                                <h6 className="font-bold ml-4">Forecast for next five days</h6>
                                {ForecastTable(forecastDataTable, isGetPollutionPending)}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardContainer