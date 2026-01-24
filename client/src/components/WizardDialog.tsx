"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import SelfEmploymentWizard from "@/components/SelfEmploymentWizard"
import { useState } from "react"

interface WizardDialogProps {
    children: React.ReactNode
}

export function WizardDialog({ children }: WizardDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 h-[80vh] md:h-[700px] overflow-hidden sm:rounded-2xl">
                <SelfEmploymentWizard
                    embedded={true}
                    // onClose={() => setOpen(false)} - убираем дублирующую кнопку закрытия
                    className="h-full border-none shadow-none bg-background"
                />
            </DialogContent>
        </Dialog>
    )
}
