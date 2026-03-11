/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Star, BarChart3, Smartphone, TrendingUp, Terminal, BookOpen } from 'lucide-react';

// Lazy load heavy components to minimize main-thread work during initial load
const InfiniteMovingCards = lazy(() => import('./components/InfiniteMovingCards').then(module => ({ default: module.InfiniteMovingCards })));
const Calculator = lazy(() => import('./components/Calculator').then(module => ({ default: module.Calculator })));

/**
 * Utilitário para mesclar classes Tailwind
 */
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Componente para o card interativo da planilha
 * Refatorado para evitar erro de hidratação do useScroll quando não renderizado
 */
const PlanilhaHeroCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotateAmplitude = 12;
    setRotateX((offsetY / (rect.height / 2)) * -rotateAmplitude);
    setRotateY((offsetX / (rect.width / 2)) * rotateAmplitude);
    setScale(1.05);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const scrollScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  const springScale = useSpring(scrollScale, { stiffness: 100, damping: 30 });
  const springRotateX = useSpring(scrollRotateX, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="relative w-full max-w-[850px] [perspective:1000px] flex flex-col items-center justify-center mx-auto mb-6 md:mb-10"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        scale: springScale,
        rotateX: springRotateX,
        opacity: scrollOpacity
      }}
    >
      <div
        className="relative w-full transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="bg-[#1e110a] rounded-[20px] border border-dourado/30 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="bg-gradient-to-r from-marrom-base to-marrom-suave p-4 flex items-center border-b border-dourado/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
          </div>
          
          <div className="flex bg-black/20 px-2.5">
            <div className="px-5 py-3 text-[11px] text-dourado border-b-2 border-dourado bg-dourado/5 font-semibold cursor-pointer">Calculadora de Preço</div>
            <div className="px-5 py-3 text-[11px] text-white/60 border-b-2 border-transparent font-semibold cursor-pointer">Gestão de Insumos</div>
            <div className="px-5 py-3 text-[11px] text-white/60 border-b-2 border-transparent font-semibold cursor-pointer">Relatório Final</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr>
                  <th className="bg-dourado text-marrom-profundo p-2 md:p-3.5 font-bold uppercase">Insumo</th>
                  <th className="bg-dourado text-marrom-profundo p-2 md:p-3.5 font-bold uppercase">Qtd/Ovo</th>
                  <th className="bg-dourado text-marrom-profundo p-2 md:p-3.5 font-bold uppercase">Custo (R$)</th>
                  <th className="bg-dourado text-marrom-profundo p-2 md:p-3.5 font-bold uppercase">Preço Venda</th>
                  <th className="bg-dourado text-marrom-profundo p-2 md:p-3.5 font-bold uppercase">Lucro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 text-white/80">
                  <td className="p-2 md:p-3.5">Chocolate Belga</td>
                  <td className="p-2 md:p-3.5">350g</td>
                  <td className="p-2 md:p-3.5">R$ 12,40</td>
                  <td className="p-2 md:p-3.5">—</td>
                  <td className="p-2 md:p-3.5">—</td>
                </tr>
                <tr className="border-b border-white/5 text-white/80">
                  <td className="p-2 md:p-3.5">Embalagem Luxury</td>
                  <td className="p-2 md:p-3.5">1 un</td>
                  <td className="p-2 md:p-3.5">R$ 4,50</td>
                  <td className="p-2 md:p-3.5">—</td>
                  <td className="p-2 md:p-3.5">—</td>
                </tr>
                <tr className="bg-dourado/10 font-bold text-white/80">
                  <td className="p-2 md:p-3.5">TOTAL POR OVO</td>
                  <td className="p-2 md:p-3.5">—</td>
                  <td className="p-2 md:p-3.5 text-sucesso">R$ 16,90</td>
                  <td className="p-2 md:p-3.5 text-dourado">R$ 55,00</td>
                  <td className="p-2 md:p-3.5 text-sucesso">R$ 38,10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("RECEITA");
  const [custo, setCusto] = useState(18);
  const [venda, setVenda] = useState(55);
  const [qtd, setQtd] = useState(50);
  const [taxa, setTaxa] = useState(10);

  const checkoutUrl = activeTab === "PLANILHA" ? "/api/checkout-planilha" : "/api/checkout-receita";

  // Memoize particles to avoid re-calculation on every render
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 40 + 10,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-marrom-profundo">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-marrom-profundo/40 border-b border-white/10 shadow-2xl">
        <div className="font-serif text-lg tracking-[4px] text-dourado uppercase">VELOURA</div>
        <nav className="flex items-center gap-1 border border-white/[0.08] backdrop-blur-xl py-1 px-1 rounded-full bg-marrom-profundo/40">
          {[
            { name: "RECEITA", icon: BookOpen },
            { name: "PLANILHA", icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  "relative cursor-pointer text-[11px] font-bold uppercase px-6 py-2 rounded-full transition-all duration-300",
                  "outline-none focus:outline-none flex items-center justify-center tracking-[2px]",
                  isActive 
                    ? "text-white" 
                    : "text-white/60 hover:text-white/80"
                )}
              >
                <span className="relative z-10 hidden md:inline">{item.name}</span>
                <span className="relative z-10 md:hidden flex items-center justify-center">
                  <Icon size={16} strokeWidth={2.5} />
                </span>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-white/[0.05] rounded-full -z-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-t-full bg-dourado shadow-[0_0_12px_1px_#C9A84C]">
                        <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2 opacity-30 bg-dourado" />
                        <div className="absolute w-8 h-6 rounded-full blur-md -top-1 opacity-20 bg-dourado" />
                        <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2 opacity-40 bg-dourado" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <a 
            href={checkoutUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-[1px] px-5 py-2 border border-dourado/30 rounded-full text-dourado hover:bg-dourado/10 transition-all"
          >
            COMEÇAR
          </a>
        </div>
      </header>

      {/* Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,var(--marrom-base)_0%,var(--marrom-profundo)_100%)]">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_256_256%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noise%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"></div>
      </div>

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-start px-5 pt-24 md:pt-32 pb-0 md:pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-dourado/10 border border-dourado/30 rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-[8px] md:text-[10px] font-bold tracking-[1.5px] md:tracking-[3px] uppercase text-dourado-brilho mb-4 md:mb-8 backdrop-blur-sm"
        >
          ✦ Edição Limitada Páscoa 2026 ✦
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-sm md:text-lg tracking-[4px] md:tracking-[8px] uppercase text-dourado mb-2 md:mb-4"
        >
          Veloura Cacau
        </motion.div>

        {activeTab === "PLANILHA" ? (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-serif text-2xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3 md:mb-5"
            >
              Domine seus <span className="text-dourado">Custos e Lucros</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-serif text-base md:text-2xl font-light text-white/70 mb-6 md:mb-10 max-w-3xl"
            >
              A ferramenta definitiva para confeiteiras que buscam profissionalismo e lucro real em cada ovo.
            </motion.p>

            {/* Tilted Card */}
            <PlanilhaHeroCard />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative w-full max-w-[850px] mx-auto mb-10 overflow-hidden rounded-[20px] border border-dourado/30 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          >
            <img 
              src="https://i.imgur.com/hyJpAUQ.jpeg" 
              alt="Receita Preview" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
              width={850}
              height={478}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col items-center gap-7 mt-6 md:mt-10"
        >
          <div className="reflection-wrapper">
            <button 
              onClick={() => {
                window.open(checkoutUrl, "_blank");
              }}
              className="botao-mvm"
            >
              {activeTab === "PLANILHA" ? "Quero a Planilha Agora" : "Ver Receita Completa"}
            </button>
          </div>

          {/* Vertical Neon Line for Mobile - Extended to reach next section */}
          <div className="md:hidden w-[1.5px] h-32 bg-gradient-to-b from-transparent via-dourado to-transparent shadow-[0_0_20px_#C9A84C] opacity-80 mt-2" />
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "PLANILHA" ? (
          <motion.div
            key="planilha-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Features Section */}
            <section id="features" className="relative py-6 md:py-20 px-5">
              <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
                <span className="text-xs font-extrabold tracking-[4px] text-dourado-brilho uppercase mb-3 block">Funcionalidades</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-white">Tudo sob seu controle</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                {[
                  {
                    icon: <BarChart3 className="w-6 h-6" />,
                    title: "Cálculo Automático",
                    text: "Preencha apenas os valores de compra e a planilha calcula instantaneamente o custo por grama, por ovo e por lote."
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    title: "Preço Sugerido",
                    text: "Descubra o preço ideal de venda baseado na margem de lucro que você deseja alcançar, sem achismos."
                  },
                  {
                    icon: <Smartphone className="w-6 h-6" />,
                    title: "Multidispositivo",
                    text: "Acesse do computador, tablet ou celular. Organize sua produção de onde estiver, inclusive dentro da cozinha."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="card-animated-wrapper">
                    <div className="h-full bg-marrom-profundo/90 p-8 md:p-10 rounded-[24px] md:rounded-[28px] flex flex-col backdrop-blur-xl">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-marrom-base border border-dourado/20 rounded-xl flex items-center justify-center text-dourado shadow-lg mb-5 md:mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{feature.title}</h3>
                      <p className="text-xs md:text-sm text-white/60 leading-relaxed">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="relative py-6 md:py-20 overflow-hidden">
              <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12 px-5">
                <span className="text-xs font-extrabold tracking-[4px] text-dourado-brilho uppercase mb-3 block">Resultados Reais</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-white">Histórias de <em className="italic not-italic">Sucesso</em></h2>
              </div>

              <Suspense fallback={<div className="h-40 flex items-center justify-center text-dourado/80">Carregando depoimentos...</div>}>
                <InfiniteMovingCards
                  items={[
                    {
                      name: "Mariana Silva",
                      title: "Confeiteira Artesanal",
                      quote: "Eu vendia muito mas não via a cor do dinheiro. Com a planilha descobri que estava a cobrar errado nos ovos recheados. Na primeira semana já ajustei tudo e o meu lucro dobrou.",
                      initial: "M",
                      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=150&h=150"
                    },
                    {
                      name: "Ana Paula",
                      title: "Empreendedora",
                      quote: "O que mais gostei foi a simplicidade. Não percebo nada de Excel, mas é só preencher os campos a azul e o cálculo aparece logo. Ganhei horas de descanso nesta Páscoa.",
                      initial: "A",
                      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=150&h=150"
                    },
                    {
                      name: "Carla Mendes",
                      title: "Doces de Elite",
                      quote: "Fiz a simulação e bati a minha meta de 80 ovos com 45% de margem real. Pela primeira vez tenho a certeza de que o meu negócio é lucrativo.",
                      initial: "C",
                      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150&h=150"
                    },
                    {
                      name: "Fernanda Oliveira",
                      title: "Cake Designer",
                      quote: "A planilha é intuitiva e me deu a segurança que eu precisava para investir em insumos melhores sem medo de perder margem.",
                      initial: "F",
                      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=150&h=150"
                    }
                  ]}
                  direction="left"
                  speed="slow"
                />
              </Suspense>
            </section>

            {/* Calculator Section */}
            <Suspense fallback={<div className="h-40 flex items-center justify-center text-dourado/80">Carregando simulador...</div>}>
              <Calculator
                custo={custo}
                setCusto={setCusto}
                venda={venda}
                setVenda={setVenda}
                qtd={qtd}
                setQtd={setQtd}
                taxa={taxa}
                setTaxa={setTaxa}
              />
            </Suspense>

              <div className="flex flex-col items-center gap-7 mt-14">
                <div className="reflection-wrapper">
                  <a 
                    href={checkoutUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="botao-mvm"
                  >
                    Garantir Acesso Imediato
                  </a>
                </div>
              </div>
          </motion.div>
        ) : (
          <motion.div
            key="receita-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Features Section (Cloned Structure) */}
            <section id="recipe-features" className="relative py-4 md:py-20 px-5">
              <div className="text-center max-w-2xl mx-auto mb-6 md:mb-16">
                <span className="text-xs font-extrabold tracking-[4px] text-dourado-brilho uppercase mb-3 block">Excelência</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-white">Por que seguir a <em className="italic not-italic">Veloura</em>?</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                {[
                  {
                    icon: <BookOpen className="w-6 h-6" />,
                    title: "Ficha Técnica",
                    text: "Tenha em mãos todos os detalhes técnicos, rendimento e tempo de preparo para uma produção impecável."
                  },
                  {
                    icon: <Terminal className="w-6 h-6" />,
                    title: "Passo a Passo",
                    text: "Instruções claras e detalhadas, desde a temperagem do chocolate até a finalização de luxo."
                  },
                  {
                    icon: <Star className="w-6 h-6" />,
                    title: "Ingredientes",
                    text: "A lista completa de insumos premium necessários para garantir o sabor e a textura da elite."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="card-animated-wrapper">
                    <div className="h-full bg-marrom-profundo/90 p-8 md:p-10 rounded-[24px] md:rounded-[28px] flex flex-col backdrop-blur-xl">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-marrom-base border border-dourado/20 rounded-xl flex items-center justify-center text-dourado shadow-lg mb-5 md:mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{feature.title}</h3>
                      <p className="text-xs md:text-sm text-white/60 leading-relaxed">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="recipe-testimonials" className="relative py-4 md:py-20 overflow-hidden">
              <div className="text-center max-w-2xl mx-auto mb-6 md:mb-12 px-5">
                <span className="text-xs font-extrabold tracking-[4px] text-dourado-brilho uppercase mb-3 block">Experiências Reais</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-white">O que dizem as <em className="italic not-italic">Confeiteiras</em></h2>
              </div>

              <Suspense fallback={<div className="h-40 flex items-center justify-center text-dourado/80">Carregando depoimentos...</div>}>
                <InfiniteMovingCards
                  items={[
                    {
                      name: "Juliana Costa",
                      title: "Confeiteira Gourmet",
                      quote: "As receitas da Veloura são de outro nível. O sabor e a textura do chocolate são perfeitos. Meus clientes ficaram encantados com o toque único dos ovos deste ano.",
                      initial: "J",
                      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
                    },
                    {
                      name: "Renata Lima",
                      title: "Chef de Doces",
                      quote: "O passo a passo é tão detalhado que até quem está começando consegue fazer. A técnica de temperagem explicada salvou minha produção. Zero desperdício e muito brilho!",
                      initial: "R",
                      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
                    },
                    {
                      name: "Beatriz Soares",
                      title: "Ateliê de Chocolate",
                      quote: "Nunca tinha conseguido um acabamento tão profissional. As dicas de finalização de luxo transformaram meus ovos em verdadeiras joias. Vendi toda a minha agenda!",
                      initial: "B",
                      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150"
                    },
                    {
                      name: "Camila Rocha",
                      title: "Especialista em Ganache",
                      quote: "A combinação de sabores sugerida é simplesmente divina. O equilíbrio entre o doce e o amargo é o que diferencia a Veloura de tudo que já vi.",
                      initial: "C",
                      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150"
                    }
                  ]}
                  direction="right"
                  speed="slow"
                />
              </Suspense>
            </section>

            {/* Recipe Section (Visual Structure Cloned from Spreadsheet) */}
            <section id="recipe" className="relative py-4 md:py-20 px-5">
              <div className="text-center max-w-2xl mx-auto mb-6 md:mb-12">
                <span className="text-xs font-extrabold tracking-[4px] text-dourado-brilho uppercase mb-3 block">Ficha Técnica</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-white">Receita de <em className="italic not-italic">Elite</em></h2>
              </div>

              {/* Banner Image requested by user */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto mb-16 rounded-[20px] overflow-hidden border border-dourado/20 shadow-2xl"
              >
                <img 
                  src="https://i.imgur.com/hXoKe8O.jpeg" 
                  alt="Receita de Elite Banner" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  width={1024}
                  height={576}
                />
              </motion.div>

              <div className="flex flex-col items-center gap-7 mt-8 md:mt-14">
                <div className="reflection-wrapper">
                  <a 
                    href={checkoutUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="botao-mvm"
                  >
                    VER RECEITA COMPLETA
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-14 px-5 text-center bg-[#0D0502] border-t border-dourado/10">
        <div className="font-serif text-2xl tracking-[5px] text-dourado mb-4 uppercase">VELOURA CACAU</div>
        <p className="text-xs text-white/60">© 2026 Veloura Cacau • Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
