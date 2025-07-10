import React from 'react'
import { LuMail, LuPhone } from 'react-icons/lu'

export default function Topbar() {
    return (
        <div className="px-14 hidden min-[629px]:flex pt-1.5 pb-2 justify-between bg-brand-blue/95 text-white items-center border-b border-gray-500">
            <div className="flex gap-x-8 text-sm">
                <span>Have any questions?</span>
                <div className="flex items-center gap-x-1.5">
                    <LuPhone size={16} className="mt-0.5" />
                    <strong className="font-normal">+923331234567</strong>
                </div>
                <div className="flex items-center gap-x-1.5">
                    <LuMail size={16} className="mt-0" />
                    <strong className="font-normal">info@icepcssinstitute.com</strong>
                </div>
            </div>
        </div>
    )
}
