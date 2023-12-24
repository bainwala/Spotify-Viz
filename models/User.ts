export type User = {
    country: string,
    display_name: string,
    email: string,
    followers: {
        href: string | null,
        total: number
    },
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: {
        spotify: string
    }
    images: {
        url: string,
        height: number,
        width: number
    }[],
    href: 'string',
    id: string,
    product: string,
    type: 'string',
    uri: string
}