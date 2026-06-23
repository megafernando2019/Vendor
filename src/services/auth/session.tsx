export type LoginUserResponse = {
  status: number;
  statusText: string;
  access_token?: string;
  refresh_token?: string;
  user?: Record<string, unknown>;
  message?: string;
};

export async function loginUser(
  email: string,
  password: string
): Promise<LoginUserResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data: Record<string, unknown> | null = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return {
      status: res.status,
      statusText: res.statusText,
      ...(data ?? {}),
    } as LoginUserResponse;
  } catch {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "Error de conexión con el servidor",
    };
  }
}

export async function logoutUser(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(apiUrl + "logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  try {
    return await res.json();
  } catch {
    return {};
  }
}
