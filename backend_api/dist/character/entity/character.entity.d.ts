export declare class Character {
    name: string;
    level: number;
    hitPoints: number;
    tempHitPoints?: number;
    classes: {
        name: string;
        hitDiceValue: number;
        classLevel: number;
    }[];
    stats: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    items: {
        name: string;
        modifier: {
            affectedObject: string;
            affectedValue: string;
            value: number;
        };
    }[];
    defenses: {
        type: string;
        defense: 'immunity' | 'resistance';
    }[];
}
