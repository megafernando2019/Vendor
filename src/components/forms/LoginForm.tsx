"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { persistor } from "@/src/redux/store";
import { clearPreLoginStorage } from "@/src/utils/clearPreLoginStorage";

function getSafeCallbackUrl(url: string | null): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) {
    return "/";
  }
  return url;
}

export default function LoginForm() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const isSubmitting = useRef(false);

  useEffect(() => {
    clearPreLoginStorage();
    void persistor.purge();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      let data: { success?: boolean; message?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const message =
        typeof data?.message === "string" && data.message.trim().length > 0
          ? data.message
          : `Error ${res.status}`;

      if (res.ok && data?.success) {
        toast.success("Bienvenido");
        const callbackUrl = new URLSearchParams(window.location.search).get(
          "callbackUrl"
        );
        router.push(getSafeCallbackUrl(callbackUrl));
        return;
      }

      toast.error(message);
    } catch {
      toast.error("Error de conexión con el servidor");
    } finally {
      isSubmitting.current = false;
    }
  }; 
  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12 mb-25">
            <input
              className="input"
              onChange={handleChange}
              type="text"
              name="email"
              id="email"
              placeholder="E-mail"
            />
          </div>
          <div className="col-lg-12 mb-25">
            <input
              className="input"
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>
          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="review-checkbox d-flex align-items-center mb-25">
                <input className="tg-checkbox" type="checkbox" id="australia" />
                <label htmlFor="australia" className="tg-label">Remember me</label>
              </div>
              <div className="tg-login-navigate mb-25">
                <Link href="/register">Register Now</Link>
              </div>
            </div>
            <button type="submit" className="tg-btn w-100">Sign In</button>
          </div>
        </div>
      </form>
    </>
  );
}