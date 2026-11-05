import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

// Shared by every Glass page so the type is identical everywhere.
export const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-sans", display: "swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });
export const fontVars = `${sans.variable} ${mono.variable}`;
