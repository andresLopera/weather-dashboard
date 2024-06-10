'use client'

import { Button, Card, CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Skeleton, Select, SelectItem, Avatar } from "@nextui-org/react"
import { MdOutlineBookmark, MdOutlineImageSearch, MdOutlineSearch } from "react-icons/md"
import { useMutation } from '@tanstack/react-query';
import WeatherService from "@/services/weatherService";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactECharts from 'echarts-for-react';
import countries from "@/lib/data/countries";

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CURRENT_HOUR_FILTER = "09:00:00"
const DEFAULT_COUNTRY_CODE = 'CO'
const DEFAULT_LATITUDE = 4.5709
const DEFAULT_LONGITUDE = -74.2973

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

const TopSection = (value: string, handleOnChange: any) => {
    return (
        <div className='flex justify-between mb-5'>
            <div className="flex flex-1 justify-end max-w-[1280px] gap-2">
                <div className=" flex gap-2 items-center">
                    <div className="flex min-w-[200px] max-w-xs flex-col gap-2">
                        <Select
                            items={countries}
                            label="Selected country"
                            className="max-w-xs"
                            selectedKeys={[value]}
                            onChange={handleOnChange}
                        >
                            {(country: Country) => (
                                <SelectItem key={country.code} textValue={`${country.emoji} ${country.name}`}>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex flex-col">
                                            <span className="text-tiny text-default-400">{`${country.emoji} ${country.name}`}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            )}
                        </Select>
                    </div>
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
        <Table className="min-h-350 h-full">
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
                        <TableRow className={loading ? 'hidden' : ''} key={i}>
                            <TableCell>{item.day}</TableCell>
                            <TableCell>{getWeatherIcon(item.weather)}</TableCell>
                            <TableCell>{item.temp}°C</TableCell>
                            <TableCell>{item.feels_like}°C</TableCell>
                            <TableCell>{item.temp_min}°C</TableCell>
                            <TableCell>{item.temp_max}°C</TableCell>
                            <TableCell>{item.humidity}%</TableCell>
                            <TableCell>{item.pop}%</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}


const DashboardContainer = (props: IDashboardContainerProps) => {
    const weatherService = new WeatherService()
    const [longitude, setLongitude] = useState<number>(DEFAULT_LONGITUDE)
    const [latitude, setLatitude] = useState<number>(DEFAULT_LATITUDE)
    const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY_CODE)
    const [airPollutionGraph, setAirPollutionGraph] = useState({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'category',
            name: 'Days',
            splitLine: { show: false },
        },
        yAxis: {
            type: 'log',
            name: '',
            minorSplitLine: {
                show: false
            }
        },
        series: [
            {
                name: 'Fake Data',
                type: 'line',
                showSymbol: false,
                data: []
            }
        ]
    })
    const [forecastDataTable, setForecastDataTable] = useState<[]>()
    const [forecastDataGraph, setForecastDataGraph] = useState<any>({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['Precipitation', 'Temperature']
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Precipitation',
                position: 'right',
                alignTicks: true,
                offset: 0,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'lightblue'
                    }
                },
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            {
                type: 'value',
                name: '',
                position: 'left',
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'lightgray'
                    }
                },
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ]
    })

    const {
        mutate: getAirPollution,
        isPending: isGetPollutionPending,
    } = useMutation({
        mutationFn: () => {
            return weatherService.getAirPollution({ lat: latitude, lon: longitude, start: '', end: '' })
        },
        onSuccess: (result: any) => {
            proccessDataAirPollution(result)
        },
        onError: () => {
            console.log('error')
        },
    });

    const {
        mutate: getForecast,
        isPending: isForecastPending,
    } = useMutation({
        mutationFn: () => {
            return weatherService.getForecast({ lat: latitude, lon: longitude })
        },
        onSuccess: (result: any) => {
            proccessDataForecast(result)
        },
        onError: () => {
            console.log('error')
        },
    });

    const handleSelectedCountry = (e: any) => {
        setSelectedCountry(e.target.value);
        loadData(e.target.value)
    };

    useEffect(() => loadData(DEFAULT_COUNTRY_CODE), [])

    function loadData(countryCode: String) {
        let country: Country = countries.findLast(country => country.code == countryCode) as any
        if (country) {
            setLatitude(country.latitude)
            setLongitude(country.longitude)
            getAirPollution()
            getForecast()
        }
    }


    const proccessDataForecast = (forecast: any) => {
        let data = forecast?.list || []
        let transformData: any = {}
        data.forEach(({ dt_txt, pop, main, clouds, weather }: any) => {
            let day = getDayOfWeek(dt_txt)
            if (!transformData[day]) {
                transformData[day] = {
                    day,
                    weather,
                    humidity: main.humidity,
                    pop: Math.round(pop * 100),
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
                        transformData[day].pop = Math.round(pop * 100),
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

        let dataGraph: any = {}
        data.forEach((item: any) => {
            Object.keys(item).forEach(key => {
                if (!dataGraph[key]) {
                    dataGraph[key] = [item[key]]
                } else {
                    dataGraph[key].push(item[key])
                }
            })
        })

        let series: any = [
            {
                name: 'Precipitation',
                type: 'line',
                areaStyle: {},
                yAxisIndex: 0,
                data: dataGraph['pop']
            },
            {
                name: 'Temperature',
                type: 'line',
                yAxisIndex: 1,
                data: dataGraph['temp']
            }
        ]

        setForecastDataGraph({
            ...forecastDataGraph,
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: dataGraph['day']
                }
            ],
            series
        })

        setForecastDataTable(data)
    }

    const proccessDataAirPollution = (airPollution: any) => {
        let data = airPollution?.list || []
        let transformData: any = {
            co: [],
            no: [],
            no2: [],
            o3: [],
            so2: [],
            pm2_5: [],
            pm10: [],
            nh3: []
        }

        data.forEach(({ dt, components }: any) => {
            Object.keys(components).forEach(key => {
                transformData[key].push(components[key])
            })
        })

        let series: any = [{
            name: 'no2',
            type: 'line',
            showSymbol: false,
            data: transformData['no2']
        }, {
            name: 'pm10',
            type: 'line',
            showSymbol: false,
            data: transformData['pm10']
        }, {
            name: 'o3',
            type: 'line',
            showSymbol: false,
            data: transformData['o3']
        }, {
            name: 'so2',
            type: 'line',
            showSymbol: false,
            data: transformData['so2']
        }]

        setAirPollutionGraph({
            ...airPollutionGraph,
            series
        })

    }

    return (
        <div>
            {TopSection(selectedCountry, handleSelectedCountry)}
            <div className="flex gap-4 flex-col max-w-[1280px]">
                <div className="flex gap-4">
                    <div className="w-50">
                        <Card>
                            <CardBody>
                                <h6 className="font-bold ml-4 mb-4">Forecast for next five days</h6>
                                {ForecastTable(forecastDataTable, isGetPollutionPending)}
                            </CardBody>
                        </Card>
                    </div>
                    <div className="w-50">
                        <Card className="h-full">
                            <CardBody>
                                <h6 className="font-bold ml-4 mb-4">Graph forecast for next five days</h6>
                                <ReactECharts className="min-h-350 h-full" option={forecastDataGraph} />
                            </CardBody>
                        </Card>

                    </div>
                </div>
                <div>
                    <Card className="h-full">
                        <CardBody>
                            <h6 className="font-bold ml-4 mb-4">Air pollution in the last 3 months</h6>
                            <ReactECharts className="min-h-350 h-full" option={airPollutionGraph} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DashboardContainer