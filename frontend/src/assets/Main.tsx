import { SignIn, SignUp, useAuth, UserButton } from "@clerk/clerk-react";
import { Bell, Mic, Plus, Search, SquarePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export function Main(){
    const {isSignedIn} = useAuth()
    const [toggleSignIn, setToggleSignIn] = useState(false)
    const [toggleSignUp, setToggleSignUp] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [videos, setVideos] = useState<VideosType[]>([])
    const [users, setUsers] = useState<UserType[]>([])
    const {getToken} = useAuth()

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
            <div className="h-1/12 flex justify-center items-center">
                <div className=" rounded-full flex w-1/2">
                    <input placeholder="Search" className="ring-inset border-2 h-10 bg-neutral-900 border-gray-500/5 flex-1 py-2 px-4 rounded-l-full outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded-r-none"></input>
                    <div className="bg-neutral-800 p-3 rounded-r-full flex items-center h-10"><Search/></div>
                </div>
                <div className="p-3 bg-neutral-800 mx-3 rounded-full h-10 flex items-center"><Mic/></div>
                <div className="flex mx-10 h-full items-center">
                    <div className="relative">
                        <div onBlur={() => setShowUpload(false)} onClick={() => {if(!showUpload){setShowUpload(true)} else{setShowUpload(false)}}} className="flex bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 gap-2 hover:cursor-pointer"><Plus/>Create</div>
                        {showUpload && <div className="absolute top-12 right-0 bg-neutral-800 rounded-xl shadow-lg p-2 flex flex-col gap-1 w-44 z-50">
                                <Link to = "/create"><div className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-700 rounded-lg cursor-pointer"><SquarePlay/>Upload video</div></Link>
                            </div>}
                    </div>
                    <div className="relative mx-4 hover:bg-neutral-700 hover:cursor-pointer rounded-full p-2"><Bell/><span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">1</span></div>
                    {isSignedIn === false && <button onClick = {() => setToggleSignIn(true)}className="bg-blue-600 hover:bg-blue-700 text-white h-10 font-medium p-2 rounded transition-colors">Sign In</button>}
                    {isSignedIn === false && <button onClick = {() => setToggleSignUp(true)}className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 h-10 font-medium p-2 flex-1 rounded transition-colors">Sign Up</button>}
                    {isSignedIn && <div className="flex gap-2 items-center justify-start">
                    <UserButton appearance={{ elements: { avatarBox: { width: "40px", height: "40px" } } }} />
                    </div>}
                </div>
                {(toggleSignIn || toggleSignUp) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    {toggleSignIn && <div className="relative flex w-screen h-screen items-center justify-center bg-black/60 backdrop-blur-sm">
                        <button onClick={() => setToggleSignIn(false)}className="hover:cursor-pointer absolute top-4 right-4 z-10 text-xl font-sans font-bold text-zinc-400 hover:text-zinc-600 transition-colors">×</button>
                        <SignIn/>
                    </div>}
                    {toggleSignUp && <div className="relative flex w-screen h-screen items-center justify-center bg-black/60 backdrop-blur-sm">
                        <button onClick={() => setToggleSignUp(false)} className="hover:cursor-pointer absolute top-4 right-4 z-10 text-xl font-sans font-bold text-zinc-400 hover:text-zinc-600 transition-colors">×</button>
                        <SignUp/>
                    </div>}
                </div>}
            </div>
            
            <div className="my-3 flex gap-5 px-10 flex-col overflow-y-auto">
                <button className="text-zinc-900 bg-white/90 px-5 py-3 rounded-lg font-semibold w-20">All</button>
                <div className="my-5 flex gap-8 w-full h-full">
                    {videos.map((video) => {
                    const uploader = users.find((user) => user.id === video.user_id)
                    return(
                    <Link to = {`watch/${video.id}`}><div className="flex w-90 flex-col hover:cursor-pointer">
                        <div className="w-90 h-52 rounded-2xl overflow-hidden">
                            <img src = {video.thumbnail} className="w-full h-full object-cover" alt = "thumbnail"></img>
                        </div>
                        <div className="flex gap-3 my-5">
                            <img src = {uploader?.image_url} alt = "profile picture" className="w-10 h-10 rounded-full"></img>
                            <div className="flex flex-col">
                                {video.title}
                                <span className="text-sm text-gray-500">{uploader?.username}</span>
                                <span className="text-sm text-gray-500">0 Views • {timeAgo(video.created_at)}</span>
                            </div>
                        </div>
                    </div></Link>)
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