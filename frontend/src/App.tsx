import { ClerkProvider } from "@clerk/clerk-react";
import { Left } from "./assets/Left";
import { Main } from "./assets/Main";

export default function App(){
  return(
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <div>
      <div className="w-screen h-screen flex">
        <Left/>
        <div className="flex-1 flex justify-center">
          <div className=" border-2 border-zinc-900 h-full w-full">
            <Main/>
          </div>
        </div>
      </div>
    </div>
    </ClerkProvider>
  )
}