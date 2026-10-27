import { Metadata } from "next"
import {Inter, Instrument_Serif,   JetBrains_Mono} from "next/font/google"
import "./globals.css"

const display = Instrument_Serif({
  weight:"400",
  subsets:["latin"],
  variable:"--nf-display",
})

const system = JetBrains_Mono({
  subsets:["latin"],
  variable:"--nf-system",
})

const body = Inter({
  subsets:["latin"],
  variable:"--nf-body"
})

export const metadata:Metadata={
  title:"Portfolio Admin",
  description:"Private control panel for the portfolio",
  robots:{index:false,follow:false}
}

export default function RootLayout({
  children,
}:Readonly<{children:React.ReactNode}>){
  return(
    <html lang="en" className={`${display.variable} ${system.variable} ${body.variable}`}>
      <body className="font-body antialised">{children}</body>
    </html>
  )
}