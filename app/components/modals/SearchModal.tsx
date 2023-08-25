'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import Modal from './Modal'
import { Range } from 'react-date-range'
import dynamic from 'next/dynamic'
import qs from 'query-string'
import { formatISO, setDate } from 'date-fns'

import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect'
import useSearchModal from '@/app/hooks/useSearchModal'

import Heading from '../Heading'
import Calendar from '../inputs/Calendar'
import Counter from '../inputs/Counter'

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const router = useRouter()
    const params = useSearchParams()
    const searchModal = useSearchModal()

    const [step, setStep] = useState(STEPS.LOCATION)
    const [location, setLocation] = useState<CountrySelectValue>()
    const [guestCount, setGuestCount] = useState(1)
    const [roomCount, setRoomCount] = useState(1)
    const [bathroomCount, setBathroomCount] = useState(1)
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const Map = useMemo(() => 
        dynamic(() => import('../Map'), {
            ssr: false
        })
    , [location])

    const onBack = useCallback(() => {
        setStep((val) => val - 1)
    }, [])

    const onNext = useCallback(() => {
        setStep((val) => val + 1)
    }, [])

    const onSubmit = useCallback(async () => {
        if(step !== STEPS.INFO) {
            return onNext()
        }

        let currentQuery = {}

        if(params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        }

        if(dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate)
        }

        if(dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true })

        setStep(STEPS.LOCATION)
        searchModal.onClose()
        router.push(url)
    }, [
        step,
        searchModal,
        location,
        router,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        onNext,
        params
    ])

    const actionLabel = useMemo(() => {
        if(step === STEPS.INFO) {
            return 'search'
        }

        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined
        }

        return 'Back'
    }, [])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Where's on your mind?"
                subtitle="Find some places for you."
            />
            <CountrySelect 
                value={location}
                onChange={(val) => setLocation(val as CountrySelectValue)}
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    if(step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="When do you plan to travel?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar 
                    value={dateRange}
                    onChange={(val) => setDateRange(val.selection)}
                />
            </div>
        )
    }

    if(step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gpa-8">
                <Heading 
                    title="More Info"
                    subtitle="Find perfect place for you."
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are coming with you?"
                    value={guestCount}
                    onChange={(val) => setGuestCount(val)} 
                />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(val) => setRoomCount(val)} 
                />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many Bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(val) => setBathroomCount(val)} 
                />
            </div>
        )
    }

    return (
        <Modal 
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={searchModal.onOpen}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />  
    )
}

export default SearchModal