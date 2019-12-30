import * as React from "react";

import { Howl } from "howler";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { connectToSlippi } from "@/lib/realtime";
import { Dispatch, iRootState } from "@/store";
import { notify } from "../lib/utils";
import { SlippiPage } from "./Slippi";
import { TwitchClip, TwitchConnectButton } from "./TwitchConnect";
import { sp } from "../lib/sounds";

const noop = () => {
    console.log("inside callback");
};

const FileInput: React.FC<{
    value: string[];
    onChange: any;
}> = ({ value, onChange = noop, ...rest }) => {
    console.log(value);
    return (
        <div>
            {Boolean(value && value.length) && (
                <div>Selected files: {
                    value.map((fname: string) => {
                        return <div key={fname} onClick={(e) => {
                            e.preventDefault();
                            console.log(`playing: ${fname}`);
                            sp.playSound(fname).catch(console.error);
                            console.log(`done playing ${fname}`);
                        }}>Name: {fname}</div>
                    })
                }</div>
            )}
            <label>
                Click to select some files...
      <input
                    {...rest}
                    style={{ display: "none" }}
                    type="file"
                    onChange={(e: any) => {
                        console.log([...e.target.files]);
                        onChange([...e.target.files]);
                    }}
                />
            </label>
        </div>
    );
};


const SoundPlayer = () => {
    let sound: Howl | null = null;
    const onChange = (event: any) => {
        const files = event.target.files;
        // Read the file from the input
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const data = reader.result;
                // Create a Howler sound
                sound = new Howl({
                    src: data,
                    format: file.name.split(".").pop().toLowerCase(), // always give file extension: this is optional but helps
                });
            });
            reader.readAsDataURL(file);
        }
    };
    const playSound = () => {
        if (sound) {
            sound.play();
        }
    }
    return (
        <div>
            <input type="file" onChange={onChange} />
            <button onClick={playSound}>play</button>
        </div>
    );
};

const Count = () => {
    const slippiPort = useSelector((state: iRootState) => state.slippi.port);
    const authToken = useSelector((state: iRootState) => state.twitch.authToken);
    const dispatch = useDispatch<Dispatch>();

    const Outer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    `;

    const handleClick = () => {
        console.log("notify clicked");
        notify("Notification title", "Notification body");
    };
    const handleConnect = (port: string) => {
        console.log("updating port in redux");
        dispatch.slippi.setPort(port);
        console.log("connecting to port");
        connectToSlippi(parseInt(port, 10)).catch(console.error);
    };

    const [fileValue, setFileValue] = React.useState<string[]>([]);
    const fileSelect = (f: any[]) => {
        console.log(`got back ${f}`);
        const fl = [];
        for (const ff of f) {
            console.log(ff);
            sp.addSound(ff.name, ff.path);
            fl.push(ff.name);

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const data = reader.result;
                console.log(data);
            });
            reader.readAsDataURL(ff);
        }
        console.log(f);
        setFileValue(fl);

    };

    return (
        <Outer>
            <div style={{ width: 120 }}>
                <h1>Slippi</h1>
                <SlippiPage initialPort={slippiPort} onSubmit={handleConnect} />
            </div>
            <button onClick={handleClick}>notify</button>
            <SoundPlayer />
            <FileInput value={fileValue} onChange={fileSelect} />
            {authToken ?
                <TwitchClip accessToken={authToken} />
                :
                <TwitchConnectButton onClick={() => dispatch.twitch.fetchTwitchToken()} />
            }
        </Outer>
    );
};

export const Panel = Count;
