import { Link, useParams } from "react-router-dom"
import { Left } from "../assets/Left"
import { Header } from "../assets/Header"
import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ThumbsDown, ThumbsUp, Undo2, UserMinus } from "lucide-react"

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

export function Watch(){
    const {id} = useParams()
    const {userId} = useAuth()
    const [hideSide, setHideSide] = useState(true)
    const {getToken, isLoaded} = useAuth()
    const [videos, setVideos] = useState<VideosType[]>([])
    const [users, setUsers] = useState<UserType[]>([])
    const selectedVideo = videos.find((v) => v.id === id)
    const selectedUser = users.find((user) => user.id === selectedVideo?.user_id)
    const [subscriptionData, setSubscriptionData] = useState<UserType[]>([])
    const [alreadySubscribed, setAlreadySubscribed] = useState(false)
    const [subscriptionPopup, setSubscriptionPopup] = useState(false)
    const [hasLikedVideo, setHasLikedVideo] = useState(false)
    useEffect(() => {
        const fetchExpressData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/global/upload", {headers: {Authorization: `Bearer ${token}`}})
            setVideos(result.data)
        }
        const fetchUserData = async() => {
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/users", {headers: {Authorization: `Bearer ${token}`}})
            setUsers(result.data)
        }
        const fetchSubscriptionData = async() => {
            if(!isLoaded) return 
            const token = await getToken()
            const result = await axios.get("http://localhost:5000/subscriptions/channel", {headers: {Authorization: `Bearer ${token}`}})
            setSubscriptionData(result.data)
        }
        const fetchSubscriptionStatus = async() => {
            if(!selectedUser) return 
            const token = await getToken()
            const response = await axios.get(`http://localhost:5000/subscribe/status/${selectedUser.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setAlreadySubscribed(response.data)
        }
        const fetchLikedStatus = async() => {
            if(!selectedUser) return
            const token = await getToken()
            const response = await axios.get(`http://localhost:5000/likes/status/${userId}/${selectedVideo!.id}`, {headers: {Authorization: `Bearer ${token}`}})
            setHasLikedVideo(response.data)
        }
        fetchUserData()
        fetchExpressData()
        fetchSubscriptionData()
        fetchSubscriptionStatus()
        fetchLikedStatus()
    }, [selectedUser])
    return(
        <div className="flex">
            {hideSide === false &&<div className="fixed left-[16.67%] inset-y-0 right-0 bg-black/50 z-40"></div>}
            <Left
            hideSide = {hideSide}
            setHideSide = {setHideSide}
            />
            <div className="flex flex-col w-screen h-screen">
                <div className="mt-8">
                    <Header
                    hideSide = {hideSide}
                    setHideSide={setHideSide}
                    />
                </div>
                <div className="mx-3 flex gap-5">
                    <div className="flex flex-col gap-3 w-8/12 h-full">
                        <video src = {selectedVideo?.video_url} className="bg-black rounded-2xl w-full h-120" controls autoPlay></video>
                            <div className="flex flex-col gap-3">
                            <span className="font-semibold text-2xl">"{selectedVideo?.title}"</span>
                            <div className="flex justify-between w-9/12">
                                <div className="flex gap-5">
                                    <Link to = {`/@/${selectedUser?.username}`}><img src = {selectedUser?.image_url} className="w-12 h-12 rounded-full"></img></Link>
                                    <div className="flex flex-col">
                                        <Link to = {`/@/${selectedUser?.username}`}><span className="font-semibold">{selectedUser?.username}</span></Link>
                                        <span className="text-sm text-gray-400">{subscriptionData.length} subscribers</span>
                                    </div>
                                    {alreadySubscribed === false && <button onClick={() => handleSubscription(userId, selectedUser!.id)} className="mx-5 font-semibold hover:cursor-pointer hover:brightness-90 text-black p-2 w-30 h-12 rounded-full bg-white">Subscribe</button>}
                                    <div className="relative">
                                        {alreadySubscribed && <button onClick={() => setSubscriptionPopup(!subscriptionPopup)} className="mx-5 flex gap-3 font-semibold text-white items-center py-2 px-3 w-35 h-12 rounded-full bg-neutral-700 hover:brightness-90 hover:cursor-pointer">Subscribed <ChevronDown/></button>}
                                        {subscriptionPopup && <div className="absolute bg-neutral-800 rounded-xl shadow-lg py-2 w-44 z-50 mt-2">
                                            <button onClick={() => handleUnsubscribe(userId, selectedUser!.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-600 hover:cursor-pointer transition-colors text-left text-sm"><UserMinus size={16}/>Unsubscribe</button>
                                        </div>}
                                    </div>
                                </div>
                                <div className="bg-white/20 flex rounded-2xl gap-3 p-1 w-fit justify-center">
                                    <button onClick={() => handleLikes(userId, selectedVideo?.id)} className="flex gap-3 items-center px-2 hover:bg-white/15 rounded-lg hover:cursor-pointer"><ThumbsUp className={`${hasLikedVideo ? "text-white fill-white" : ""}`}/>{selectedVideo?.likes}</button>
                                    <button onClick={() => handleDislikes(userId, selectedVideo?.id)} className="flex gap-3 items-center px-2 hover:bg-white/15 rounded-lg hover:cursor-pointer"><ThumbsDown/>0</button>
                                </div>
                                <button className="flex gap-3 items-center w-40 bg-white/20 px-2 hover:bg-white/15 rounded-lg hover:cursor-pointer"><Undo2/>Share</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button className="text-black flex gap-3 items-center w-20 h-10 justify-center bg-white px-2 hover:bg-white/15 rounded-lg hover:cursor-pointer">All</button>
                        <div className="flex flex-col h-fit w-full">
                            {videos.map((video) => {
                                const selectedUser = users.find((user) => user.id === video.user_id)
                                return(
                                <Link to = {`/watch/${video.id}`}><div className="flex gap-3 my-2">
                                    <img src = {video.thumbnail} className="w-60 h-40 rounded-2xl"></img>
                                    <div className="flex flex-col gap-2">
                                        <span>{video.title}</span>
                                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                                            <span>{selectedUser?.username}</span>
                                            <span>0 views • {timeAgo(video.created_at)}</span>
                                        </div>
                                    </div>
                                </div></Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    function handleSubscription(userId: string | null | undefined, channelId: string){
        axios.post(`http://localhost:5000/subscribe/${userId}`, {channelId: channelId})
    }

    function handleUnsubscribe(userId: string | null | undefined, channelId: string){
        axios.post(`http://localhost:5000/unsubscribe/${userId}`, {channelId: channelId})
        setSubscriptionPopup(false)
    }

    function handleLikes(userId: string | null | undefined, videoId: string | null | undefined){
        axios.post(`http://localhost:5000/likes/${userId}`, {videoId: videoId})
    }

    function handleDislikes(userId: string | null | undefined, videoId: string | null | undefined){
        axios.post(`http://localhost:5000/dislikes/${userId}`, {videoId: videoId})
    }

    function timeAgo(date:string){
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