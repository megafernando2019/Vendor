import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";

export type ProgramList = {
  id: string;
  name: string;
  programIds: Array<string | number>;
};

export const PROGRAM_LISTS_STORAGE_KEY = "program_lists:v1";

const DEFAULT_PROGRAM_LISTS: ProgramList[] = [
  {
    id: "especial-europa",
    name: "Especial Europa",
    programIds: [],
  },
  {
    id: "lo-mejor-de-asia",
    name: "Lo mejor de Asia",
    programIds: [],
  },
];

export function formatProgramCount(count: number) {
  return `${count} Programa${count === 1 ? "" : "s"}`;
}

export function readProgramLists(): ProgramList[] {
  const stored = getLocalStorage<ProgramList>(PROGRAM_LISTS_STORAGE_KEY);

  if (stored.length === 0) {
    return DEFAULT_PROGRAM_LISTS.map((list) => ({ ...list }));
  }

  return stored;
}

export function writeProgramLists(lists: ProgramList[]) {
  setLocalStorage(PROGRAM_LISTS_STORAGE_KEY, lists);
}

export function addProgramToList(
  listId: string,
  programId: string | number,
): ProgramList[] {
  const lists = readProgramLists();
  const nextLists = lists.map((list) => {
    if (list.id !== listId) return list;

    if (list.programIds.includes(programId)) {
      return list;
    }

    return {
      ...list,
      programIds: [...list.programIds, programId],
    };
  });

  writeProgramLists(nextLists);
  return nextLists;
}

export function createProgramList(
  name: string,
  initialProgramId?: string | number,
): ProgramList[] {
  const trimmedName = name.trim();
  if (!trimmedName) return readProgramLists();

  const lists = readProgramLists();
  const id = `list-${Date.now()}`;
  const programIds =
    initialProgramId != null && initialProgramId !== ""
      ? [initialProgramId]
      : [];

  const nextLists = [
    ...lists,
    {
      id,
      name: trimmedName,
      programIds,
    },
  ];

  writeProgramLists(nextLists);
  return nextLists;
}
