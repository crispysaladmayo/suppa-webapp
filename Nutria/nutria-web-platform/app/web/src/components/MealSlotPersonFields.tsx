import { FormField } from './FormField.js';

type Slot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

type Props = {
  slot: Slot;
  setSlot: (s: Slot) => void;
  persons: Array<Record<string, unknown>>;
  personId: string;
  setPersonId: (id: string) => void;
};

export function MealSlotPersonFields({ slot, setSlot, persons, personId, setPersonId }: Props) {
  return (
    <>
      <FormField label="Waktu makan" fieldId="meal-slot">
        <select
          id="meal-slot"
          className="input"
          value={slot}
          onChange={(ev) => setSlot(ev.target.value as Slot)}
        >
          <option value="breakfast">Sarapan</option>
          <option value="lunch">Makan siang</option>
          <option value="dinner">Makan malam</option>
          <option value="snack">Camilan</option>
        </select>
      </FormField>
      <FormField label="Untuk siapa" fieldId="meal-person">
        <select
          id="meal-person"
          className="input"
          value={personId}
          onChange={(ev) => setPersonId(ev.target.value)}
        >
          {persons.map((p) => (
            <option key={String(p.id)} value={String(p.id)}>
              {String(p.displayName)}
            </option>
          ))}
        </select>
      </FormField>
    </>
  );
}
