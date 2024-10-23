"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
const LinkButton = ({text, handler ,disabled } : {text : string;handler : () => void ;disabled : boolean}) => {
  return (
    <Button className='bg-white text-orange-600 hover:bg-gray-200' disabled={disabled} onClick={handler} >{text}</Button>
  )
}

export default LinkButton
