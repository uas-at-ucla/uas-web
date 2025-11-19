<script lang="ts">
    import { onMount } from 'svelte';
    import Nav from '$lib/components/Nav.svelte';
    import moment from 'moment';

    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import Footer from '$lib/components/Footer.svelte';

    export let data: PageData;
    let image: string | null = null;
    let events = data.events;

    interface EventItem {
        _id: string;
        title: string;
        date: string | null;
        description: string;
        location: string;
        image: string;
        rsvp: boolean;
    }

    let newEvent: Partial<EventItem> = {
        title: '',
        date: '',
        description: '',
        location: '',
        image: '',
        rsvp: false
    };

    let file: File | null = null;

    async function addEvent() {
        const formData = new FormData();
        formData.append('title', newEvent.title || '');
        formData.append('date', newEvent.date || '');
        formData.append('description', newEvent.description || '');
        formData.append('location', newEvent.location || '');
        if (file) {
            formData.append('image', file);
        }
        formData.append('rsvp', newEvent.rsvp ? 'true' : 'false');

        const response = await fetch('/api/calendar/add', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const addedEvent = await response.json();
            const formattedEvent: EventItem = {
                _id: addedEvent._id,
                title: addedEvent.title,
                date: addedEvent.date,
                description: addedEvent.description,
                location: addedEvent.location,
                image: addedEvent.fileId,
                rsvp: addedEvent.rsvp
            };
            events = [...events, formattedEvent];
            newEvent = {
                title: '',
                date: '',
                description: '',
                location: '',
                image: '',
                rsvp: false
            };
            file = null;
        } else {
            console.error('Failed to add event');
        }
    }
</script>

<div class="relative isolate min-h-screen overflow-hidden base-color">
    <Nav {image} active="calendar"></Nav>
    <svg
        class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
    >
        <defs>
            <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width="200"
                height="200"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
            >
                <path d="M.5 200V.5H200" fill="none" />
            </pattern>
        </defs>
        <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
            <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                stroke-width="0"
            />
        </svg>
        <rect
            width="100%"
            height="100%"
            stroke-width="0"
            fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
        />
    </svg>
    <div class="mx-auto mt-10 max-w-7xl px-5 md:flex md:items-center md:justify-between lg:px-8">
        <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                Calendar
            </h2>

            <h3
                class="mt-5 text-xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight"
            >
                Upcoming events
            </h3>
            <ul
                role="list"
                class="mx-auto my-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 items-start justify-start"
            >
                {#each events as eventItem}
                    <li>
                        <img
                            class="aspect-[3/2] w-full rounded-2xl object-cover"
                            src={eventItem.image}
                            alt=""
                        />
                        <div>
                            <h3 class="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-300 mb-0">
                                {eventItem.title} <span class="text-gray-400">@ {eventItem.location}</span>
                            </h3>
                        </div>
                        <p class="text-base mt-0 leading-7 text-gray-500">{moment(eventItem.date).format('D MMMM, h A')}</p>
                        <p class="mt-2 text-base leading-7 text-gray-300">{eventItem.description}</p>
                        {#if eventItem.rsvp}
                            <div class="mt-5">
                                <a
                                    href={`/calendar/${eventItem._id}`}
                                    target="_blank"
                                    class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                                    >RSVP <span aria-hidden="true">→</span></a
                                >
                            </div>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>