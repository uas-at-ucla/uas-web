interface Aircraft {
    images: string[];
    name: string;
    registration: string;
    rate: string;
    model: string;
    engine: string;
    type: string;
    horsepower: number;
    usefulLoad: string;
    pohLink: string;
    wbLink: string;
}

interface VirtualInfo {
    has_access: boolean;
    raw_join_url: string | null;
    zoom_id: string | null;
    password: string | null;
}

interface CoverImage {
    vibrant_color: string | null;
    colors: string[];
}

interface Calendar {
    access_level: string;
    api_id: string;
    avatar_url: string;
    cover_image_url: string;
    description_short: string | null;
    event_submission_restriction: string;
    geo_city: string | null;
    geo_country: string | null;
    geo_latitude: number | null;
    geo_longitude: number | null;
    geo_region: string | null;
    google_measurement_id: string | null;
    instagram_handle: string | null;
    launch_status: string;
    linkedin_handle: string | null;
    luma_plus_active: boolean;
    meta_pixel_id: string | null;
    name: string;
    personal_user_api_id: string;
    refund_policy: string | null;
    slug: string | null;
    social_image_url: string | null;
    stripe_account_id: string | null;
    tax_config: string | null;
    tiktok_handle: string | null;
    timezone: string | null;
    tint_color: string;
    track_meta_ads_from_luma: boolean;
    twitter_handle: string | null;
    verified_at: string | null;
    website: string | null;
    youtube_handle: string | null;
    is_personal: boolean;
}

interface Host {
    api_id: string;
    avatar_url: string;
    bio_short: string | null;
    instagram_handle: string | null;
    last_online_at: string;
    linkedin_handle: string | null;
    name: string;
    tiktok_handle: string | null;
    timezone: string;
    twitter_handle: string | null;
    username: string | null;
    website: string | null;
    youtube_handle: string | null;
    access_level: string;
    event_api_id: string;
}

interface TicketInfo {
    price: number | null;
    is_free: boolean;
    max_price: number | null;
    is_sold_out: boolean;
    spots_remaining: number | null;
    is_near_capacity: boolean;
    require_approval: boolean;
    currency_info: string | null;
}

interface Role {
    type: string;
    access_level: string;
    secret_key: string;
    is_manager: boolean;
    num_guests_approved: number;
    num_tickets_registered: number;
}

interface Entry {
    api_id: string;
    event: Event;
    cover_image: CoverImage;
    calendar: Calendar;
    start_at: string;
    hosts: Host[];
    guest_count: number;
    ticket_count: number;
    ticket_info: TicketInfo;
    featured_guests: any[];
    role: Role;
}

interface EntriesResponse {
    entries: Entry[];
    has_more: boolean;
}

export type Calendar = {
    access_level: string;
    api_id: string;
    avatar_url: string;
    cover_image_url: string;
    description_short: string | null;
    event_submission_restriction: string;
    geo_city: string | null;
    geo_country: string | null;
    geo_latitude: number | null;
    geo_longitude: number | null;
    geo_region: string | null;
    google_measurement_id: string | null;
    instagram_handle: string | null;
    launch_status: string;
    linkedin_handle: string | null;
    luma_plus_active: boolean;
    meta_pixel_id: string | null;
    name: string;
    personal_user_api_id: string;
    refund_policy: string | null;
    slug: string | null;
    social_image_url: string | null;
    stripe_account_id: string | null;
    tax_config: string | null;
    tiktok_handle: string | null;
    timezone: string | null;
    tint_color: string;
    track_meta_ads_from_luma: boolean;
    twitter_handle: string | null;
    verified_at: string | null;
    website: string | null;
    youtube_handle: string | null;
    payment_methods: any[];
    charges_enabled: boolean | null;
    is_personal: boolean;
};

export type VirtualInfo = {
    has_access: boolean;
    raw_join_url: string | null;
    zoom_id: string | null;
    password: string | null;
};

