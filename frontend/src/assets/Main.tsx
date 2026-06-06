import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { Header } from "./Header";

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

interface MainProps{
    hideSide: boolean
    setHideSide: (value: boolean) => void
}

export function Main({hideSide, setHideSide}: MainProps){
    const [videos, setVideos] = useState<VideosType[]>([])
    const [users, setUsers] = useState<UserType[]>([])
    const {getToken} = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchExpressData = async() => {
            const token = getToken()
            const result = await axios.get("http://localhost:5000/global/upload", {headers: {Authorization: `Bearer ${token}`}})
            setVideos(result.data)
        }
        fetchExpressData()
    }, [])

    useEffect(() => {
        const fetchExpressData = async() => {
            const token = getToken()
            const result = await axios.get("http://localhost:5000/users", {headers: {Authorization: `Bearer ${token}`}})
            setUsers(result.data)
        }
        fetchExpressData()
    }, [])
    return(
        <div className="flex-1 w-full h-full py-1">
            <Header
            hideSide = {hideSide}
            setHideSide = {setHideSide}
            />
            <div className="my-3 flex gap-5 px-10 flex-col overflow-y-auto">
                <button className="text-zinc-900 bg-white/90 px-5 py-3 rounded-lg font-semibold w-20">All</button>
                <div className="my-5 flex gap-8 w-full h-full">
                    {videos.map((video) => {
                    const uploader = users.find((user) => user.id === video.user_id)
                    return(<div className="flex w-90 flex-col hover:cursor-pointer">
                        <div className="w-90 h-52 rounded-2xl overflow-hidden">
                            <Link to = {`/watch/${video.id}`}><img src = {video.thumbnail} className="w-full h-full object-cover" alt = "thumbnail"></img></Link>
                        </div>
                        <div className="flex gap-3 my-5">
                            <img onClick={() => navigate(`/@/${uploader?.username}`)} src = {uploader?.image_url} alt = "profile picture" className="w-10 h-10 rounded-full"></img>
                            <div className="flex flex-col">
                                <Link to = {`/watch/${video.id}`}>{video.title}</Link>
                                <span onClick={() => navigate(`/@/${uploader?.username}`)} className="text-sm text-gray-500 hover:text-white transition-colors">{uploader?.username}</span>
                                <span className="text-sm text-gray-500">0 Views • {timeAgo(video.created_at)}</span>
                            </div>
                        </div>
                    </div>)
                    })}
                </div>
            </div>
        </div>
    )

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