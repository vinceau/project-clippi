const randomEvents: string[] = [
    "Natalie Tran makes a lamington video...",
    "Jesus returns...",
    "Shippiddge releases Starter Squad 10...",
    "aMSa wins a major...",
    "Hungrybox lands a rest...",
    "Wizzrobe lands a grab...",
    "n0ne does something sick...",
    "Zain misses a pivot...",
    "someone says that Melee is a dead game...",
];

export const generateRandomEvent = () => {
    const d = new Date();
    return randomEvents[d.getMinutes() % randomEvents.length];
};
