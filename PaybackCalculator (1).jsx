import React, { useMemo, useState } from "react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
`;

const TIERS = [
  { meses: 12, limite: 4.8 },
  { meses: 24, limite: 9.6 },
  { meses: 36, limite: 14.4 },
];

function parseNumber(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatBRL(n) {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatMeses(n, casas = 1) {
  if (n === null || !Number.isFinite(n)) return "—";
  return `${n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })} m`;
}

function Field({ label, unit, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-widest uppercase mb-2"
        style={{ color: "#8FA9BE", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em" }}
      >
        {label}
      </span>
      <div
        className="flex items-center rounded-md overflow-hidden border"
        style={{ borderColor: "#2A4A63", background: "#0E1E2E" }}
      >
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 outline-none"
          style={{ color: "#EAF2F8", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.05rem" }}
        />
        {unit && (
          <span
            className="px-3 text-sm border-l"
            style={{ color: "#5E7C93", borderColor: "#2A4A63", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

function QuickSelect({ current, onPick }) {
  return (
    <div className="flex gap-2 mt-3">
      {TIERS.map((t) => {
        const active = parseNumber(current) === t.meses;
        return (
          <button
            key={t.meses}
            type="button"
            onClick={() => onPick(String(t.meses))}
            className="flex-1 rounded-md py-2 text-sm transition-colors border"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              borderColor: active ? "#FF6A3D" : "#2A4A63",
              background: active ? "rgba(255,106,61,0.12)" : "transparent",
              color: active ? "#FF8F66" : "#8FA9BE",
            }}
          >
            {t.meses}m
          </button>
        );
      })}
    </div>
  );
}

function Ruler({ fidelidade, limite, payback, aprovado }) {
  const hasData = fidelidade && limite !== null && payback !== null;
  const scaleMax = hasData ? Math.max(fidelidade, payback) : 36;
  const limitePct = hasData ? Math.min(100, (limite / scaleMax) * 100) : 40;
  const paybackPct = hasData ? Math.min(100, (payback / scaleMax) * 100) : 0;
  const overflow = hasData && payback > scaleMax * 1.0001;

  const ticks = [];
  const tickCount = 6;
  for (let i = 0; i <= tickCount; i++) {
    ticks.push((scaleMax / tickCount) * i);
  }

  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between mb-2">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "#5E7C93", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em" }}
        >
          Régua de fidelidade
        </span>
        <span
          className="text-xs"
          style={{ color: "#5E7C93", fontFamily: "'JetBrains Mono', monospace" }}
        >
          escala 0 – {scaleMax.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}m
        </span>
      </div>

      <div className="relative" style={{ height: "64px" }}>
        {/* base track */}
        <div
          className="absolute left-0 right-0 rounded-sm"
          style={{ top: "26px", height: "12px", background: "#14293D", border: "1px solid #2A4A63" }}
        />
        {/* approval zone (0 -> limite) */}
        <div
          className="absolute rounded-sm"
          style={{
            top: "26px",
            left: 0,
            width: `${limitePct}%`,
            height: "12px",
            background: "rgba(76,215,135,0.28)",
            borderTop: "1px solid #4CD787",
            borderBottom: "1px solid #4CD787",
          }}
        />
        {/* limite marker (40%) */}
        <div
          className="absolute"
          style={{ left: `${limitePct}%`, top: "14px", transform: "translateX(-50%)", textAlign: "center" }}
        >
          <div style={{ width: "2px", height: "36px", background: "#4CD787", margin: "0 auto" }} />
          <span
            className="block mt-1 text-[10px] whitespace-nowrap"
            style={{ color: "#4CD787", fontFamily: "'JetBrains Mono', monospace" }}
          >
            limite 40%
          </span>
        </div>
        {/* payback marker */}
        {hasData && (
          <div
            className="absolute"
            style={{
              left: `${paybackPct}%`,
              top: "-6px",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <span
              className="block text-[10px] mb-1 whitespace-nowrap font-medium"
              style={{ color: aprovado ? "#4CD787" : "#FF5A5A", fontFamily: "'JetBrains Mono', monospace" }}
            >
              payback
            </span>
            <div
              style={{
                width: 0,
                height: 0,
                margin: "0 auto",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: `8px solid ${aprovado ? "#4CD787" : "#FF5A5A"}`,
              }}
            />
          </div>
        )}
        {/* end tick (fidelidade) */}
        <div
          className="absolute"
          style={{ left: "100%", top: "26px", transform: "translateX(-50%)" }}
        >
          <div style={{ width: "1px", height: "12px", background: "#5E7C93" }} />
        </div>
      </div>

      <div className="flex justify-between mt-1">
        {ticks.map((t, i) => (
          <span
            key={i}
            className="text-[10px]"
            style={{ color: "#4A6478", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {t.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
          </span>
        ))}
      </div>

      {overflow && (
        <p className="text-xs mt-2" style={{ color: "#FF8F66", fontFamily: "'Inter', sans-serif" }}>
          Payback ultrapassa a fidelidade contratual — fora da régua.
        </p>
      )}
    </div>
  );
}

export default function PaybackCalculator() {
  const [custo, setCusto] = useState("");
  const [mensalidade, setMensalidade] = useState("");
  const [fidelidade, setFidelidade] = useState("36");

  const result = useMemo(() => {
    const c = parseNumber(custo);
    const m = parseNumber(mensalidade);
    const f = parseNumber(fidelidade);
    if (!c || !m || !f || c <= 0 || m <= 0 || f <= 0) return null;

    const payback = c / m;
    const limite = f * 0.4;
    const aprovado = payback <= limite;
    const margemMeses = limite - payback;
    const margemPct = (margemMeses / f) * 100;
    const mensalidadeMinima = c / limite;

    return { c, m, f, payback, limite, aprovado, margemMeses, margemPct, mensalidadeMinima };
  }, [custo, mensalidade, fidelidade]);

  const fNum = parseNumber(fidelidade);

  return (
    <div
      className="min-h-screen w-full flex justify-center py-10 px-4"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, #142B40 0%, #0E1E2E 45%, #0A1622 100%)",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(143,169,190,0.05) 0px, rgba(143,169,190,0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(143,169,190,0.05) 0px, rgba(143,169,190,0.05) 1px, transparent 1px, transparent 40px), radial-gradient(circle at 15% 10%, #142B40 0%, #0E1E2E 45%, #0A1622 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{FONT_IMPORT}</style>

      <div className="w-full max-w-4xl">
        {/* corner marks */}
        <div className="relative">
          <div
            className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 hidden sm:block"
            style={{ borderColor: "#3B5C77" }}
          />
          <div
            className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 hidden sm:block"
            style={{ borderColor: "#3B5C77" }}
          />

          <header className="mb-8 px-1">
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: "#FF6A3D", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Memorial de viabilidade
            </span>
            <h1
              className="mt-2 text-3xl sm:text-4xl"
              style={{ color: "#EAF2F8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Régua de Payback
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base" style={{ color: "#8FA9BE" }}>
              Uma venda só é viável quando o custo da obra retorna dentro de{" "}
              <span style={{ color: "#EAF2F8" }}>40% do prazo de fidelidade</span>. Preencha os três
              dados abaixo para medir a proposta contra essa régua.
            </p>
          </header>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "#2A4A63", background: "rgba(20,41,61,0.55)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT: inputs */}
              <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r" style={{ borderColor: "#2A4A63" }}>
                <h2
                  className="text-xs tracking-widest uppercase mb-6"
                  style={{ color: "#5E7C93", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em" }}
                >
                  Dados da proposta
                </h2>

                <div className="space-y-5">
                  <Field
                    label="Custo da obra"
                    unit="R$"
                    value={custo}
                    onChange={setCusto}
                    placeholder="0,00"
                  />
                  <Field
                    label="Mensalidade"
                    unit="R$"
                    value={mensalidade}
                    onChange={setMensalidade}
                    placeholder="0,00"
                  />
                  <div>
                    <Field
                      label="Fidelidade"
                      unit="meses"
                      value={fidelidade}
                      onChange={setFidelidade}
                      placeholder="36"
                    />
                    <QuickSelect current={fidelidade} onPick={setFidelidade} />
                  </div>
                </div>

                <div
                  className="mt-8 pt-6 border-t text-xs"
                  style={{ borderColor: "#22384C", color: "#4A6478", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  payback = custo ÷ mensalidade
                  <br />
                  aprovado ⇔ payback ≤ 0,40 × fidelidade
                </div>
              </div>

              {/* RIGHT: result */}
              <div className="p-6 sm:p-8 flex flex-col">
                <h2
                  className="text-xs tracking-widest uppercase mb-6"
                  style={{ color: "#5E7C93", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em" }}
                >
                  Resultado
                </h2>

                {!result ? (
                  <div
                    className="flex-1 flex items-center justify-center text-center text-sm rounded-md border border-dashed"
                    style={{ borderColor: "#2A4A63", color: "#5E7C93", minHeight: "180px" }}
                  >
                    Preencha custo, mensalidade e fidelidade
                    <br />
                    para calcular o payback.
                  </div>
                ) : (
                  <>
                    <div
                      className="inline-flex self-start items-center gap-2 rounded-full px-3 py-1 mb-6"
                      style={{
                        background: result.aprovado ? "rgba(76,215,135,0.15)" : "rgba(255,90,90,0.15)",
                        border: `1px solid ${result.aprovado ? "#4CD787" : "#FF5A5A"}`,
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "999px",
                          background: result.aprovado ? "#4CD787" : "#FF5A5A",
                          display: "inline-block",
                        }}
                      />
                      <span
                        className="text-xs tracking-widest uppercase"
                        style={{
                          color: result.aprovado ? "#4CD787" : "#FF5A5A",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {result.aprovado ? "Aprovado" : "Reprovado"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <span
                          className="block text-[10px] uppercase tracking-widest mb-1"
                          style={{ color: "#5E7C93" }}
                        >
                          Payback real
                        </span>
                        <span
                          className="text-2xl"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: result.aprovado ? "#4CD787" : "#FF5A5A",
                            fontWeight: 700,
                          }}
                        >
                          {formatMeses(result.payback)}
                        </span>
                      </div>
                      <div>
                        <span
                          className="block text-[10px] uppercase tracking-widest mb-1"
                          style={{ color: "#5E7C93" }}
                        >
                          Limite (40%)
                        </span>
                        <span
                          className="text-2xl"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#EAF2F8", fontWeight: 700 }}
                        >
                          {formatMeses(result.limite)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs mb-6" style={{ color: "#8FA9BE" }}>
                      {result.aprovado
                        ? `Margem de folga: ${formatMeses(Math.abs(result.margemMeses))} (${result.margemPct.toFixed(1)}% do prazo).`
                        : `Excede o limite em ${formatMeses(Math.abs(result.margemMeses))} (${Math.abs(result.margemPct).toFixed(1)}% do prazo).`}
                    </p>

                    <Ruler
                      fidelidade={result.f}
                      limite={result.limite}
                      payback={result.payback}
                      aprovado={result.aprovado}
                    />

                    {!result.aprovado && (
                      <div
                        className="mt-6 rounded-md p-4"
                        style={{ background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.35)" }}
                      >
                        <span
                          className="block text-[10px] uppercase tracking-widest mb-1"
                          style={{ color: "#FF8F66" }}
                        >
                          Mensalidade mínima para aprovar
                        </span>
                        <span
                          className="text-xl"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FF8F66", fontWeight: 700 }}
                        >
                          {formatBRL(result.mensalidadeMinima)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* reference table */}
            <div className="border-t px-6 sm:px-8 py-5" style={{ borderColor: "#2A4A63" }}>
              <span
                className="block text-[10px] uppercase tracking-widest mb-3"
                style={{ color: "#5E7C93", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em" }}
              >
                Referência de mercado — parâmetro 40%
              </span>
              <div className="grid grid-cols-3 gap-3">
                {TIERS.map((t) => {
                  const active = fNum === t.meses;
                  return (
                    <div
                      key={t.meses}
                      className="rounded-md px-3 py-2 border text-center"
                      style={{
                        borderColor: active ? "#FF6A3D" : "#22384C",
                        background: active ? "rgba(255,106,61,0.08)" : "transparent",
                      }}
                    >
                      <div
                        className="text-sm"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: active ? "#FF8F66" : "#EAF2F8" }}
                      >
                        {t.meses}m
                      </div>
                      <div
                        className="text-xs"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#5E7C93" }}
                      >
                        ≤ {t.limite}m (40%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "#3B5C77" }}>
            Ferramenta interna de pré-análise. Dados não são salvos By Christyan Almeida 2026
            
          </p>
        </div>
      </div>
    </div>
  );
}
