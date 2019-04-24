declare interface Action {
    action: 'quick' | 'full' | 'reaction' | 'move' | 'free',
    name: string,
    effect: string,
    tags?: Tag[]
}

declare interface System extends CCItem {
    type: string,
    sp: number,
    tags: TagList,
    effect: string,
    actions?: Action[]
    description?: string,
    data_type: "system",
    aptitude: Aptitude,
    talent_item?: true,
    talent_id?: string,
    talent_rank?: number,
    brew?: string
}