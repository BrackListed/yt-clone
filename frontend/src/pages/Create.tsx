import { ClerkProvider, UserButton } from "@clerk/clerk-react";
import { SiYoutube } from "@icons-pack/react-simple-icons";
import { Search, TextAlignJustify, Video } from "lucide-react";


export function Create(){
    return(
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <div className="bg-neutral-800 text-[#f1f1f1] min-h-screen font-sans flex flex-col selection:bg-zinc-700">
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
                    <div className="flex gap-2 rounded-full bg-neutral-800/10 p-2 border-2 border-white/10">
                        <Video/> <span>Create</span>
                    </div>
                    <UserButton appearance={{elements: {avatarBox: {width: "40px",height: "40px"}}}}/>
                </div>
            </div>
        </div>
        </ClerkProvider>
    )
}