"use client"
import React from 'react'
import { Button } from "@/components/ui/button"

const PrimaryButton = ({text, handler ,disabled } : {text : string;handler : () => void ;disabled : boolean}) => {
  return (
    <Button className='bg-orange-400 hover:bg-[#ea580c]' disabled={disabled} onClick={handler} >{text}</Button>
  )
}

export default PrimaryButton
