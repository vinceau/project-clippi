import type { TwitchClip } from "common/types";
import React from "react";

import { Pagination } from "./Pagination/Pagination";
import { TwitchClipInfo } from "./TwitchClipInfo";

export function TwitchClipList({
  clips,
  onRemove,
  clipsPerPage = 20,
}: {
  clips: TwitchClip[];
  onRemove: (key: string) => void;
  clipsPerPage?: number;
}) {
  const totalPages = Math.ceil(clips.length / clipsPerPage);
  const [activePage, setActivePage] = React.useState(1); // Pagination needs to start from 1

  const startIndex = (activePage - 1) * clipsPerPage;
  const endIndex = activePage * clipsPerPage;
  const currentPageClips = clips.slice(startIndex, endIndex);

  return (
    <div>
      {currentPageClips.map((v) => (
        <TwitchClipInfo key={v.clipID} clip={v} onRemove={onRemove} />
      ))}
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
        <div>
          Page {activePage} of {totalPages}
        </div>
        <Pagination
          activePage={activePage}
          onChange={(activePage) => setActivePage(activePage)}
          totalPages={totalPages}
        />
        <div>{clips.length} clips</div>
      </div>
    </div>
  );
}
