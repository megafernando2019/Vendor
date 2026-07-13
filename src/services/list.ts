import { getApiBaseUrl } from "@/lib/searchValidation";

export type ListAgencyPayload = {
  agency_id: number;
  user_id: number;
  name: string;
};

export type CreateListAgencyPayload = ListAgencyPayload;
export type DeleteListAgencyPayload = ListAgencyPayload;

export type AddProgramToListProgram = {
  mt: string;
  name: string;
  order: string;
};

export type AddProgramToListPayload = {
  user_id: number;
  list_name: string;
  program: AddProgramToListProgram;
};

export type DeleteProgramInListPayload = {
  user_id: number;
  list_name: string;
  mt: string;
};

export type ShowListsPayload = {
  user_id: number;
  name_list?: string;
  type_view: 0 | 1;
};

export type AgencyListProgram = {
  mt: string;
  name: string;
  order: string;
};

export type AgencyListItem = {
  name: string;
  total_elements: number;
  programs: AgencyListProgram[];
};

async function postAgencyList(token: string, path: string, payload: unknown) {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "NEXT_PUBLIC_API_URL no está configurada",
    };
  }

  const res = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ...(data ?? {}),
  };
}

async function getShowLists(token: string, payload: ShowListsPayload) {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "NEXT_PUBLIC_API_URL no está configurada",
    };
  }

  const params = new URLSearchParams({
    user_id: String(payload.user_id),
    type_view: String(payload.type_view),
  });

  const nameList = payload.name_list?.trim() ?? "";
  if (nameList) {
    params.set("name_list", nameList);
  }

  // Confirmed external shape: /agency/show_lists?user_id=3&type_view=1
  const url = `${apiUrl}agency/show_lists?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ...(data ?? {}),
  };
}

export async function createListAgency(
  token: string,
  payload: CreateListAgencyPayload,
) {
  return postAgencyList(token, "agency/create_list_agency", payload);
}

export async function deleteListAgency(
  token: string,
  payload: DeleteListAgencyPayload,
) {
  return postAgencyList(token, "agency/delete_list_agency", payload);
}

export async function addProgramToList(
  token: string,
  payload: AddProgramToListPayload,
) {
  return postAgencyList(token, "agency/add_program_to_list", payload);
}

export async function deleteProgramInList(
  token: string,
  payload: DeleteProgramInListPayload,
) {
  return postAgencyList(token, "agency/delete_program_in_list", payload);
}

export async function showLists(token: string, payload: ShowListsPayload) {
  return getShowLists(token, payload);
}
