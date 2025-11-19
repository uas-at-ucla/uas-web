import type { PageServerLoad } from './$types';
import type { EntriesResponse, GetEventResponse } from '../../../global';
import { COOKIE } from '$env/static/private';

export const load = (async () => {
    const oldEventsResponse = await fetch('https://api.lu.ma/home/get-events?period=past&pagination_limit=25', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': COOKIE
        }
    });

    console.log(oldEventsResponse);

    if (!oldEventsResponse.ok) {
        throw new Error('Failed to fetch events');
    }

    
    const oldEventsData: EntriesResponse = await oldEventsResponse.json();

    const oldEventPromises = oldEventsData.entries.map(async entry => {
        const url = `https://api.lu.ma/event/get?event_api_id=${entry.event.api_id}`;
        const eventResponse = await fetch(url);
        if (!eventResponse.ok) {
            throw new Error(`Failed to fetch event details for event_id: ${entry.event.api_id}`);
        }
        const eventData: GetEventResponse = await eventResponse.json();
        
        return eventData;
    });

    const newEventsResponse = await fetch('https://api.lu.ma/home/get-events?period=future&pagination_limit=25', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': COOKIE
        }
    });

    console.log(newEventsResponse);

    const newEventsData: EntriesResponse = await newEventsResponse.json();

    const newEventPromises = newEventsData.entries.map(async entry => {
        const url = `https://api.lu.ma/event/get?event_api_id=${entry.event.api_id}`;
        const eventResponse = await fetch(url);
        if (!eventResponse.ok) {
            throw new Error(`Failed to fetch event details for event_id: ${entry.event.api_id}`);
        }
        const eventData: GetEventResponse = await eventResponse.json();
        
        return eventData;
    });

    const oldEvents = await Promise.all(oldEventPromises);
    const newEvents = await Promise.all(newEventPromises);

    // Format events for the frontend
    const formattedEvents = newEvents.map(event => ({
        _id: event.event.url,
        title: event.event.name,
        date: event.event.start_at,
        description: event.description_mirror?.content
            ?.map(block => block.content?.map(item => item.text).join(''))
            ?.join('\n') || '',
        location: event.event.geo_address_info?.description || event.event.geo_address_info?.city_state || 'TBD',
        image: event.event.cover_url,
        rsvp: !event.event.hide_rsvp
    }));

    console.log(newEvents);

    return { events: formattedEvents, oldEvents, newEvents };
}) satisfies PageServerLoad;
