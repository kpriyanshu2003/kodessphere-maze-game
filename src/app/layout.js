import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maze Adventure Game",
  description: "A fun maze game with multiple levels and challenges",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#000",
              border: "#0056ff",
              borderRadius: "10px",
              borderWidth: "2px",
              borderStyle: "solid",
              fontFamily: "monospace",
              color: "#fff",
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
