
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
}

export function InfoDialog({ open, onOpenChange, title, children }: InfoDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] w-[95vw] sm:w-full max-w-2xl p-0 bg-transparent border-none shadow-none flex flex-col"
            >
                <div className="relative w-full rounded-2xl bg-card shadow-2xl ring-1 ring-border overflow-y-auto">
                    <div className="p-6 pt-10 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Info className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
                        </div>

                        <div className="space-y-6 text-foreground/90">
                            {children}
                        </div>

                        <div className="mt-8 pt-6 border-t flex justify-end">
                            <Button
                                onClick={() => onOpenChange(false)}
                                className="rounded-xl px-8 font-bold"
                            >
                                Понятно
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
