'use client'

import { Button, Card, CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { MdOutlineBookmark, MdOutlineImageSearch, MdOutlineSearch } from "react-icons/md"
import { useMutation } from '@tanstack/react-query';
import WeatherService from "@/services/weatherService";
import { useEffect, useState } from "react";
import Image from "next/image";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const ForecastTable = (data: any) => {
    data = data && data.filter((item: any) => item.dt_txt.includes("12:00:00"))

    function toCelcious(kelvin: number) {
        return `${Math.round(kelvin - 273.15)}°C`
    }

    function getWeatherIcon(weather: any) {
        let icon = weather[0].icon
        return <Image width={30} height={30} src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
    }

    function getDayOfWeek(date: string) {
        const dayOfWeekNumber = new Date(date).getDay();
        return daysOfWeek[dayOfWeekNumber];
    }

    return (
        <Table>
            <TableHeader>
                <TableColumn>{""}</TableColumn>
                <TableColumn>{""}</TableColumn>
                <TableColumn>Temp</TableColumn>
                <TableColumn>Feels Like</TableColumn>
                <TableColumn>Temp Min</TableColumn>
                <TableColumn>Temp Max</TableColumn>
                <TableColumn>Humidity</TableColumn>
            </TableHeader>
            <TableBody>
                {
                    data && data.map((item: any, i: number) => (
                        <TableRow key={i}>
                            <TableCell>{getDayOfWeek(item.dt_txt)}</TableCell>
                            <TableCell>{getWeatherIcon(item.weather)}</TableCell>
                            <TableCell>{toCelcious(item.main.temp)}</TableCell>
                            <TableCell>{toCelcious(item.main.temp)}</TableCell>
                            <TableCell>{toCelcious(item.main.temp_min)}</TableCell>
                            <TableCell>{toCelcious(item.main.temp_max)}</TableCell>
                            <TableCell>{item.main.humidity}%</TableCell>
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
    const [forecast, setForecast] = useState<Forecast>()

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
            setForecast(result)
        },
        onError: () => {
            alert('error')
        },
    });

    useEffect(() => {
        getAirPollution()
        getForecast()
    }, [])


    return (
        <div>
            <TopSection />
            <div className="flex flex-col max-w-[1280px]">
                <div className="flex gap-4">
                    <div className="w-50">
                        <Card>
                            <CardBody>
                                <h6 className="font-bold ml-4">Forecast for next five days</h6>
                                {isGetPollutionPending ? <h1>Pending....</h1> : ForecastTable(forecast?.list)}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardContainer