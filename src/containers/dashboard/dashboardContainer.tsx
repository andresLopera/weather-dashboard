'use client'

import { Button, Card, CardBody, Input } from "@nextui-org/react"
import { MdOutlineBookmark, MdOutlineImageSearch, MdOutlineSearch } from "react-icons/md"
import { useMutation } from '@tanstack/react-query';
import WeatherService from "@/services/weatherService";
import { useEffect, useState } from "react";

interface IDashboardContainerProps {

}

const TopSection = () => {
    return (
        <div className='flex justify-between'>
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


const DashboardContainer = (props: IDashboardContainerProps) => {
    const weatherService = new WeatherService()
    const [airPollution, setAirPollution] = useState({})
    const [forecast, setForecast] = useState({})

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
        onSuccess: (result) => {
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
        </div>
    )
}

export default DashboardContainer