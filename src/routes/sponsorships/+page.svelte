<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import logo from '$lib/assets/logo.svg';
	import type { PageData } from './$types';
	import SponsorTile from './SponsorTile.svelte';

	import aiaa from '$lib/assets/sponsors/aiaa.svg';
	import northrop from '$lib/assets/sponsors/northrop.svg';
	import holybro from '$lib/assets/sponsors/holybro.svg';
	import fetch from '$lib/assets/sponsors/fetch.svg';
	import bittele from '$lib/assets/sponsors/bittele.svg';
	import innovationlab from '$lib/assets/sponsors/innovationlab.svg';
	import uclaalum from '$lib/assets/sponsors/ucla-alum.svg';
	import solidworks from '$lib/assets/sponsors/solidworks.svg';
	import boeing from '$lib/assets/sponsors/boeing.svg';
	import bp8 from '$lib/assets/bp-8.svg';
	import elegoo from '$lib/assets/sponsors/elegoo.svg';

	interface Sponsor {
		type: string;
		name: string;
		description: string;
		website: string;
		image: string;
		benefits: string[];
	}

	let sponsors: Sponsor[] = [
		{
			type: '3D Printing',
			name: 'Elegoo',
			website: 'https://www.elegoo.com/',
			description:
				'ELEGOO is a leading provider of high-quality 3D printers and DIY electronics kits. They specialize in resin and FDM 3D printers, offering cutting-edge models like the Mars and Saturn series for precision printing. Their 3D printing solutions cater to hobbyists, professionals, and educators, providing reliable, affordable, and user-friendly machines. Alongside their printers, Elegoo also supplies resin, filaments, and accessories to support the growing maker community.',
			image: elegoo,
			benefits: [
				'Access to cutting edge adaptive manufacturing technology (3D printing)',
				'Providing the Jupiter SE SLA printer and Mercury Plus V3.0',
				'Potential for professional events and workshops'
			]
		},
		{
			type: 'Hardware & Drone Technology',
			name: 'Holybro',
			website: 'https://www.holybro.com/',
			description:
				'Holybro is a leading provider of cutting-edge drone control technology, specializing in hardware solutions that enhance the performance and reliability of unmanned aerial vehicles. Their innovative products are designed for both hobbyists and professionals in the drone industry.',
			image: holybro,
			benefits: [
				'Access to industry-leading drone control systems',
				'Hardware for technical workshops and competitions'
			]
		},
		{
			type: 'PCB Manufacturing',
			name: 'Bittele Electronics Inc.',
			website: 'https://www.7pcb.com/',
			description:
				'n business since 2003, Bittele Electronics Inc. has established itself as a Turn-Key PCB assembly company for prototype and low-to-mid volume PCB fabrication and assembly services. Our facility in Toronto, Canada incorporates our Head Office, Sales Office, Parts Procurement Team, as well as our State-of-the-Art PCB Assembly line. This allows us to offer our customers low-cost, One-stop PCB Assembly Services, including PCB fabrication, parts procurement, and PCB Assembly. Our customers are primarily in the United States and Canada, in a wide variety of industries.',
			image: bittele,
			benefits: [
				'Access to industry-leading PCB manufacturing services'
			]
		},
		{
			type: 'Professional Development',
			name: 'AIAA',
			website: 'https://www.aiaa.org/',
			description:
				'AIAA provides equipment support, mentoring, and industry connections to help professionals advance in their careers and enhance their skills in the aerospace industry.',
			image: aiaa,
			benefits: [
				'Access to industry-leading equipment and resources',
				'Mentorship from professionals',
				'Opportunities to connect with industry leaders and peers'
			]
		},
		{
			type: 'Alumni Support',
			name: 'UCLA Alumni Association',
			website: 'https://alumni.ucla.edu/',
			description:
				'Together, we can make a difference! The UCLA Alumni Association provides financial support to various initiatives and programs that benefit students and the university community.',
			image: uclaalum,
			benefits: [
				'Access to alumni events and networking opportunities',
				'Support for student scholarships and programs',
				'Engagement in community service and outreach initiatives'
			]
		},
		{
			type: 'CAD Software',
			name: 'SolidWorks',
			website: 'https://www.solidworks.com/',
			description:
				'SolidWorks is a powerful CAD software that enables engineers and designers to create 3D models and simulations, enhancing product design and development processes.',
			image: solidworks,
			benefits: [
				'Access to advanced 3D modeling and simulation tools',
				'Collaboration features for team projects',
				'Extensive library of components and materials'
			]
		},
		{
			type: 'Aerospace Industry',
			name: 'Boeing',
			website: 'https://www.boeing.com/',
			description:
				'Boeing is a leading aerospace company that provides financial support and industry connections to help advance aerospace initiatives and education.',
			image: boeing,
			benefits: [
				'Access to exclusive industry events and networking opportunities',
				'Support for educational programs and scholarships',
				'Collaboration on aerospace research and development projects'
			]
		},
		{
			type: 'Aerospace Industry',
			name: 'Northrop Grumman',
			website: 'https://www.northropgrumman.com/',
			description:
				'Northrop Grumman is a global aerospace and defense technology company that provides monetary support and valuable industry connections to foster innovation and education.',
			image: northrop,
			benefits: [
				'Opportunities for internships and career development',
				'Access to cutting-edge technology and resources',
				'Engagement in community outreach and educational initiatives'
			]
		}
	];

	export let data: PageData;
	let image: string | null = null;

	onMount(() => {
		if (data.isAuthenticated) {
			image = data.user.picture;
		}
	});
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
	<div class="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:pb-32 xl:flex xl:px-8 xl:py-20">
		<div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-40">
			<img class="h-11" src={logo} alt="Your Company" />

			<h1 class="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
				Thank you to our <span class="gradient-text">sponsors</span>
			</h1>
			<p class="mt-6 text-lg leading-8 text-gray-300">
				We extend our heartfelt gratitude to our sponsors for their invaluable support. Your contributions make a significant impact on our mission. 
			</p>
			<div class="mt-5 flex items-center gap-x-6">
				<a
					href="src/lib/assets/UAS Sponsorship Package.pdf"
					class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
					>Download Sponsorship Package <span aria-hidden="true">&rarr;</span></a
				>
			</div>
		</div>
		<div
			class="mx-auto flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
		>
			<div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
				<img
					src={bp8}
					alt="App screenshot"
					width="2432"
					height="1442"
					class="w-[76rem] rounded-md"
				/>
			</div>
		</div>
	</div>
</div>

<!-- <div class="mx-auto mb-10 max-w-2xl px-6 lg:px-8 lg:text-center">
	<h2 class="text-base font-semibold leading-7 text-indigo-400">Sponsorship Package</h2>
	<p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
		Support the future of autonomous flight
	</p>
	<p class="mt-6 text-lg leading-8 text-gray-300">
		UAS@UCLA is at the forefront of drone innovation, dedicated to advancing aerial robotics through
		cutting-edge research and practical applications
	</p>
</div> -->

<div class="mx-auto grid gap-8 px-5 pb-24 pt-20 sm:pb-32 md:grid-cols-2 xl:grid-cols-3 lg:px-8 lg:py-20">
	{#each sponsors as sponsor}
		<SponsorTile {sponsor} />
	{/each}
</div>
