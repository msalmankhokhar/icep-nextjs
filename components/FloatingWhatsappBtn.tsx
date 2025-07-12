'use client'
import { phoneNumber } from '@/Constants'
import React from 'react'
import { FloatingWhatsApp } from 'react-floating-whatsapp'

export default function FloatingWhatsappBtn() {
    return (
        <FloatingWhatsApp
            phoneNumber={phoneNumber.withCountryCode}
            accountName="ICEP Institute"
            avatar="/images/logos/avatars/avatar-blue-bg.png"
            buttonStyle={{ width: '45px', height: '45px' }}
            statusMessage='Typically replies within 1 minute'
        />
    )
}
