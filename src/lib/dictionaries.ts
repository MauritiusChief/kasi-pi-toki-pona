export const AVAILABLE_DICTIONARIES = [
  {
    id: "default",
    name: "默认字典",
    file: "/dictionary_default.csv",
  },
  {
    id: "emoji",
    name: "Emoji 字典",
    file: "/dictionary_emoji.csv",
  },
] as const;

export type DictionaryConfig = (typeof AVAILABLE_DICTIONARIES)[number];
export type DictionaryId = DictionaryConfig["id"];

const DICTIONARY_MAP: Record<DictionaryId, DictionaryConfig> =
  AVAILABLE_DICTIONARIES.reduce(
    (accumulator, dictionary) => {
      accumulator[dictionary.id] = dictionary;
      return accumulator;
    },
    {} as Record<DictionaryId, DictionaryConfig>,
  );

export function getDictionaryConfigById(id: DictionaryId): DictionaryConfig {
  const dictionary = DICTIONARY_MAP[id];
  if (!dictionary) {
    throw new Error(`Unknown dictionary id: ${id}`);
  }
  return dictionary;
}
