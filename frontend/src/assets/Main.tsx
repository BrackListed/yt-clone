import { SignIn, SignUp, useAuth, UserButton } from "@clerk/clerk-react";
import { Bell, Mic, Plus, Search } from "lucide-react";
import { useState } from "react";

export function Main(){
    const {isSignedIn} = useAuth()
    const [toggleSignIn, setToggleSignIn] = useState(false)
    const [toggleSignUp, setToggleSignUp] = useState(false)
    return(
        <div className="flex-1 w-full h-full py-1">
            <div className="h-1/12 flex justify-center items-center">
                <div className=" rounded-full flex w-1/2">
                    <input placeholder="Search" className="ring-inset border-2 h-10 bg-neutral-900 border-gray-500/5 flex-1 py-2 px-4 rounded-l-full outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded-r-none"></input>
                    <div className="bg-neutral-800 p-3 rounded-r-full flex items-center h-10"><Search/></div>
                </div>
                <div className="p-3 bg-neutral-800 mx-3 rounded-full h-10 flex items-center"><Mic/></div>
                <div className="flex mx-10 h-full items-center">
                    <div className="flex bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 gap-2 hover:cursor-pointer"><Plus/>Create</div>
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
        </div>
    )
}