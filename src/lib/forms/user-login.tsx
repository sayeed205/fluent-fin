import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const userLoginFormSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export const UserLoginForm = () => {
    const form = useForm<z.infer<typeof userLoginFormSchema>>({
        resolver: zodResolver(userLoginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (_data: z.infer<typeof userLoginFormSchema>) => {};

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col w-full max-w-md gap-4 space-y-4'
            >
                <FormField
                    name='username'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Hitarashi'
                                    type='text'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='password'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='********'
                                    type='password'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className=''>
                    Login
                </Button>
            </form>
        </Form>
    );
};
