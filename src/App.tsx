import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
    Navigate,
    RouterProvider,
    createBrowserRouter,
} from 'react-router-dom';

import { Toaster } from '@/components/ui';
import { Home } from '@/routes/protected';
import { ServerList, SetupServer, UserLogin } from '@/routes/public';
import Root from '@/routes/root';
import { initializeApp } from '@/utils';
import { useCentralStore } from '@/utils/storage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'always',
            staleTime: 69420 + 50580, // 2 mins
        },
        mutations: {
            networkMode: 'always',
        },
    },
});

const App = () => {
    const initialRoute = useCentralStore(state => state.initialRoute);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Navigate to={initialRoute} />,
        },
        {
            path: '/login/index',
            element: <UserLogin />,
        },
        {
            path: '/setup/server',
            element: <SetupServer />,
        },
        {
            path: '/servers/list',
            element: <ServerList />,
        },
        {
            path: '/auth',
            element: <Root />,
            children: [
                {
                    path: 'home',
                    element: <Home />,
                },
            ],
        },
    ]);

    useEffect(() => {
        initializeApp();
    }, []);
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster />
            </QueryClientProvider>
        </>
    );
};

export default App;
