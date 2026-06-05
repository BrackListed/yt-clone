import { useParams } from "react-router-dom"
import { Left } from "../assets/Left"
import { Header } from "../assets/Header"
import { ClerkProvider } from "@clerk/clerk-react"
import { useState } from "react"

export function Watch(){
    const {id} = useParams()
    const [hideSide, setHideSide] = useState(true)
    return(
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
            <div className="flex">
                {hideSide === false &&<div className="fixed left-[16.67%] inset-y-0 right-0 bg-black/50 z-40"></div>}
                <Left
                hideSide = {hideSide}
                setHideSide={setHideSide}
                />
                <div className="flex flex-col w-screen h-screen">
                    <div className="mt-8">
                        <Header/>
                    </div>
                    <div className="mx-3 flex gap-5">
                        <div className="flex flex-col gap-3 w-full h-full">
                            <video src = "" className="w-8/12 h-120" controls autoPlay></video>
                        </div>
                    </div>
                </div>
            </div>
        </ClerkProvider>
    )
}