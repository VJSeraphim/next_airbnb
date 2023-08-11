'use client'

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { eachDayOfInterval } from "date-fns"
import axios from "axios"

import Container from "@/app/components/Container"
import ListingHead from "@/app/components/listings/ListingHead"
import ListingInfo from "@/app/components/listings/ListingInfo"
import { categories } from "@/app/components/navbar/Categories"
import useLoginModal from "@/app/hooks/useLoginModal"
import { SafeListing, SafeUser } from "@/app/types"
import { Reservation } from "@prisma/client"
import { toast } from "react-hot-toast"

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    reservations?: Reservation[]
    listing: SafeListing & {
        user: SafeUser
    }
    currentUser?: SafeUser| null
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser
}) => {
    const loginModal = useLoginModal()
    const router = useRouter()

    const disableDates = useMemo(() => {
        let dates: Date[] = []

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })

            dates = [...dates, ...range]
        })

        return dates
    }, [reservations])

    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState(initialDateRange)

    const onCreateReservation = useCallback(() => {
        if(!currentUser) {
            return loginModal.onOpen()
        }

        setIsLoading(true)

        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(() => {
            toast.success("Successfully Reserved!")
            setDateRange(initialDateRange)
            //Redirection
            router.refresh()
        })
        .catch(() => {
            toast.error("Oops... Something Went Wrong!")
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [
        totalPrice,
        dateRange,
        listing?.id,
        router,
        currentUser,
        loginModal
    ])

    const category = useMemo(() => {
        return categories.find((item) => {
            item.label === listing.category
        })
    }, [listing.category])

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead 
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                    ">
                        <ListingInfo 
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient