'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronRight, Sparkles, Zap, Loader2, Instagram, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Chatbot from '@/components/Chatbot';

// Mock data en caso de que falle la búsqueda
const fallbackNews = [
  {
    id: 1,
    title: 'OpenAI anuncia nuevos modelos de razonamiento',
    excerpt: 'Los nuevos modelos o1 están diseñados para pasar más tiempo pensando antes de responder, estableciendo un nuevo estándar para la resolución de problemas complejos.',
    content: 'OpenAI ha revelado su nueva serie de modelos de IA, denominados "o1", que introducen un paradigma de razonamiento avanzado. A diferencia de los modelos anteriores que generan respuestas de forma casi instantánea, los modelos o1 están entrenados para "pensar" antes de hablar, simulando un proceso de cadena de pensamiento.\n\nEste enfoque permite a la IA resolver problemas matemáticos complejos, escribir código más robusto y abordar tareas científicas con una precisión sin precedentes. Según los investigadores, el modelo o1-preview ha superado significativamente a GPT-4o en pruebas estandarizadas de física, química y biología.\n\nLa compañía planea integrar estas capacidades de razonamiento en futuros productos, marcando un paso crucial hacia la inteligencia artificial general (AGI).',
    category: 'Modelos',
    date: 'Oct 24, 2026',
    source: 'TechCrunch',
    image: 'https://loremflickr.com/800/600/robot,ai?lock=1',
  },
  {
    id: 2,
    title: 'Google DeepMind logra un avance en el plegamiento de proteínas',
    excerpt: 'AlphaFold 3 predice la estructura y las interacciones de todas las moléculas de la vida con una precisión sin precedentes.',
    content: 'Google DeepMind y la compañía Isomorphic Labs han presentado AlphaFold 3, un modelo de inteligencia artificial revolucionario capaz de predecir con una precisión sin precedentes la estructura y las interacciones de todas las moléculas de la vida.\n\nEste avance va más allá de las proteínas, abarcando ADN, ARN, ligandos y otras moléculas cruciales para el desarrollo de fármacos. La capacidad de modelar cómo interactúan estas estructuras acelerará drásticamente la investigación biomédica y el descubrimiento de nuevos tratamientos para enfermedades complejas.\n\nEl modelo ya está siendo utilizado por investigadores de todo el mundo, marcando un hito en la biología computacional.',
    category: 'Investigación',
    date: 'Oct 22, 2026',
    source: 'Wired',
    image: 'https://loremflickr.com/800/600/dna,science?lock=2',
  },
  {
    id: 3,
    title: 'El auge de la IA Agéntica en las empresas',
    excerpt: 'Cómo los agentes autónomos están transformando los flujos de trabajo y la toma de decisiones en las principales empresas.',
    content: 'La "IA Agéntica" está emergiendo como la próxima gran tendencia en el mundo empresarial. A diferencia de los chatbots tradicionales que requieren instrucciones paso a paso, los agentes autónomos pueden recibir un objetivo general, planificar los pasos necesarios y ejecutar acciones en múltiples sistemas de software.\n\nEmpresas del Fortune 500 están implementando estos agentes para automatizar tareas complejas como la investigación de mercado, la gestión de la cadena de suministro y la atención al cliente proactiva. Estos sistemas no solo ahorran tiempo, sino que también optimizan procesos que antes requerían intervención humana constante.\n\nSin embargo, la adopción de la IA agéntica también plantea nuevos desafíos en términos de seguridad, auditoría y control de calidad, obligando a las organizaciones a redefinir sus marcos de gobernanza tecnológica.',
    category: 'Empresas',
    date: 'Oct 20, 2026',
    source: 'Forbes',
    image: 'https://loremflickr.com/800/600/business,technology?lock=3',
  },
  {
    id: 4,
    title: 'Anthropic lanza Claude 3.5 Sonnet',
    excerpt: 'El nuevo modelo establece un punto de referencia en la industria por su inteligencia y velocidad.',
    content: 'Anthropic ha anunciado el lanzamiento de Claude 3.5 Sonnet, su modelo de lenguaje más avanzado hasta la fecha. Este nuevo sistema supera a sus predecesores y a muchos competidores en una amplia gama de evaluaciones de inteligencia, incluyendo razonamiento lógico, codificación y análisis de datos.\n\nUna de las características más destacadas de Claude 3.5 Sonnet es su velocidad de procesamiento, que permite interacciones en tiempo real más fluidas y eficientes. Además, el modelo introduce nuevas capacidades de "Artifacts", permitiendo a los usuarios generar y editar código, documentos y gráficos directamente en la interfaz de chat.\n\nEl lanzamiento refuerza la posición de Anthropic como uno de los líderes en el desarrollo de IA segura y altamente capaz.',
    category: 'Modelos',
    date: 'Oct 18, 2026',
    source: 'The Verge',
    image: 'https://loremflickr.com/800/600/computer,code?lock=4',
  },
  {
    id: 5,
    title: 'La Ley de IA de la UE entra en pleno vigor',
    excerpt: 'Lo que las empresas necesitan saber para cumplir con las nuevas regulaciones y cómo afectará al desarrollo de código abierto.',
    content: 'La histórica Ley de Inteligencia Artificial de la Unión Europea ha entrado en pleno vigor, estableciendo el primer marco regulatorio integral del mundo para esta tecnología. La ley clasifica los sistemas de IA según su nivel de riesgo, imponiendo requisitos estrictos a las aplicaciones de "alto riesgo" y prohibiendo prácticas consideradas inaceptables, como la puntuación social.\n\nLas empresas que operan en la UE ahora deben cumplir con rigurosas normas de transparencia, gestión de riesgos y supervisión humana. El incumplimiento puede resultar en multas de hasta el 7% de los ingresos globales anuales de una empresa.\n\nLa regulación también ha generado un intenso debate sobre su impacto en la innovación y el desarrollo de modelos de código abierto, con algunos expertos advirtiendo que podría frenar la competitividad tecnológica de Europa.',
    category: 'Política',
    date: 'Oct 15, 2026',
    source: 'Reuters',
    image: 'https://loremflickr.com/800/600/law,europe?lock=5',
  },
  {
    id: 6,
    title: 'Nvidia presenta las GPUs Blackwell de próxima generación',
    excerpt: 'La nueva arquitectura promete aumentos masivos de rendimiento para el entrenamiento e inferencia de IA.',
    content: 'Nvidia ha revelado su esperada arquitectura de GPU "Blackwell", diseñada específicamente para impulsar la próxima generación de modelos de inteligencia artificial a gran escala. Estos nuevos chips prometen un rendimiento hasta 30 veces superior en inferencia de grandes modelos de lenguaje (LLMs) en comparación con la generación anterior (Hopper).\n\nLa arquitectura Blackwell introduce innovaciones clave, como un motor de transformación de segunda generación y capacidades de interconexión NVLink mejoradas, lo que permite a los centros de datos escalar sus operaciones de IA de manera más eficiente y con un menor consumo energético.\n\nCon este lanzamiento, Nvidia consolida su dominio casi absoluto en el mercado de hardware para IA, mientras empresas tecnológicas de todo el mundo se apresuran a asegurar su suministro de estos codiciados chips.',
    category: 'Hardware',
    date: 'Oct 12, 2026',
    source: 'Bloomberg',
    image: 'https://loremflickr.com/800/600/chip,processor?lock=6',
  }
];

