"use client"

import { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ReorderSectionsDialogProps {
    sectionOrder: string[]
    setSectionOrder: (order: string[]) => void
}

const sectionLabels: Record<string, string> = {
    summary: "Professional Summary",
    experience: "Work Experience",
    projects: "Projects",
    education: "Education",
    skills: "Skills",
}

export function ReorderSectionsDialog({ sectionOrder, setSectionOrder }: ReorderSectionsDialogProps) {
    const [items, setItems] = useState(sectionOrder)
    const [open, setOpen] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id)
                const newIndex = items.indexOf(over.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleSave = () => {
        setSectionOrder(items)
        setOpen(false)
    }

    // Update local state when prop changes/dialog opens
    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            setItems(sectionOrder)
        }
        setOpen(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                    Reorder Sections
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reorder Sections</DialogTitle>
                    <DialogDescription>
                        Drag and drop to rearrange the sections of your resume.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {items.map((id) => (
                                    <SortableItem key={id} id={id} label={sectionLabels[id] || id} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SortableItem(props: { id: string; label: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between rounded-md border bg-background p-3 shadow-sm hover:bg-accent/50 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
        >
            <span className="font-medium text-sm">{props.label}</span>
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    )
}
