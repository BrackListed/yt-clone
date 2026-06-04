import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

interface CreateMainProps{
    showDashboard: boolean
    setShowDashboard: (value: boolean) => void
    showVideos: boolean
    setShowVideos: (value: boolean) => void
    showAnalytics: boolean
    setShowAnalytics: (value: boolean) => void
}

interface VideosType{
    id: string
    user_id: string
    video_url: string
    title: string
    created_at: string
}

export function CreateMain({showDashboard, setShowDashboard, showVideos, setShowVideos, showAnalytics, setShowAnalytics}: CreateMainProps){
    const [videos, setVideos] = useState<VideosType[]>([])
    const {userId} = useAuth()
    const userVideos = videos.filter((v) => v.user_id === userId)
    useEffect(() => {
        const fetchExpressData = async() => {
            const response = await axios.get("http://localhost:5000/upload")
            setVideos(response.data)
        }
        fetchExpressData()
    }, [])


    return(
        <div className="flex-1 mx-10 pt-10">
            {showDashboard &&<div className="flex flex-col">
                <h1 className="text-3xl font-bold">Channel Dashboard</h1>
                <div className="w-full my-5 max-w-sm bg-[#282828] border border-white/10 rounded-2xl p-6 text-[#f1f1f1] flex flex-col gap-6 font-sans">
                    <h1 className="font-semibold text-2xl">Channel Analytics</h1>
                    <div className="flex flex-col gap-2 border-b border-white/10 pb-5">
                        <span>Current subscribers</span>
                        <span className="text-3xl">0</span>
                    </div>
                    <div className="flex flex-col gap-3 border-b border-white/10 pb-5">
                        <span>Summary</span>
                        <span className="text-sm text-gray-500">Last 28 days</span>
                        <div className="flex justify-between w-full">
                            <span>Views: </span>
                            <span>0</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span>Top Content</span>
                        <span className="text-sm text-gray-500">Last 48 hours · Views</span>
                        <button onClick={() => {setShowDashboard(false); setShowAnalytics(true); setShowVideos(false)}} className="my-5 p-3 bg-neutral-700 rounded-full hover:cursor-pointer hover:brightness-90">Go to channel analytics</button>
                    </div>
                </div>
            </div>}
            {showVideos && <div className="flex flex-col">
                <div className="flex flex-col border-b border-white/10">
                    <h1 className="text-3xl font-bold">Channel Content</h1>
                    <div className="relative pb-3 font-medium text-white cursor-pointer w-fit mt-10">Videos
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
                    </div>
                </div>
                <div className="flex">
                    <div id = "video-column" className="w-7/12 flex flex-col">
                        <span className="flex items-center border-b h-12 border-white/10 text-sm text-gray-500">Video</span>
                        <div className="flex gap-5">
                            <div className="relative w-40 h-25 my-2 shrink-0">
                                <img src = "/esquie.jpg" className="w-full h-full rounded-lg object-cover"></img>
                                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm">0:52</span>
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <span>Video Title Placeholder</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                
                    <div id = "date-column" className="flex flex-col w-1/6">
                        <span className="flex items-center border-b h-12 border-white/10 text-sm text-gray-500">Date <ChevronDown/></span>
                        <div className="flex flex-col gap-2 h-25 my-2 justify-center">
                            <span>June 4, 2026</span>
                            <span className="text-sm text-gray-600">Date Uploaded</span>
                        </div>
                    </div>

                    <div id = "views-column" className="flex flex-col w-1/12">
                        <span className="flex items-center justify-center border-b h-12 border-white/10 text-sm text-gray-500">Views</span>
                        <div className="flex flex-col gap-2 h-25 justify-center items-center">
                            <span>0</span>
                        </div>
                    </div>

                    <div id = "comments-column" className="flex flex-col w-1/12">
                        <span className="flex items-center justify-center border-b h-12 border-white/10 text-sm text-gray-500">Comments</span>
                        <div className="flex flex-col gap-2 h-25 justify-center items-center">
                            <span>0</span>
                        </div>
                    </div>

                    <div id = "likes-column" className="flex flex-col w-1/12">
                        <span className="flex items-center justify-center border-b h-12 border-white/10 text-sm text-gray-500">Likes</span>
                        <div className="flex flex-col gap-2 h-25 justify-center items-center">
                            <span>0</span>
                        </div>
                    </div>
                </div>

            </div>}

            {showAnalytics && <div>WIP</div>}
        </div>
    )
}