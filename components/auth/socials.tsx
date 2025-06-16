"use client"
import React from 'react'
import { FcGoogle } from "react-icons/fc"
import { Button } from '@/components/ui/button'

export default function Socials() {
  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button size="lg" className='w-full' variant={'outline'} onClick={() => {}}>
        <FcGoogle className='h-5 w-5'/>
        <p className='text-lg'>Sign In With Google</p>
      </Button>
    </div>
  )
}
