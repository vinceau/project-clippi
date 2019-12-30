import { Howl } from "howler";

import { readFile } from "common/utils";

export class SoundPlayer {
    private readonly filePaths: Map<string, string>;
    private readonly howls: Map<string, Howl>;
    private currentSound: Howl | undefined;

    public constructor(oldData?: string) {
        this.filePaths = new Map<string, string>(oldData ? JSON.parse(oldData) : undefined);
        this.howls = new Map<string, Howl>();
    }

    public addSound(name: string, filePath: string): void {
        this.filePaths.set(name, filePath);
    }

    public async playSound(name: string): Promise<void> {
        // Stop the current sound if something is already playing
        if (this.currentSound) {
            this.currentSound.stop();
        }

        this.currentSound = this.howls.get(name);
        if (!this.currentSound) {
            const soundPath = this.filePaths.get(name);
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
