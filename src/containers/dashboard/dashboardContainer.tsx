import { Button, Input } from "@nextui-org/react"
import { MdOutlineBookmark, MdOutlineImageSearch, MdOutlineSearch } from "react-icons/md"

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


    return (
        <div>
            <TopSection />
        </div>
    )
}

export default DashboardContainer