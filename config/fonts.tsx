import { Playfair_Display } from "next/font/google";

export const headingFont = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-heading",
});