import { useAuth } from "@clerk/clerk-react";
import { SiYoutube, SiYoutubegaming, SiYoutubekids, SiYoutubemusic, SiYoutubeshorts } from "@icons-pack/react-simple-icons";
import axios from "axios";
import { ChevronDown, ChevronRight, ChevronUp, Clapperboard, Clock, Download, Flag, History, Home, ListVideo, Music, Newspaper, Shirt, SquarePlay, TextAlignJustify, ThumbsUp, Trophy, UserSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



interface LeftProps{
    hideSide: boolean
    setHideSide: (value: boolean) => void
}

interface UserType {
    id: string
    clerk_user_id: string
    email: string
    username: string
    created_at: string
    image_url: string
}

export function Left({hideSide, setHideSide}: LeftProps){
    const [moreExplore, setMoreExplore] = useState(false)
    const {getToken} = useAuth()
    const [subscriptions, setSubscriptions] = useState<UserType[]>([])
    useEffect(() => {
        const fetchExpressData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/subscriptions/user", {headers: {Authorization: `Bearer ${token}`}})
            setSubscriptions(result.data)
        }
        fetchExpressData()
    }, [])
    return(
        <div className={`fixed h-screen overflow-y-auto flex flex-col z-50 ${hideSide ? "w-fit" : "w-2/12 bg-zinc-900"}`}>
            <div className="h-1/12 flex items-center px-2 py-1 gap-5"><div className="hover:bg-zinc-600 p-2 rounded-full hover:cursor-pointer" onClick={() => {if(hideSide === false){setHideSide(true)} else{setHideSide(false)}}}>{hideSide === false && <TextAlignJustify/>}</div>{hideSide === false && <Link to = "/"><img className="w-34 h-auto" src = "/icon.png" alt = "youtube-icon"></img></Link>}</div>
            {hideSide === false &&<div className="flex flex-col gap-5 px-4">
                    <div className="flex flex-col gap-4 border-b border-zinc-800 py-5">
                        <Link to = "/"><div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Home/>Home</div></Link>
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><SiYoutubeshorts/>Shorts</div> 
                    </div>
                    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5">
                        <div className="flex gap-2 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm">Subscriptions <ChevronRight/> </div>
                        {subscriptions.map((subscription) => (
                            <div className="flex gap-2 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><img className="rounded-full w-6 h-6" src = {subscription.image_url} alt = {`Image icon of subscription ${subscription.username}`}></img> <span>{subscription.username}</span></div>
                        ))}
                        <div className="flex gap-4 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><ChevronDown/>Show More</div>
                    </div>
                    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5">
                        <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm">You <ChevronRight/></div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><UserSquare/>Your Channel</div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><History/>History</div>
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><ListVideo/>Your Playlist</div>  
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Clock/>Watch Later</div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><ThumbsUp/>Liked Videos</div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><SquarePlay/> Your Videos</div>
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Download/>Downloads</div>
                    </div>
                    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5">
                        <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Music/>Music</div> 
                        <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Clapperboard/>Movies</div> 
                        <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><SiYoutubegaming/>Gaming</div>
                        {moreExplore && <div className="gap-3 flex flex-col">
                            <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Newspaper/>News</div>
                            <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Trophy/>Sports</div>
                            <div className="flex gap-3 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Shirt/>Fashion & Beauty</div>
                            </div>}
                        {moreExplore === false && <div onClick={() => setMoreExplore(true)} className="flex gap-4 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><ChevronDown/>Show More</div>}
                        {moreExplore === true && <div onClick={() => setMoreExplore(false)} className="flex gap-4 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><ChevronUp/>Show Less</div>}
                    </div>
                    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5">
                        <div className="flex font-semibold hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm">More from YouTube</div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><SiYoutube className="text-red-600"/>Youtube Premium</div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><SiYoutubemusic className="text-red-600"/>Youtube Music</div> 
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><SiYoutubekids className="text-red-600"/>Youtube Kids</div> 
                    </div>
                    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5">
                        <div className="flex gap-5 hover:cursor-pointer hover:bg-zinc-700 hover:ring-8 hover:ring-zinc-700 rounded-sm"><Flag/>Report History</div> 
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-600 italic">©2026 Google LLC</span>
                        <span className="text-sm text-gray-600 italic">Clone by BrackListed</span>
                    </div>
            </div>}
            {hideSide && <div className="flex flex-col gap-5">
                    
            </div>}

        </div>
    )
}