const categories = ["Todas", "Modelos", "Investigación", "Empresas", "Política", "Hardware", "Cultura"];

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effects for background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const [news, setNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedNews, setSelectedNews] = useState<any>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) throw new Error("No API key");
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Busca las 8 noticias más recientes e importantes sobre Inteligencia Artificial de HOY (25 de Febrero de 2026) y esta semana. Devuelve un arreglo JSON con objetos que tengan: id (número), title (string), excerpt (string, máximo 2 oraciones), content (string, la noticia completa en 3 o 4 párrafos detallados), category (string, usa estrictamente una de estas: Modelos, Investigación, Empresas, Política, Hardware, Cultura), date (string), source (string, el nombre del medio o fuente original), imageKeyword (string, una sola palabra en inglés que describa el tema visualmente, ej: "robot", "chip", "code", "data"). Devuelve SOLO el JSON dentro de un bloque ```json ... ```.',
          config: {
            tools: [{ googleSearch: {} }]
          }
        });

        const text = response.text || '';
        let jsonStr = text;
        const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
        
        const parsedNews = JSON.parse(jsonStr);
        // Usamos loremflickr para obtener imágenes de internet de alta calidad basadas en la palabra clave
        const newsWithImages = parsedNews.map((n: any, i: number) => ({
          ...n,
          image: `https://loremflickr.com/800/600/${n.imageKeyword || 'technology'},ai?lock=${n.id || i}`
        }));
        setNews(newsWithImages);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews(fallbackNews);
      } finally {
        setIsLoadingNews(false);
      }
    }
    fetchNews();
  }, []);

  const displayNews = news.length > 0 ? news : fallbackNews;
  const filteredNews = selectedCategory === "Todas" 
    ? displayNews 
    : displayNews.filter(n => n.category === selectedCategory);

  const featuredNews = filteredNews[0];
  const secondaryNews = filteredNews.slice(1, 4);
  const feedNews = filteredNews.slice(4);

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] overflow-hidden relative">
      {/* Modal de Noticia Completa */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="relative h-64 md:h-80 w-full flex-shrink-0">
                <Image 
                  src={selectedNews.image} 
                  alt={selectedNews.title} 
                  fill 
                  className="object-cover" 
                  unoptimized // Pollinations images change, better unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                <button 
                  onClick={() => setSelectedNews(null)} 
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors border border-white/10 z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wider border border-red-500/20">
                    {selectedNews.category}
                  </span>
                  <span className="text-neutral-500 text-sm">{selectedNews.date}</span>
                  {selectedNews.source && (
                    <span className="text-neutral-400 text-sm font-medium flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neutral-500" />
                      Fuente: <span className="text-white">{selectedNews.source}</span>
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-bold mb-6 text-white leading-tight">
                  {selectedNews.title}
                </h2>
                <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed">
                  {selectedNews.content?.split('\n').map((paragraph: string, i: number) => (
                    paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient glows with continuous movement */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-900/20 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-800/40 blur-[120px] pointer-events-none" 
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_4_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Obsidian<span className="text-red-500">.AI</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
              <a href="#" className="text-white hover:text-red-400 transition-colors">Lo Último</a>
              <a href="#" className="hover:text-white transition-colors">Investigación</a>
              <a href="#" className="hover:text-white transition-colors">Modelos</a>
              <a href="https://www.instagram.com/simon_444_tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Última hora: La nueva generación de inteligencia</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              La frontera de las <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">mentes artificiales.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl font-light leading-relaxed">
              Crónicas desde el límite de la computación. Te traemos los últimos avances, investigaciones y cambios culturales en IA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-4">
              Inteligencia Reciente
              {isLoadingNews && <Loader2 className="w-6 h-6 animate-spin text-red-500" />}
            </h2>
            <a href="#" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-medium">
              Ver todo <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Carrusel de Categorías */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex overflow-x-auto gap-3 pb-4 mb-8 hide-scrollbar"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap border transition-colors text-sm font-medium ${
                  selectedCategory === cat
                    ? 'bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {filteredNews.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              No hay noticias recientes en la categoría &quot;{selectedCategory}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Featured Article */}
              {featuredNews && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="md:col-span-8 group cursor-pointer"
                  onClick={() => setSelectedNews(featuredNews)}
                >
                  <div className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-6 border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <Image 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium uppercase tracking-wider text-white">
                        {featuredNews.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                    <span>{featuredNews.date}</span>
                    <span className="w-1 h-1 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span>5 min de lectura</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 group-hover:text-red-400 transition-colors">
                    {featuredNews.title}
                  </h3>
                  <p className="text-neutral-400 text-lg leading-relaxed max-w-3xl">
                    {featuredNews.excerpt}
                  </p>
                </motion.div>
              )}

              {/* Secondary Articles */}
              <div className="md:col-span-4 flex flex-col gap-6">
                {secondaryNews.map((news, idx) => (
                  <motion.div 
                    key={news.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                    className="group cursor-pointer flex flex-col h-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-[2rem] p-4 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                    onClick={() => setSelectedNews(news)}
                  >
                    <div className="relative h-[200px] rounded-2xl overflow-hidden mb-5">
                      <Image 
                        src={news.image} 
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium uppercase tracking-wider text-white">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow px-2 pb-2">
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                        <span>{news.date}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-3 group-hover:text-red-400 transition-colors leading-tight">
                        {news.title}
                      </h3>
                      <p className="text-neutral-400 text-sm line-clamp-2 mt-auto">
                        {news.excerpt}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* The Feed / All News */}
      {feedNews.length > 0 && (
        <section className="px-6 py-24 border-t border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-2 h-8 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              <h2 className="font-display text-3xl font-bold">El Feed</h2>
            </motion.div>

            <div className="flex flex-col gap-6">
              {feedNews.map((news, idx) => (
                <motion.div 
                  key={news.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col md:flex-row gap-6 items-start md:items-center p-6 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="flex-shrink-0 w-full md:w-48 flex flex-row md:flex-col justify-between md:justify-start text-sm text-neutral-500">
                    <span className="font-medium text-neutral-300">{news.date}</span>
                    <span className="text-red-500/80 mt-1">{news.category}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      {news.excerpt}
                    </p>
                  </div>
                  <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-white/5 items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors border border-white/5 group-hover:border-red-500">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/5 relative z-10 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-neutral-400">Obsidian<span className="text-red-500/50">.AI</span></span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-neutral-500">
            <a href="https://www.instagram.com/simon_444_tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              <Instagram className="w-4 h-4" /> @simon_444_tech
            </a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">RSS</a>
          </div>
          <div className="text-sm text-neutral-600">
            © 2026 Obsidian AI. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
