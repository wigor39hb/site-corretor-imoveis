"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--navy-900)",
      }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex"
        style={{
          width: "45%",
          background:
            "linear-gradient(135deg, var(--navy-800) 0%, var(--navy-900) 100%)",
          borderRight: "1px solid rgba(201,169,110,0.1)",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--gold-500)",
            marginBottom: "24px",
          }}
        >
          Painel Administrativo
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "48px",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Gerencie seu negócio com{" "}
          <em style={{ color: "var(--gold-500)" }}>eficiência</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "16px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
          }}
        >
          Controle seus imóveis, empreendimentos e perfil em um único lugar.
        </p>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--gold-500)",
                marginBottom: "8px",
              }}
            >
              Entrar
            </div>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Acesse o painel com suas credenciais
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(224,82,82,0.1)",
                border: "1px solid rgba(224,82,82,0.3)",
                borderRadius: "4px",
                padding: "12px 16px",
                marginBottom: "24px",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                color: "#E05252",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-inter)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "14px 44px 14px 16px",
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--gold-500)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.25)",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-inter)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                }}
              >
                Senha
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "14px 44px 14px 16px",
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--gold-500)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.25)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, var(--gold-500), var(--gold-400))",
                color: "var(--navy-900)",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "16px",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "8px",
                transition: "opacity 0.3s ease",
              }}
            >
              {loading && (
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(13,27,42,0.3)",
                    borderTop: "2px solid var(--navy-900)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
