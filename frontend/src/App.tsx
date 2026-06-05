import { ClerkProvider } from "@clerk/clerk-react";
import { Left } from "./assets/Left";
import { Main } from "./assets/Main";
import { useState } from "react";

export default function App(){
  const [hideSide, setHideSide] = useState(false)
  return(
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <div>
      <div className="w-screen h-screen flex">
        <Left
        hideSide = {hideSide}
        setHideSide={setHideSide}
        />
        <div className="flex-1 flex justify-center pl-[16.67%]">
          <div className=" border-2 border-zinc-900 h-full w-full">
            <Main
            hideSide = {hideSide}
            setHideSide={setHideSide}
            />
          </div>
        </div>
      </div>
    </div>
    </ClerkProvider>
  )
}