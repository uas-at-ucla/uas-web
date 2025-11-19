<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	export const ssr = false;
	import moment from 'moment';

	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import UserBlock from '$lib/components/UserBlock.svelte';

	export let data: PageData;
	let image: string | null = null;
	let selectedSubteam = '';

	let token = '';
	let activeTab: 'events' | 'files' | 'links' | 'users' = 'events';

	onMount(() => {
		if (!data.isAuthenticated) {
			goto('/api/auth/register');
		} else {
			if (!data.isAdmin) {
				goto('/');
			}
			image = data.user.picture;
			token = data.token;
			allUsers = data.allUsers;
			events = data.events || [];
		}
	});

	// File upload state
	let file: File | null = null;
	let fileCode = Array.from({ length: 10 }, () =>
		Math.random().toString(36).toUpperCase().charAt(2)
	).join('');
	let fileTitle = '';
	let fileDescription = '';
	let fileUploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';

	// Link upload state
	let link = '';
	let linkCode = Array.from({ length: 10 }, () =>
		Math.random().toString(36).toUpperCase().charAt(2)
	).join('');
	let linkTitle = '';
	let linkDescription = '';
	let linkPublic = false;
	let linkUploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';

	// Users state
	let allUsers: {
		_id: { $oid: string };
		email: string;
		given_name: string;
		family_name: string;
		level: string;
		privileges: string;
		createdAt: { $date: { $numberLong: string } };
		files: (string | null)[];
	}[] = [];

	// Events state
	interface Event {
		_id: { $oid: string };
		title: string;
		description: string;
		location: string;
		date?: { $date: { $numberLong: string } };
		eventDate?: string;
		image: string;
		rsvp: boolean;
		fileId?: string;
	}

	let events: Event[] = [];
	let eventFile: File | null = null;
	let eventTitle = '';
	let eventDescription = '';
	let eventLocation = '';
	let eventDate: string | null = null;
	let eventRsvp = false;
	let eventUploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';

	// Edit event state
	let editingEvent: Event | null = null;
	let editEventFile: File | null = null;

	async function handleFileUpload() {
		if (file && fileCode && fileTitle && fileDescription) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('email', data.user.email);
			formData.append('code', fileCode);
			formData.append('title', fileTitle);
			formData.append('description', fileDescription);

			try {
				fileUploadStatus = 'uploading';
				const response = await fetch('/api/account/file', {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				if (response.ok) {
					fileUploadStatus = 'success';
					// Reset form
					file = null;
					fileCode = Array.from({ length: 10 }, () =>
						Math.random().toString(36).toUpperCase().charAt(2)
					).join('');
					fileTitle = '';
					fileDescription = '';
					setTimeout(() => (fileUploadStatus = 'idle'), 3000);
				} else {
					console.error('File upload failed');
					fileUploadStatus = 'error';
				}
			} catch (error) {
				console.error('Error uploading file:', error);
				fileUploadStatus = 'error';
			}
		}
	}

	async function handleLinkUpload() {
		if (link && linkCode && linkTitle && linkDescription) {
			const formData = new FormData();
			formData.append('link', link);
			formData.append('public', linkPublic.toString());
			formData.append('email', data.user.email);
			formData.append('code', linkCode);
			formData.append('title', linkTitle);
			formData.append('description', linkDescription);

			try {
				linkUploadStatus = 'uploading';
				const response = await fetch('/api/account/link', {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				if (response.ok) {
					linkUploadStatus = 'success';
					// Reset form
					link = '';
					linkCode = Array.from({ length: 10 }, () =>
						Math.random().toString(36).toUpperCase().charAt(2)
					).join('');
					linkTitle = '';
					linkDescription = '';
					linkPublic = false;
					setTimeout(() => (linkUploadStatus = 'idle'), 3000);
				} else {
					console.error('Link upload failed');
					linkUploadStatus = 'error';
				}
			} catch (error) {
				console.error('Error uploading link:', error);
				linkUploadStatus = 'error';
			}
		}
	}

	async function handleEventUpload() {
		if (eventFile && eventTitle && eventDescription && eventLocation && eventDate) {
			const formData = new FormData();
			formData.append('file', eventFile);
			formData.append('email', data.user.email);
			formData.append('title', eventTitle);
			formData.append('description', eventDescription);
			formData.append('location', eventLocation);
			formData.append('date', eventDate);
			formData.append('rsvp', eventRsvp.toString());

			try {
				eventUploadStatus = 'uploading';
				const response = await fetch('/api/calendar/add', {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				if (response.ok) {
					const newEvent = await response.json();
					events = [...events, newEvent];
					eventUploadStatus = 'success';
					// Reset form
					eventFile = null;
					eventTitle = '';
					eventDescription = '';
					eventLocation = '';
					eventDate = null;
					eventRsvp = false;
					setTimeout(() => (eventUploadStatus = 'idle'), 3000);
				} else {
					console.error('Event upload failed');
					eventUploadStatus = 'error';
				}
			} catch (error) {
				console.error('Error uploading event:', error);
				eventUploadStatus = 'error';
			}
		}
	}

	function startEditEvent(event: Event) {
		editingEvent = { ...event };
		editEventFile = null;
	}

	function cancelEditEvent() {
		editingEvent = null;
		editEventFile = null;
	}

	async function handleEventUpdate() {
		if (!editingEvent) return;

		const formData = new FormData();
		formData.append('eventId', editingEvent._id.$oid);
		formData.append('title', editingEvent.title);
		formData.append('description', editingEvent.description);
		formData.append('location', editingEvent.location);
		formData.append('date', editingEvent.eventDate || '');
		formData.append('rsvp', editingEvent.rsvp.toString());

		if (editEventFile) {
			formData.append('file', editEventFile);
		}

		try {
			eventUploadStatus = 'uploading';
			const response = await fetch('/api/calendar/update', {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const updatedEvent = await response.json();
				events = events.map((e) =>
					e._id.$oid === editingEvent._id.$oid ? updatedEvent : e
				);
				eventUploadStatus = 'success';
				editingEvent = null;
				editEventFile = null;
				setTimeout(() => (eventUploadStatus = 'idle'), 3000);
			} else {
				console.error('Event update failed');
				eventUploadStatus = 'error';
			}
		} catch (error) {
			console.error('Error updating event:', error);
			eventUploadStatus = 'error';
		}
	}

	async function handleEventDelete(eventId: string) {
		if (!confirm('Are you sure you want to delete this event?')) return;

		try {
			const response = await fetch('/api/calendar/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ eventId })
			});

			if (response.ok) {
				events = events.filter((e) => e._id.$oid !== eventId);
			} else {
				console.error('Event deletion failed');
				alert('Failed to delete event');
			}
		} catch (error) {
			console.error('Error deleting event:', error);
			alert('Error deleting event');
		}
	}

	function formatEventDate(event: Event): string {
		if (event.eventDate) {
			return moment(event.eventDate).format('YYYY-MM-DDTHH:mm');
		} else if (event.date?.$date?.$numberLong) {
			return moment(parseInt(event.date.$date.$numberLong)).format('YYYY-MM-DDTHH:mm');
		}
		return '';
	}

	function formatDisplayDate(event: Event): string {
		if (event.eventDate) {
			return moment(event.eventDate).format('MMM D, YYYY h:mm A');
		} else if (event.date?.$date?.$numberLong) {
			return moment(parseInt(event.date.$date.$numberLong)).format('MMM D, YYYY h:mm A');
		}
		return 'No date';
	}
</script>

<Nav {image}></Nav>
<section class="base-color mx-auto min-h-screen max-w-7xl px-5 pb-10 lg:px-8">
	<div class="mt-10">
		<div class="min-w-0 flex-1">
			<h2 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:tracking-tight">
				Admin Dashboard
			</h2>
			<p class="mt-2 text-gray-400">
				Welcome <span class="gradient-text">{data.user.given_name}</span>! Manage your website
				content here.
			</p>
		</div>

		<!-- Tabs -->
		<div class="mt-8 border-b border-gray-700">
			<nav class="-mb-px flex space-x-8" aria-label="Tabs">
				<button
					on:click={() => (activeTab = 'events')}
					class={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
						activeTab === 'events'
							? 'border-indigo-500 text-indigo-400'
							: 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
					}`}
				>
					<svg
						class="mr-2 inline-block h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
						/>
					</svg>
					Events
				</button>
				<button
					on:click={() => (activeTab = 'files')}
					class={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
						activeTab === 'files'
							? 'border-indigo-500 text-indigo-400'
							: 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
					}`}
				>
					<svg
						class="mr-2 inline-block h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
						/>
					</svg>
					Files
				</button>
				<button
					on:click={() => (activeTab = 'links')}
					class={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
						activeTab === 'links'
							? 'border-indigo-500 text-indigo-400'
							: 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
					}`}
				>
					<svg
						class="mr-2 inline-block h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
						/>
					</svg>
					Links
				</button>
				<button
					on:click={() => (activeTab = 'users')}
					class={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
						activeTab === 'users'
							? 'border-indigo-500 text-indigo-400'
							: 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
					}`}
				>
					<svg
						class="mr-2 inline-block h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
						/>
					</svg>
					Users
				</button>
			</nav>
		</div>

		<!-- Tab Content -->
		<div class="mt-8">
			{#if activeTab === 'events'}
				<div class="space-y-8">
					<!-- Add New Event -->
					<div class="card-color rounded-xl p-6">
						<h3 class="mb-4 mt-0 text-xl font-bold text-white">
							{editingEvent ? 'Edit Event' : 'Create New Event'}
						</h3>
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-2 block text-sm font-medium text-gray-400">Title</label>
								<input
									type="text"
									bind:value={editingEvent ? editingEvent.title : eventTitle}
									placeholder="Event Title"
									class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
								/>
							</div>
							<div>
								<label class="mb-2 block text-sm font-medium text-gray-400">Location</label>
								<input
									type="text"
									bind:value={editingEvent ? editingEvent.location : eventLocation}
									placeholder="Event Location"
									class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
								/>
							</div>
						</div>
						<div class="mt-4">
							<label class="mb-2 block text-sm font-medium text-gray-400">Description</label>
							<textarea
								bind:value={editingEvent ? editingEvent.description : eventDescription}
								placeholder="Event Description"
								rows="3"
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
							></textarea>
						</div>
						<div class="mt-4">
							<label class="mb-2 block text-sm font-medium text-gray-400">Date & Time</label>
							<input
								type="datetime-local"
								bind:value={editingEvent ? editingEvent.eventDate : eventDate}
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
							/>
						</div>
						<div class="mt-4">
							<label class="mb-2 block text-sm font-medium text-gray-400">Event Image</label>
							<input
								type="file"
								on:change={(e) =>
									editingEvent
										? (editEventFile = e.target.files?.[0] || null)
										: (eventFile = e.target.files?.[0] || null)}
								accept="image/*"
								class="file-input w-full"
							/>
						</div>
						<div class="mt-4">
							<label class="flex items-center text-gray-400">
								<input
									type="checkbox"
									bind:checked={editingEvent ? editingEvent.rsvp : eventRsvp}
									class="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
								/>
								<span>RSVP Required</span>
							</label>
						</div>
						<div class="mt-6 flex gap-3">
							{#if editingEvent}
								<button
									on:click={handleEventUpdate}
									disabled={eventUploadStatus === 'uploading'}
									class="button flex-1"
								>
									{eventUploadStatus === 'uploading' ? 'Updating...' : 'Update Event'}
								</button>
								<button on:click={cancelEditEvent} class="button flex-1 bg-gray-600 hover:bg-gray-500">
									Cancel
								</button>
							{:else}
								<button
									on:click={handleEventUpload}
									disabled={!eventFile ||
										!eventTitle ||
										!eventDescription ||
										!eventLocation ||
										!eventDate ||
										eventUploadStatus === 'uploading' ||
										eventUploadStatus === 'success'}
									class="button w-full"
								>
									{eventUploadStatus === 'uploading'
										? 'Creating...'
										: eventUploadStatus === 'success'
											? 'Event Created!'
											: 'Create Event'}
								</button>
							{/if}
						</div>
						{#if eventUploadStatus === 'error'}
							<p class="mt-2 text-sm text-red-400">Error processing event. Please try again.</p>
						{/if}
					</div>

					<!-- Events List -->
					<div class="card-color rounded-xl p-6">
						<h3 class="mb-4 mt-0 text-xl font-bold text-white">All Events ({events.length})</h3>
						<div class="space-y-4">
							{#if events.length === 0}
								<p class="py-8 text-center text-gray-400">No events yet. Create your first event above!</p>
							{:else}
								{#each events as event}
									<div class="base-color flex gap-4 rounded-lg border border-gray-700 p-4">
										<img
											src={event.image}
											alt={event.title}
											class="h-24 w-32 rounded-lg object-cover"
										/>
										<div class="flex-1">
											<h4 class="text-lg font-semibold text-white">{event.title}</h4>
											<p class="mt-1 text-sm text-gray-400">
												<svg
													class="mr-1 inline-block h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
													/>
												</svg>
												{event.location}
											</p>
											<p class="mt-1 text-sm text-gray-400">
												<svg
													class="mr-1 inline-block h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
													/>
												</svg>
												{formatDisplayDate(event)}
											</p>
											<p class="mt-2 text-sm text-gray-300">{event.description}</p>
											{#if event.rsvp}
												<span class="mt-2 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-400">
													RSVP Required
												</span>
											{/if}
										</div>
										<div class="flex flex-col gap-2">
											<button
												on:click={() => {
													event.eventDate = formatEventDate(event);
													startEditEvent(event);
												}}
												class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
											>
												Edit
											</button>
											<button
												on:click={() => handleEventDelete(event._id.$oid)}
												class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
											>
												Delete
											</button>
										</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			{:else if activeTab === 'files'}
				<div class="card-color rounded-xl p-6">
					<h3 class="mb-4 mt-0 text-xl font-bold text-white">Upload File</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-400">Code</label>
						<input
							type="text"
							bind:value={fileCode}
								placeholder="File Code"
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 font-mono text-gray-300 focus:border-indigo-500 focus:outline-none"
						/>
						</div>
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-400">Title</label>
						<input
							type="text"
							bind:value={fileTitle}
								placeholder="File Title"
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
						/>
						</div>
					</div>
					<div class="mt-4">
						<label class="mb-2 block text-sm font-medium text-gray-400">Description</label>
					<input
						type="text"
						bind:value={fileDescription}
							placeholder="File Description"
							class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
					/>
					</div>
					<div class="mt-4">
						<label class="mb-2 block text-sm font-medium text-gray-400">File</label>
					<input
						type="file"
						on:change={(e) => (file = e.target.files?.[0] || null)}
							class="file-input w-full"
					/>
					</div>
					<button
						on:click={handleFileUpload}
						class="button mt-6 w-full"
						disabled={!file ||
							!fileCode ||
							!fileTitle ||
							!fileDescription ||
							fileUploadStatus === 'uploading' ||
							fileUploadStatus === 'success'}
							>
								{fileUploadStatus === 'uploading'
									? 'Uploading...'
									: fileUploadStatus === 'success'
								? 'File Uploaded!'
								: 'Upload File'}
					</button>
					{#if fileUploadStatus === 'error'}
						<p class="mt-2 text-sm text-red-400">Error uploading file. Please try again.</p>
					{/if}
				</div>
			{:else if activeTab === 'links'}
				<div class="card-color rounded-xl p-6">
					<h3 class="mb-4 mt-0 text-xl font-bold text-white">Upload Link</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-400">Code</label>
							<input
								type="text"
								bind:value={linkCode}
								placeholder="Link Code"
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 font-mono text-gray-300 focus:border-indigo-500 focus:outline-none"
							/>
						</div>
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-400">Title</label>
							<input
								type="text"
								bind:value={linkTitle}
								placeholder="Link Title"
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
							/>
						</div>
					</div>
					<div class="mt-4">
						<label class="mb-2 block text-sm font-medium text-gray-400">Description</label>
						<input
							type="text"
							bind:value={linkDescription}
							placeholder="Link Description"
							class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
						/>
					</div>
					<div class="mt-4">
						<label class="mb-2 block text-sm font-medium text-gray-400">URL</label>
						<input
							type="text"
							bind:value={link}
							placeholder="https://example.com"
							class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
						/>
					</div>
					<div class="mt-4">
						<label class="flex items-center text-gray-400">
					<input
								type="checkbox"
								bind:checked={linkPublic}
								class="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
							/>
							<span>Public Link</span>
						</label>
					</div>
					<button
						on:click={handleLinkUpload}
						class="button mt-6 w-full"
						disabled={!link ||
							!linkCode ||
							!linkTitle ||
							!linkDescription ||
							linkUploadStatus === 'uploading' ||
							linkUploadStatus === 'success'}
							>
								{linkUploadStatus === 'uploading'
									? 'Uploading...'
									: linkUploadStatus === 'success'
								? 'Link Uploaded!'
								: 'Upload Link'}
					</button>
					{#if linkUploadStatus === 'error'}
						<p class="mt-2 text-sm text-red-400">Error uploading link. Please try again.</p>
					{/if}
				</div>
			{:else if activeTab === 'users'}
				<div class="space-y-6">
					<div class="card-color rounded-xl p-6">
						<h3 class="mb-4 mt-0 text-xl font-bold text-white">All Users ({allUsers.filter(user => !user.interestForm).length})</h3>
				<div class="mb-4">
							<label class="mb-2 block text-sm font-medium text-gray-400">User Emails</label>
					<textarea
						id="all-users-textarea"
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
						rows="4"
						readonly
					>{allUsers.filter(user => !user.interestForm).map(user => user.email).join('; ')}</textarea>
					<button
						on:click={() => {
							const textarea = document.getElementById('all-users-textarea');
							if (textarea) {
								textarea.select();
								document.execCommand('copy');
							}
						}}
								class="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
							>
								Copy Emails
							</button>
						</div>
				</div>

					<div class="card-color rounded-xl p-6">
						<h3 class="mb-4 mt-0 text-xl font-bold text-white">Filter by Subteam</h3>
				<div class="mb-4">
							<label class="mb-2 block text-sm font-medium text-gray-400">Select Subteam</label>
					<select
						bind:value={selectedSubteam}
								class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-gray-300 focus:border-indigo-500 focus:outline-none"
					>
						<option value="">Select Subteam</option>
						{#each ['Airframe & CAD', 'Electronics', 'Flight Control', 'Manufacturing', 'Outreach', 'R&D', 'Pilots & Operations', 'Vision', 'Ground & Communications'] as team}
							<option value={team}>{team}</option>
						{/each}
					</select>
				</div>
				{#if selectedSubteam}
					<div class="mb-4">
								<label class="mb-2 block text-sm font-medium text-gray-400">Subteam Emails</label>
						<textarea
							id="subteam-users-textarea"
									class="base-color w-full rounded-lg border-2 border-gray-700 p-3 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
							rows="4"
							readonly
						>{allUsers.filter(user => user.subteam && user.subteam.includes(selectedSubteam)).map(user => user.email).join('; ')}</textarea>
						<button
							on:click={() => {
								const textarea = document.getElementById('subteam-users-textarea');
								if (textarea) {
									textarea.select();
									document.execCommand('copy');
								}
							}}
									class="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
								>
									Copy Emails
								</button>
							</div>
						{/if}
					</div>

					<div class="card-color rounded-xl p-6">
						<h3 class="mb-4 mt-0 text-xl font-bold text-white">User Directory</h3>
						<div class="grid gap-4 md:grid-cols-2">
					{#each allUsers as user}
						<UserBlock {user} {token} />
					{/each}
				</div>
			</div>
				</div>
			{/if}
		</div>
	</div>
</section>
