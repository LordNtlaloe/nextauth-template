"use client"

import { useRouter } from "next/navigation"

interface LoginButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect"
    asChild?: boolean
}

export default function LoginButton({ children, mode = "redirect", asChild }: LoginButtonProps) {
    const router = useRouter();
    const onClick = () =>{
        router.push("/sign-in")
    }
    if(mode === "modal"){
        return(
            <span>
                TO DO Implement Modal
            </span>
        )
    }
    return (
        <span onClick={onClick} className="cursor-pointer">
            Login
        </span>
    )
}
