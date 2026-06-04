import { ClerkProvider, UserButton } from "@clerk/clerk-react";
import { SiYoutube } from "@icons-pack/react-simple-icons";
import { Search, TextAlignJustify, UploadIcon, Video, X } from "lucide-react";
import { useState } from "react";
import axios from "axios"
import { CreateLeft } from "../assets/CreateLeft";
import { CreateMain } from "../assets/CreateMain";


export function Create(){
    const [toggleUpload, setToggleUpload] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showDashboard, setShowDashboard] = useState(true)
    const [showVideos, setShowVideos] = useState(false)
    const [showAnalytics, setShowAnalytics] = useState(false)
    return(
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <div className="bg-neutral-800 text-[#f1f1f1] min-h-screen font-sans flex flex-col selection:bg-zinc-700">
            {showModal && <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl h-[80vh] bg-[#282828] border border-zinc-700 rounded-xl flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <span className="text-xl font-medium">Upload videos</span>
                        <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-700 rounded-full transition-colors"><X/></button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                        <div className="w-36 h-36 bg-neutral-900/50 rounded-full flex items-center justify-center border border-zinc-800">
                            <UploadIcon size={48} className="text-zinc-400" />
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-zinc-200">Drag and drop video files to upload</p>
                            <p className="text-xs text-zinc-500 mt-1">Your videos will be private until you publish them.</p>
                        </div>
                        <label className="bg-white hover:bg-zinc-200 text-black font-medium text-sm px-5 py-2.5 rounded-full hover:cursor-pointer transition-colors shadow-md">
                            <input type="file" accept="video/*" className="hidden" onChange={uploadVideo}></input>
                            Select File
                        </label>
                    </div>
                </div>
            </div>}
            <div className="h-14 bg-neutral-800 shadow-[0_1px_8px_rgba(0,0,0,0.6)] flex items-center justify-between px-6 fixed top-0 w-full z-50">
                <div className="flex gap-8 items-center">
                    <TextAlignJustify/>
                    <span className="flex gap-2 items-center"><SiYoutube size={40} className="text-red-600"/><span className="font-semibold text-2xl">Studio</span></span>
                </div>
                <div className="relative w-2xl">
                    <div className="flex gap-2 rounded-full w-full h-10 p-2 bg-neutral-900 hover:border-2 border-zinc-50">
                        <Search/>
                        <input placeholder="Search across your channel" className="outline-none flex-1"></input>
                    </div>
                </div>
                <div className="flex gap-5 items-center">
                    <div onClick={() => setToggleUpload(!toggleUpload)} className="relative hover:bg-neutral-700 hover:cursor-pointer flex gap-2 rounded-full bg-neutral-800/10 p-2 border-2 border-white/10">
                        <Video/> <span>Create</span>
                    </div>
                    {toggleUpload && <div className="absolute right-0 top-12 w-48 bg-[#282828] border border-zinc-700 rounded-xl shadow-2xl py-2 z-50 text-sm font-medium text-zinc-200">
                        <button onClick={() => {setShowModal(true); setToggleUpload(false)}} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-700 hover:cursor-pointer transition-colors text-left">
                            <UploadIcon/> <span>Upload Videos</span>
                        </button>
                    </div>}
                    <UserButton appearance={{elements: {avatarBox: {width: "40px",height: "40px"}}}}/>
                </div>
            </div>
            <div className="pt-14 flex w-screen">
                <CreateLeft
                showDashboard = {showDashboard}
                setShowDashboard = {setShowDashboard}
                showVideos = {showVideos}
                setShowVideos = {setShowVideos}
                showAnalytics = {showAnalytics}
                setShowAnalytics = {setShowAnalytics}
                />
                <CreateMain
                showDashboard = {showDashboard}
                setShowDashboard = {setShowDashboard}
                showVideos = {showVideos}
                setShowVideos = {setShowVideos}
                showAnalytics = {showAnalytics}
                setShowAnalytics = {setShowAnalytics}
                />
            </div>
        </div>
        </ClerkProvider>
    )

    async function uploadVideo(e: React.ChangeEvent<HTMLInputElement>){
        const video = e.target.files![0]
        const formData = new FormData()
        formData.append("video", video)
        await axios.post("http://localhost:5000/upload", formData) 
    }
}