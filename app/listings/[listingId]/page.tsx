import ListingClient from "./ListingClient"
import ClientOnly from "@/app/components/ClientOnly"
import EmptyState from "@/app/components/EmptyState"
import getReservations from "@/app/actions/getReservations"
import getCurrentUser from "@/app/actions/getCurrentUser"
import getListingsById from "@/app/actions/getListingById"

interface IParams {
    listingId?: string
}

const page = async ({ params } : { params : IParams }) => {
    const listing = await getListingsById(params)
    const reservations = await getReservations(params)
    const currentUser = await getCurrentUser()

    if(!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient 
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default page