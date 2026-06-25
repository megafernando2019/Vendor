"use client"
import "@/styles/index";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { poppins } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning={isDev}>
      <head>
        <meta name="keywords" content="Tourex - Tour & Travel Booking React Next js Template" />
        <meta name="description" content="Tourex is a Modern Tour & Travel Booking React Next js Template. It is perfect for travel businesses of all kinds. Tourex boasts a unique and intuitive search function that is ideal for tour operators, adventure companies, and holiday booking websites alike, as well as hotel booking, plane ticket booking, car rental, and property rental. It’s easy and quick to launch a professional and cost-effective travel website." />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* For IE  */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
