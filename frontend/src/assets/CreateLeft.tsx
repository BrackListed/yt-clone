import { UserButton, useUser } from "@clerk/clerk-react";
import { BarChart2, LayoutDashboard, PlaySquare } from "lucide-react";


export function CreateLeft(){
    const {user} = useUser()
    return(
    <div className="pt-14 w-full h-screen overflow-y-auto">
        <div className="flex flex-col p-5 border-r-2 border-white/10 w-2/12 h-full">
            <div className="flex w-full flex-col gap-5 items-center"><UserButton appearance={{elements: {avatarBox: {width: "120px",height: "120px"}}}}/>
                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold">Your Channel</h1>
                    <span className="text-sm text-center text-zinc-400">{user?.username}</span>
                </div>
            </div>
            <div className="flex flex-col gap-3 py-2">
                <div className="flex gap-2 hover:cursor-pointer hover:bg-neutral-900 px-2 py-3 rounded-lg "><LayoutDashboard/>Dashboard</div>
                <div className="flex gap-2 hover:cursor-pointer hover:bg-neutral-900 px-2 py-3 rounded-lg "><PlaySquare/>Your Videos</div>
                <div className="flex gap-2 hover:cursor-pointer hover:bg-neutral-900 px-2 py-3 rounded-lg "><BarChart2/>Analytics</div>
            </div>
        </div>
    </div>
    )
}