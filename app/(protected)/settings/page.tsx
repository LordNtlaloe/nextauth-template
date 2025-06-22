import { auth, signOut } from '@/auth'
import React from 'react'
import {Button} from "@/components/ui/button"

export default async function Settings() {
    const session = await auth()

    return (
        <div>
            <h1>Settings Page</h1>
            {session ? (
                <div>
                    <p>Welcome, {session.user?.name || session.user?.email}!</p>
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
            <form action={async () => {
                "use server"
                await signOut();
    
            }}>
                <Button className="cursor-pointer">Sign Out</Button>
            </form>
        </div>
    )
}