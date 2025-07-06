import Image from 'next/image'
import React from 'react'

export default function Logo() {
    return (
        <div className="flex items-center gap-x-2">
            <Image
                alt='icep logo'
                src={'/images/logos/logo.png'}
                width={65}
                height={65}
            />
            <div className="flex flex-col gap-y-1.5 tracking-wide">
                <p className="text-white text-xl font-semibold leading-none">ICEP</p>
                <p className="text-white text-[0.65rem] font-light">Institute of Competitive<br />Exams Prepration</p>
            </div>
        </div>
    )
}