export type Event = {
    api_id: string;
    calendar_api_id: string;
    cover_url: string;
    end_at: string;
    event_type: string;
    hide_rsvp: boolean;
    location_type: string;
    name: string;
    one_to_one: boolean;
    recurrence_id: string | null;
    show_guest_list: boolean;
    start_at: string;
    timezone: string;
    url: string;
    user_api_id: string;
    visibility: string;
    waitlist_enabled: boolean;
    can_register_for_multiple_tickets: boolean;
    duration_interval: string;
    virtual_info: VirtualInfo;
    geo_longitude: string;
    geo_latitude: string;
    geo_address_info: {
        city: string;
        type: string;
        region: string;
        address: string;
        country: string;
        place_id: string;
        city_state: string;
        description: string;
        full_address: string;
        mode: string;
    };
    geo_address_visibility: string;
};

export type Host = {
    api_id: string;
    avatar_url: string;
    bio_short: string | null;
    instagram_handle: string | null;
    last_online_at: string;
    linkedin_handle: string | null;
    name: string;
    tiktok_handle: string | null;
    timezone: string;
    twitter_handle: string | null;
    username: string | null;
    website: string | null;
    youtube_handle: string | null;
    is_visible: boolean;
    access_level: string;
};

export type CoverImage = {
    vibrant_color: string | null;
    colors: string[];
};

export type TicketType = {
    api_id: string;
    cents: number | null;
    currency: string | null;
    description: string | null;
    ethereum_token_requirements: any[];
    event_api_id: string;
    is_flexible: boolean;
    max_capacity: number | null;
    min_cents: number | null;
    name: string;
    require_approval: boolean;
    type: string;
    valid_end_at: string | null;
    valid_start_at: string | null;
    position: string;
    num_tickets_registered: number;
    currency_info: string | null;
    num_guests: number;
};

export type GuestData = {
    ticket_key: string | null;
    meeting_details: {
        approval_status: string | null;
        proxy_key: string | null;
    };
    approval_status: string | null;
    proxy_key: string | null;
    session_details: any | null;
    event_tickets: any[];
    payments: any[];
};

export type Role = {
    type: string;
    access_level: string;
    secret_key: string;
    is_manager: boolean;
    num_guests_approved: number;
    num_tickets_registered: number;
};

export type TicketInfo = {
    price: number | null;
    is_free: boolean;
    max_price: number | null;
    is_sold_out: boolean;
    spots_remaining: number | null;
    is_near_capacity: boolean;
    require_approval: boolean;
    currency_info: string | null;
};

export type Entry = {
    api_id: string;
    event: Event;
    cover_image: CoverImage;
    calendar: Calendar;
    start_at: string;
    hosts: Host[];
    guest_count: number;
    ticket_count: number;
    ticket_info: TicketInfo;
    featured_guests: any[];
    role: Role;
};

export type EntriesResponse = {
    entries: Entry[];
    has_more: boolean;
};


export type GetEventResponse = {
    api_id: string;
    calendar: Calendar;
    can_register_for_multiple_tickets: boolean;
    categories: any[];
    cover_image: CoverImage;
    description_mirror: {
        type: "doc";
        content: Array<{
            type: "paragraph";
            content: Array<{
                text: string;
                type: "text";
                marks?: Array<{
                    type: "link" | "bold";
                    attrs?: {
                        href?: string;
                    };
                }>;
            }>;
        }>;
    } | null;
    eth_address_requirement: any | null;
    event: Event;
    event_invite: any | null;
    featured_guests: any[];
    featured_infos: any[];
    font_title: any | null;
    google_measurement_id: any | null;
    guest_count: number;
    guest_data: GuestData;
    hosts: Host[];
    is_flagged: boolean;
    locale: string;
    meta_pixel_id: any | null;
    payment_methods: any[];
    phone_number_requirement: any | null;
    referred_by: any | null;
    refund_policy: any | null;
    registration_questions: any[];
    role: Role;
    series_info: any;
    sessions: any[];
    solana_address_requirement: any | null;
    sold_out: boolean;
    start_at: string;
    stripe_account_id: any | null;
    subscribed_to_calendar: boolean;
    theme_meta: any;
    ticket_count: number;
    ticket_info: TicketInfo;
    ticket_types: any[];
    tint_color: string;
};

export type { Calendar, VirtualInfo, Event, Host, CoverImage, TicketType, GuestData, Role, TicketInfo, Entry, EntriesResponse, GetEventResponse };