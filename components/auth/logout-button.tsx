"use client"
import { logout } from '@/actions/auth.actions'
import React from 'react'

interface LogoutButtonProps{
    children?: React.ReactNode
}
export default function LogoutButton({children}: LogoutButtonProps) {
    const onClick = () => {
        logout()
    }
    return (
        <span onClick={onClick} className='cursor-pointer'>{children}</span>
    )
}
