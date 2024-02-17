import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api';
import { getTvShowsApi } from '@jellyfin/sdk/lib/utils/api/tv-shows-api';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api/user-library-api';
import { getUserViewsApi } from '@jellyfin/sdk/lib/utils/api/user-views-api';
import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useRef } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn, useApi } from '@/utils';
import {
    getDefaultServer,
    getServer,
    getUser,
    useCentralStore,
} from '@/utils/storage';

export const Home = () => {
    const api = useApi(state => state.api);

    useEffect(() => {
        // @ts-ignore
        getDefaultServer().then(getServer).then(console.log);
        getUser().then(console.log);
    }, []);

    if (!api) return null;

    const user = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const usr = await getUserApi(api).getCurrentUser();
            return usr.data;
        },
        networkMode: 'always',
        enabled: Boolean(api),
    });

    const userId = user.data?.Id!;

    const libraries = useQuery({
        queryKey: ['libraries'],
        queryFn: async () => {
            const libs = await getUserViewsApi(api).getUserViews({
                userId,
            });
            return libs.data;
        },
        enabled: !!user.data,
        networkMode: 'always',
    });

    const latestMedia = useQuery({
        queryKey: ['home', 'latestMedia'],
        queryFn: async () => {
            const media = await getUserLibraryApi(api).getLatestMedia({
                userId,
                fields: [
                    ItemFields.Overview,
                    ItemFields.ParentId,
                    'ParentIndexNumber' as ItemFields,
                    ItemFields.SeasonUserData,
                    ItemFields.IsHd,
                    ItemFields.MediaStreams,
                    ItemFields.MediaSources,
                ],
                enableUserData: true,
                enableImages: true,
            });
            return media.data;
        },
        enabled: !!user.data,
    });

    const resumeItemsVideo = useQuery({
        queryKey: ['home', 'resume', 'video'],
        queryFn: async () => {
            const resumeItems = await getItemsApi(api).getResumeItems({
                userId,
                limit: 10,
                mediaTypes: ['Video'],
                enableUserData: true,
                fields: [ItemFields.MediaStreams, ItemFields.MediaSources],
            });
            return resumeItems.data;
        },
        enabled: !!user.data,
    });

    const resumeItemsAudio = useQuery({
        queryKey: ['home', 'resume', 'audio'],
        queryFn: async () => {
            const resumeItems = await getItemsApi(api).getResumeItems({
                userId,
                limit: 10,
                mediaTypes: ['Audio'],
                enableUserData: true,
                fields: [ItemFields.MediaStreams, ItemFields.MediaSources],
            });
            return resumeItems.data;
        },
        enabled: !!user.data,
    });

    const upNextItems = useQuery({
        queryKey: ['home', 'upNext'],
        queryFn: async () => {
            const upNext = await getTvShowsApi(api).getNextUp({
                userId,
                fields: [
                    ItemFields.PrimaryImageAspectRatio,
                    ItemFields.MediaStreams,
                    ItemFields.MediaSources,
                    ItemFields.ParentId,
                    // 'IndexNumber',
                    // 'ParentIndexNumber',
                ],
                limit: 10,
            });
            return upNext.data;
        },
        enabled: !!user.data,
    });

    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

    const isExpanded = useCentralStore(state => state.isExpanded);

    return (
        <>
            <main>
                {latestMedia.data?.length! > 0 && (
                    <Carousel
                        plugins={[plugin.current]}
                        className={cn(
                            'ml-[50px] max-w-[calc(100%-150px)]'
                            // isExpanded
                            //     ? ''
                            //     : 'ml-[50px] max-w-[calc(100%-150px)]'
                        )}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselPrevious />
                        <CarouselContent>
                            {latestMedia.data?.map(item => (
                                <CarouselItem key={item.Id}>
                                    <div className='p-1 bg-transparent '>
                                        <Card>
                                            <CardContent className=''>
                                                <img
                                                    alt={item.Name!}
                                                    className='object-contain w-full rounded-xl '
                                                    src={
                                                        item.ParentBackdropItemId
                                                            ? `${api.basePath}/Items/${item.ParentBackdropItemId}/Images/Backdrop?quality=80`
                                                            : `${api.basePath}/Items/${item.Id}/Images/Backdrop?quality=80`
                                                    }
                                                    loading='eager'
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* {item.Name} */}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext />
                    </Carousel>
                )}
            </main>
        </>
    );
};
