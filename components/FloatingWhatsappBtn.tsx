'use client'
import React from 'react'
import { FloatingWhatsApp } from 'react-floating-whatsapp'

export default function FloatingWhatsappBtn() {
    return (
        <FloatingWhatsApp
            phoneNumber="+44203 504 2344"
            accountName="Al Habib Travel"
            avatar="/img/logos/favicon.png"
            buttonStyle={{ width: '45px', height: '45px' }}
            statusMessage='Typically replies within 1 minute'
        />
    )
}
