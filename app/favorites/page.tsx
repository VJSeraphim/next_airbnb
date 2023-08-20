import EmptyState from "../components/EmptyState"
import ClientOnly from "../components/ClientOnly"

import getCurrentUser from "../actions/getCurrentUser"

const ListingPage = async () => {
    return (
        <ClientOnly>
            <EmptyState 
                title="No Favorites Found"
                subtitle="There are no favorite items found."
            />
        </ClientOnly>
    )
}

export default ListingPage