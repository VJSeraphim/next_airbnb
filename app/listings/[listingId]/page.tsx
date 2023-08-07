import ClientOnly from "@/app/components/ClientOnly"
import getListingsById from "../../actions/getListingById"
import EmptyState from "@/app/components/EmptyState"
import getCurrentUser from "@/app/actions/getCurrentUser"
import ListingClient from "./ListingClient"

interface IParams {
    listingId?: string
}

const page = async ({ params } : { params : IParams }) => {
    const listing = await getListingsById(params)
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
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default page