"use client"
import React, { useTransition } from 'react'
import CardWrapper from '../general/card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { SignUpSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormErrors from '../general/form-error';
import FormSuccess from '../general/form-success';
import { signup } from "@/actions/auth.actions"

export default function SignUpForm() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
        startTransition(() => {
            signup(values)
        })
    }
    return (
        <CardWrapper showSocial headerLabel={'Create Account'} backButtonLabel={"Already Have An Account?"} backButtonHref={'/sign-in'}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className="space-y-4">
                        <FormField control={form.control} name='first_name' render={({ field }) => <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='John' type='text' disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>} />
                        <FormField control={form.control} name='last_name' render={({ field }) => <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='John' type='text' disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>} />
                        <FormField control={form.control} name='phone_number' render={({ field }) => <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='+266 5800 0000' type='text' disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>} />
                        <FormField control={form.control} name='password' render={({ field }) => <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='*********' type='password' disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>} />
                         <FormField control={form.control} name='password' render={({ field }) => <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='*********' type='password' disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>} />
                    </div>
                    <FormErrors message='' />
                    <FormSuccess message='' />
                    <Button type='submit' className='w-full '>Sign In</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
