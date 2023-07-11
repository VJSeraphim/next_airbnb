'use client'

import { useMemo, useState } from "react"

import useRentModal from "@/app/hooks/useRentModal"
import Modal from "./Modal"


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal()

    const [step, setStep] = useState(STEPS.CATEGORY)

    const onBack = () => {
        setStep((val) => val - 1)
    }

    const onNext = () => {
        setStep((val => val + 1))
    }

    const actionLabel = useMemo(() => {
        if(step === STEPS.PRICE) {
            return 'Create'
        }

        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.CATEGORY) {
            return undefined
        }

        return 'Back'
    }, [step])

    return (
        <Modal 
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={rentModal.onClose}
            actionLabel="Submit"
            title="Airbnb Your Home"
        />
    )
}

export default RentModal