import React, { useMemo } from 'react';

interface CalculatorProps {
  custo: number;
  setCusto: (val: number) => void;
  venda: number;
  setVenda: (val: number) => void;
  qtd: number;
  setQtd: (val: number) => void;
  taxa: number;
  setTaxa: (val: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  custo, setCusto, venda, setVenda, qtd, setQtd, taxa, setTaxa
}) => {
  const { lucroUni, lucroTotal, margem } = useMemo(() => {
    const valorTaxa = venda * (taxa / 100);
    const lUni = venda - custo - valorTaxa;
    const lTotal = lUni * qtd;
    const m = venda > 0 ? (lUni / venda) * 100 : 0;
    return { lucroUni: lUni, lucroTotal: lTotal, margem: m };
  }, [custo, venda, qtd, taxa]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <section id="calculator" className="relative py-6 md:py-20 px-5">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
        <span className="text-xs md:text-sm font-bold tracking-[1px] text-dourado uppercase mb-3 block">Simulador</span>
        <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white mb-4">Veja seu <em className="text-dourado italic not-italic">Potencial</em></h2>
      </div>

      <div className="card-animated-wrapper max-w-3xl mx-auto">
        <div className="bg-marrom-profundo/95 p-4 md:p-12 rounded-[20px] md:rounded-[28px] backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-dourado">Custo / Un (R$)</label>
              <input
                type="number"
                value={custo}
                onChange={(e) => setCusto(Number(e.target.value))}
                className="bg-white/5 border border-white/10 p-2.5 md:p-4 rounded-lg text-white font-sans text-xs md:text-base outline-none focus:border-dourado focus:bg-dourado/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-dourado">Venda / Un (R$)</label>
              <input
                type="number"
                value={venda}
                onChange={(e) => setVenda(Number(e.target.value))}
                className="bg-white/5 border border-white/10 p-2.5 md:p-4 rounded-lg text-white font-sans text-xs md:text-base outline-none focus:border-dourado focus:bg-dourado/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-dourado">Meta (un)</label>
              <input
                type="number"
                value={qtd}
                onChange={(e) => setQtd(Number(e.target.value))}
                className="bg-white/5 border border-white/10 p-2.5 md:p-4 rounded-lg text-white font-sans text-xs md:text-base outline-none focus:border-dourado focus:bg-dourado/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-dourado">Taxas (%)</label>
              <input
                type="number"
                value={taxa}
                onChange={(e) => setTaxa(Number(e.target.value))}
                className="bg-white/5 border border-white/10 p-2.5 md:p-4 rounded-lg text-white font-sans text-xs md:text-base outline-none focus:border-dourado focus:bg-dourado/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-5 pt-6 md:pt-10 border-t border-white/10">
            <div className="text-center">
              <div className="text-[8px] md:text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 md:mb-2">Lucro / Un</div>
              <div className="font-serif text-sm md:text-3xl font-bold text-dourado">{formatCurrency(lucroUni)}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] md:text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 md:mb-2">Lucro Total</div>
              <div className="font-serif text-sm md:text-3xl font-bold text-sucesso">{formatCurrency(lucroTotal)}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] md:text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 md:mb-2">Margem</div>
              <div className="font-serif text-sm md:text-3xl font-bold text-dourado">{margem.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
