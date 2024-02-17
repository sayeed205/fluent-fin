import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Checkbox, Input, toast } from '@/components/ui';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useApi } from '@/utils';
import { setUser } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';

const userLoginFormSchema = z.object({
    username: z.string().min(1),
    password: z.string(),
    rememberMe: z.boolean(),
});

export const UserLoginForm = () => {
    const navigate = useNavigate();
    const jellyAPI = useApi(state => state.api);

    const form = useForm<z.infer<typeof userLoginFormSchema>>({
        resolver: zodResolver(userLoginFormSchema),
        defaultValues: {
            username: '',
            password: '',
            rememberMe: true,
        },
    });

    const authenticateUser = async (username: string, password: string) => {
        try {
            return await jellyAPI?.authenticateUserByName(username, password);
        } catch (error) {
            toast({
                title: 'Incorrect username or password',
                description: 'Please try again',
                color: 'destructive',
            });
            console.error(error);
        }
    };

    const onSubmit = async (data: z.infer<typeof userLoginFormSchema>) => {
        const user = await authenticateUser(data.username, data.password);

        if (!user) return;
        sessionStorage.setItem('accessToken', user?.data?.AccessToken!);
        if (data.rememberMe) {
            await setUser({
                username: data.username,
                accessToken: user?.data.AccessToken!,
            });
        }
        toast({
            title: 'Success',
            description: 'Logged in successfully',
            color: 'success',
        });
        navigate('/auth/home');
    };

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
                <FormField
                    name='rememberMe'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Remember me</FormLabel>
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

// @ts-ignore
const userData = {
    data: {
        User: {
            Name: 'Sayeed',

            ServerId: '01d4b4987b794810812397b0c7579f2a',

            Id: '4a7cd8e63dfc4791bafcfeb782852545',

            HasPassword: true,

            HasConfiguredPassword: true,

            HasConfiguredEasyPassword: false,

            EnableAutoLogin: false,

            LastLoginDate: '2024-02-17T05:54:42.9082191Z',

            LastActivityDate: '2024-02-17T05:54:42.9082191Z',

            Configuration: {
                AudioLanguagePreference: '',

                PlayDefaultAudioTrack: true,

                SubtitleLanguagePreference: '',

                DisplayMissingEpisodes: false,

                GroupedFolders: [],

                SubtitleMode: 'Default',

                DisplayCollectionsView: false,

                EnableLocalPassword: false,

                OrderedViews: [],

                LatestItemsExcludes: [],

                MyMediaExcludes: [],

                HidePlayedInLatest: true,

                RememberAudioSelections: true,

                RememberSubtitleSelections: true,

                EnableNextEpisodeAutoPlay: true,
            },

            Policy: {
                IsAdministrator: false,

                IsHidden: true,

                IsDisabled: false,

                BlockedTags: [],

                EnableUserPreferenceAccess: true,

                AccessSchedules: [],

                BlockUnratedItems: [],

                EnableRemoteControlOfOtherUsers: false,

                EnableSharedDeviceControl: true,

                EnableRemoteAccess: true,

                EnableLiveTvManagement: false,

                EnableLiveTvAccess: false,

                EnableMediaPlayback: true,

                EnableAudioPlaybackTranscoding: true,

                EnableVideoPlaybackTranscoding: true,

                EnablePlaybackRemuxing: true,

                ForceRemoteSourceTranscoding: false,

                EnableContentDeletion: false,

                EnableContentDeletionFromFolders: [],

                EnableContentDownloading: false,

                EnableSyncTranscoding: true,

                EnableMediaConversion: true,

                EnabledDevices: [],

                EnableAllDevices: true,

                EnabledChannels: [],

                EnableAllChannels: false,

                EnabledFolders: [
                    '0c41907140d802bb58430fed7e2cd79e',
                    'f137a2dd21bbc1b99aa5c0f6bf02a805',

                    '0e76b3b6be5f3cb3e621b6992c1bee0b',
                    '4514ec850e5ad0c47b58444e17b6346c',
                ],

                EnableAllFolders: false,

                InvalidLoginAttemptCount: 0,

                LoginAttemptsBeforeLockout: -1,

                MaxActiveSessions: 0,

                EnablePublicSharing: true,

                BlockedMediaFolders: [],

                BlockedChannels: [],

                RemoteClientBitrateLimit: 0,

                AuthenticationProviderId:
                    'Jellyfin.Server.Implementations.Users.DefaultAuthenticationProvider',

                PasswordResetProviderId:
                    'Jellyfin.Server.Implementations.Users.DefaultPasswordResetProvider',

                SyncPlayAccess: 'CreateAndJoinGroups',
            },
        },

        SessionInfo: {
            PlayState: {
                CanSeek: false,

                IsPaused: false,

                IsMuted: false,

                RepeatMode: 'RepeatNone',
            },

            AdditionalUsers: [],

            Capabilities: {
                PlayableMediaTypes: [],

                SupportedCommands: [],

                SupportsMediaControl: false,

                SupportsContentUploading: false,

                SupportsPersistentIdentifier: true,

                SupportsSync: false,
            },

            RemoteEndPoint: '103.6.158.35',

            PlayableMediaTypes: [],

            Id: '368a2d2a12fee5b7af2e832aa7a53ad2',

            UserId: '4a7cd8e63dfc4791bafcfeb782852545',

            UserName: 'Sayeed',

            Client: 'Fluent Fin',

            LastActivityDate: '2024-02-17T05:54:42.923131Z',

            LastPlaybackCheckIn: '0001-01-01T00:00:00.0000000Z',

            DeviceName: 'Fluent Fin',

            DeviceId: '9a880491-8265-46a7-9e28-2323026e68bd',

            ApplicationVersion: '0.0.0',

            IsActive: true,

            SupportsMediaControl: false,

            SupportsRemoteControl: false,

            NowPlayingQueue: [],

            NowPlayingQueueFullItems: [],

            HasCustomDeviceName: false,

            ServerId: '01d4b4987b794810812397b0c7579f2a',

            SupportedCommands: [],
        },

        AccessToken: '34a657cb0f3343ac9f0204fec0e00860',

        ServerId: '01d4b4987b794810812397b0c7579f2a',
    },

    status: 200,

    statusText: 'OK',
};
