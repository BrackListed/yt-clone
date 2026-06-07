
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Left } from "../assets/Left"
import { Header } from "../assets/Header"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

interface VideosType{
    id: string
    user_id: string
    video_url: string
    title: string
    duration: string
    thumbnail: string
    created_at: string
    likes: number
}

interface UserType {
    id: string
    clerk_user_id: string
    email: string
    username: string
    created_at: string
    image_url: string
}

export function Channel(){
    const {userId} = useAuth()
    const [hideSide, setHideSide] = useState(true)
    const [globalVideos, setGlobalVideos] = useState<VideosType[]>([])
    const {username} = useParams()
    const [globalUsers, setGlobalUsers] = useState<UserType[]>()
    const user = globalUsers?.find((user) => user.username === username)
    const channelUserId = user?.id
    const videos = globalVideos.filter((videos) => videos.user_id === channelUserId )
    const [subscriptionData, setSubscriptionData] = useState<UserType[]>([])
    const {getToken} = useAuth()
    useEffect(() => {
        const fetchVideoData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/global/upload", {headers: {Authorization: `Bearer ${token}`}})
            setGlobalVideos(result.data)
        }
        const fetchUserData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/users", {headers: {Authorization: `Bearer ${token}`}})
            setGlobalUsers(result.data)
        }
        const fetchSubscriptionData = async() => {
            const token = await getToken()
            const response = await axios.get("http://localhost:5000/subscriptions/channel", {headers: {Authorization: `Bearer ${token}`}})
            setSubscriptionData(response.data)
        }
        fetchVideoData()
        fetchUserData()
        fetchSubscriptionData()
    }, [])
    return(
        <div className="flex">
            <Left
            hideSide = {hideSide}
            setHideSide = {setHideSide}
            />
            <div className="flex flex-col w-screen h-screen">
                <Header
                hideSide = {hideSide}
                setHideSide={setHideSide}
                />
                <div className={`flex-1 flex flex-col p-10 h-screen ml-5 ${hideSide ? "": "pl-[16.67%]"}`}>
                    <img src="/bannerexample.png" className="h-60 w-10/12 rounded-lg object-cover object-center bg-zinc-800" alt="Channel Banner"></img>
                    <div className="mt-10 w-full gap-5 flex ">
                        <img className="rounded-full w-40 h-40" src = {user?.image_url}></img>
                        <div className="flex flex-col gap-3">
                            <span className="text-4xl text-zinc-50 font-bold">{user?.username}</span>
                            <div className="flex gap-1">
                                <span className="text-zinc-50 font-semibold">@{user?.username}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">{subscriptionData.length} subscribers</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">{videos.length} videos</span>
                            </div>
                            <div className="text-gray-400 w-fit h-fit">Description!</div>
                            <button onClick={() => handleSubscription(userId, user!.id)} className="w-25 p-2 h-10 font-semibold text-black rounded-full bg-white hover:bg-white/90 hover:cursor-pointer">Subscribe</button>
                        </div>
                    </div>
                    <div className="w-full border-b border-white/10">
                        <span className="mt-10 text-zinc-50 flex flex-col pb-3 w-fit border-b-3 border-b-zinc-50">Videos</span>
                    </div>
                    <div className="flex gap-10 flex-wrap mt-5">
                        {videos.map((video) => (<Link to = {`/watch/${video.id}`}><div className="flex flex-col">
                            <img className="w-95 h-60 rounded-2xl overflow-hidden" src = {video.thumbnail}></img>
                            <span className="font-semibold">{video.title}</span>
                            <div className="flex gap-3 text-gray-400">
                                <span>0 views</span>
                                <span>•</span>
                                <span>{calculateDate(video.created_at)}</span>
                            </div>
                        </div></Link>))}
                    </div>
                </div>
            </div>
        </div>
    )

    function handleSubscription(userId: string | null | undefined, channelId: string){
        axios.post(`http://localhost:5000/subscribe/${userId}`, {channelId: channelId})
    }
    function calculateDate(date: string){
        const differenceInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
        const differenceInMinutes = Math.floor(differenceInSeconds/60) //if theres 7.2k seconds, 7.2k / 60 = 120 minutes
        const differenceInHours = Math.floor(differenceInMinutes / 60)
        const differenceInDays = Math.floor(differenceInHours / 24)
        const differenceInMonths = Math.floor(differenceInDays/30)
        const differenceInYears = Math.floor(differenceInMonths / 12)
        if(differenceInSeconds < 60) return `${differenceInSeconds} seconds ago`
        if(differenceInMinutes < 60) return `${differenceInMinutes} minutes ago`
        if(differenceInHours < 24) return `${differenceInHours} hours ago`
        if(differenceInDays < 30) return `${differenceInDays} days ago`
        if(differenceInMonths < 12) return `${differenceInMonths} months ago`
        return `${differenceInYears} years ago`
    }
}