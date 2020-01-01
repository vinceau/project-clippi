import { Howl } from "howler";
import { isDevelopment } from "./utils";

import { readFile } from "common/utils";

const generateHowlOptions = async (soundPath: string): Promise<any> => {
    if (isDevelopment) {
        // If we're in a development server we need to read the data from the filesystem
        // since we can't access the files from the server.
        const soundData = await readFile(soundPath);
        // Assume mp3 file extension if not specified
        const fileExt = soundPath.split(".").pop() || "mp3";

        return ({
            src: `data:audio/${fileExt};base64,${soundData.toString("base64")}`,
            format: fileExt.toLowerCase(), // always give file extension: this is optional but helps
        });
    }

    return ({
        src: [soundPath],
        html5: true,
    });
};

export interface SoundMap {
    [name: string]: string;
}

export class SoundPlayer {
    public sounds: SoundMap;
    private readonly howls: Map<string, Howl>;
    private currentSound: Howl | undefined;

    public constructor(oldData?: string) {
        this.sounds = JSON.parse(oldData || "{}");
        this.howls = new Map<string, Howl>();
    }

    public serialize(): string {
        return JSON.stringify(this.sounds);
    }

    public deserialize(jsonStr: string): SoundMap {
        this.sounds = JSON.parse(jsonStr);
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
        this.sounds[name] = filePath;
    }

    public removeSound(name: string): void {
        delete this.sounds[name];
    }

    public getSoundPath(name: string): string {
        return this.sounds[name];
    }

    public renameSound(oldName: string, newName: string): void {
        if (!this.sounds[oldName]) {
            throw new Error(`No sound called: ${oldName}`);
        }
        if (this.sounds[newName]) {
            throw new Error(`${newName} already taken`);
        }
        this.sounds[newName] = this.sounds[oldName];
        delete this.sounds[oldName];
    }

    public async playSound(name: string): Promise<void> {
        this.stop();

        this.currentSound = this.howls.get(name);
        if (!this.currentSound) {
            const soundPath = this.sounds[name];
            if (!soundPath) {
                throw new Error(`No sound with name: ${name}`);
            }

            const howlOptions = await generateHowlOptions(soundPath);
            this.currentSound = new Howl(howlOptions);
            this.howls.set(name, this.currentSound);
        }
        this.currentSound.play();
    }
}

export const sp: SoundPlayer = new SoundPlayer();
