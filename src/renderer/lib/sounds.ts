import { Howl } from "howler";

import { readFile } from "common/utils";

const objToStrMap = (obj: object) => {
    const strMap = new Map();
    for (const k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
};

const strMapToObj = (strMap: Map<string, string>): object => {
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
};

export class SoundPlayer {
    public sounds: Map<string, string>;
    private readonly howls: Map<string, Howl>;
    private currentSound: Howl | undefined;

    public constructor(oldData?: string) {
        this.sounds = new Map<string, string>(oldData ? JSON.parse(oldData) : undefined);
        this.howls = new Map<string, Howl>();
    }

    public serialize(): string {
        return JSON.stringify(strMapToObj(this.sounds));
    }

    public deserialize(jsonStr: string): Map<string, string> {
        this.sounds = objToStrMap(JSON.parse(jsonStr));
        return this.sounds;
    }

    public stop(): void {
        // Stop the current sound if something is already playing
        if (this.currentSound) {
            this.currentSound.stop();
        }
        this.currentSound = undefined;
    }

    public addSound(name: string, filePath: string): void {
        this.sounds.set(name, filePath);
    }

    public removeSound(name: string): void {
        this.sounds.delete(name);
    }

    public async playSound(name: string): Promise<void> {
        this.stop();

        this.currentSound = this.howls.get(name);
        if (!this.currentSound) {
            const soundPath = this.sounds.get(name);
            if (!soundPath) {
                throw new Error(`No sound with name: ${name}`);
            }
            const soundData = await readFile(soundPath);
            // Assume mp3 file extension if not specified
            const fileExt = soundPath.split(".").pop() || "mp3";

            console.log(soundData.toString("base64"));
            this.currentSound = new Howl({
                src: `data:audio/${fileExt};base64,${soundData.toString("base64")}`,
                format: fileExt.toLowerCase(), // always give file extension: this is optional but helps
            });
            this.howls.set(name, this.currentSound);
        }
        this.currentSound.play();
    }
}

export const sp: SoundPlayer = new SoundPlayer();
