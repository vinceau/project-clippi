import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { Select } from "@/ui/Select/Select";
import { Button } from "@/ui/Button/Button";
import { Input } from "@/ui/Input/Input";
import { Modal } from "@/ui/Modal/Modal";
import { Field, Label, Text } from "../Form";

import styles from "./ProfileSelection.module.css";

const generateOptions = (opts: string[]) =>
  opts.map((o) => ({
    key: o,
    text: o,
    value: o,
  }));

export interface ProfileSelectorProps {
  initialOptions: string[];
  value: string;
  onChange: (value: string) => void;
  onCreateProfile: (name: string) => void;
}

export function ProfileSelector({ initialOptions, value, onChange, onCreateProfile }: ProfileSelectorProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");

  const trimmed = newName.trim();

  const isDuplicate = trimmed.length > 0 && initialOptions.some((o) => o.toLowerCase() === trimmed.toLowerCase());

  const openModal = () => {
    setNewName("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewName("");
    setModalOpen(false);
  };

  const handleCreate = () => {
    if (!trimmed || isDuplicate) return;
    onCreateProfile(trimmed);
    toast.info(
      <>
        Created <b>{trimmed}</b> profile.
      </>,
      {
        toastId: `${trimmed}-profile-created`,
      }
    );
    setModalOpen(false);
    setNewName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isDuplicate) {
      handleCreate();
    }
  };

  const options = generateOptions(initialOptions);
  return (
    <div className={styles.outer}>
      <Field>
        <Label>Current Profile</Label>
        <div className={styles.row}>
          <Select fluid options={options} placeholder="Select a profile" value={value} onChange={(v) => onChange(v)} />
          <div className={styles.newProfileButton}>
            <Button onClick={openModal}>
              <Plus size={16} /> New profile
            </Button>
          </div>
        </div>
        <Text>
          Combo profiles are used to determine the combo and conversion events as well as the combos found by the{" "}
          <b>Replay Processor</b>. You can create new profiles by clicking the "New profile" button.
        </Text>
      </Field>

      <Modal open={modalOpen} onClose={closeModal} title="Create New Profile">
        <Modal.Content>
          <Input
            fluid
            placeholder="Profile name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {isDuplicate && <p className={styles.error}>A profile with this name already exists.</p>}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button primary disabled={!trimmed || isDuplicate} onClick={handleCreate}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
