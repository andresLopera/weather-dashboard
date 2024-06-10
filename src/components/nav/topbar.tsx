import FormatDate from "@/lib/utils/formatDate"

function TopBarComponent() {

    return (
        <div className="flex">
            <div>
                <h6 className="text-2xl font-bold">Hello, Warren</h6>
                <p className="">{FormatDate(new Date())}</p>
            </div>
        </div>
    )
}

export default TopBarComponent