"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"

const previewData = {
    ooo: {
        // Business/Office image for ООО
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500&h=300",
        title: "Общество с ограниченной ответственностью (ООО)",
        subtitle: "Участники не отвечают по обязательствам и несут риск убытков в пределах стоимости долей.",
    },
    ip: {
        // Individual working/Laptop image for ИП
        image: "https://images.unsplash.com/photo-1553877607-4041d8c119cd?auto=format&fit=crop&q=80&w=500&h=300",
        title: "Индивидуальный предприниматель (ИП)",
        subtitle: "Физическое лицо, занимающееся предпринимательством без образования юрлица.",
    },
    npd: {
        // Freelancer/Creative image for НПД
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500&h=300",
        title: "Самозанятость (НПД)",
        subtitle: "Специальный налоговый режим для физлиц и ИП без наёмных сотрудников.",
    },
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Syne:wght@400;700;800&display=swap');

  .hover-preview-container {
    /* min-height: 100vh; -- Changed to fit content */
    min-height: 400px;
    background: transparent; /* Changed from #0a0a0a to transparent for integration */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    font-family: 'Space Grotesk', sans-serif;
    /* overflow-x: hidden; -- Removed to prevent clipping if embedded */
    position: relative;
    border-radius: 1rem;
    overflow: hidden; /* Keep overflow hidden for internal effects */
  }

  /*
  .hover-preview-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-image: ... noise ... */
    /* opacity: 0.03; */
    /* pointer-events: none; */
    /* z-index: 0; */
  /* } 
  */

  .ambient-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%); /* Changed color to Indigo/Primaryish */
    pointer-events: none;
    z-index: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
  }

  .content-container {
    max-width: 900px;
    width: 100%;
    z-index: 1;
  }

  .text-block {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    line-height: 1.6;
    color: var(--muted-foreground); /* Use theme color */
    font-weight: 400;
    letter-spacing: -0.02em;
  }

  .text-block p {
    margin-bottom: 1.5em;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
  }

  .text-block p:nth-child(1) { animation-delay: 0.2s; }
  .text-block p:nth-child(2) { animation-delay: 0.4s; }
  .text-block p:nth-child(3) { animation-delay: 0.6s; }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hover-link {
    color: var(--foreground);
    font-weight: 700;
    /* font-family: 'Syne', sans-serif; -- Use inherited font */
    cursor: pointer;
    position: relative;
    display: inline-block;
    transition: color 0.3s ease;
  }

  .hover-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #3b82f6); /* Green to Blue */
    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .hover-link:hover::after {
    width: 100%;
  }

  .preview-card {
    position: fixed;
    pointer-events: none;
    z-index: 1000;
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform, opacity;
  }

  .preview-card.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .preview-card-inner {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 12px;
    padding: 8px;
    box-shadow: 
      0 20px 25px -5px rgb(0 0 0 / 0.1), 
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    overflow: hidden;
    width: 320px;
  }

  .preview-card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    margin-bottom: 12px;
  }

  .preview-card-title {
    padding: 0 8px 4px;
    font-size: 0.95rem;
    color: hsl(var(--card-foreground));
    font-weight: 600;
  }

  .preview-card-subtitle {
    padding: 0 8px 8px;
    font-size: 0.8rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }
`

const HoverLink = ({
    previewKey,
    children,
    onHoverStart,
    onHoverMove,
    onHoverEnd,
}: {
    previewKey: string
    children: React.ReactNode
    onHoverStart: (key: string, e: React.MouseEvent) => void
    onHoverMove: (e: React.MouseEvent) => void
    onHoverEnd: () => void
}) => {
    return (
        <span
            className="hover-link"
            onMouseEnter={(e) => onHoverStart(previewKey, e)}
            onMouseMove={onHoverMove}
            onMouseLeave={onHoverEnd}
        >
            {children}
        </span>
    )
}

const PreviewCard = ({
    data,
    position,
    isVisible,
    cardRef,
}: {
    data: (typeof previewData)[keyof typeof previewData] | null
    position: { x: number; y: number }
    isVisible: boolean
    cardRef: React.RefObject<HTMLDivElement>
}) => {
    if (!data) return null

    return (
        <div
            ref={cardRef}
            className={`preview-card ${isVisible ? "visible" : ""}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div className="preview-card-inner">
                <img
                    src={data.image || "/placeholder.svg"}
                    alt={data.title || ""}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
                <div className="preview-card-title">{data.title}</div>
                <div className="preview-card-subtitle">{data.subtitle}</div>
            </div>
        </div>
    )
}

export function HoverPreview() {
    const [activePreview, setActivePreview] = useState<(typeof previewData)[keyof typeof previewData] | null>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    const updatePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
        const cardWidth = 320
        const cardHeight = 280 // Approximate card height
        const offsetX = 15
        const offsetY = 20

        // Position card
        let x = e.clientX - cardWidth / 2
        let y = e.clientY - cardHeight - offsetY

        // Boundary checks
        if (x + cardWidth > window.innerWidth - 20) {
            x = window.innerWidth - cardWidth - 20
        }
        if (x < 20) {
            x = 20
        }

        // Flip if too close to top
        if (y < 20) {
            y = e.clientY + offsetY
        }

        setPosition({ x, y })
    }, [])

    const handleHoverStart = useCallback(
        (key: string, e: React.MouseEvent) => {
            setActivePreview(previewData[key as keyof typeof previewData])
            setIsVisible(true)
            updatePosition(e)
        },
        [updatePosition],
    )

    const handleHoverMove = useCallback(
        (e: React.MouseEvent) => {
            if (isVisible) {
                updatePosition(e)
            }
        },
        [isVisible, updatePosition],
    )

    const handleHoverEnd = useCallback(() => {
        setIsVisible(false)
    }, [])

    return (
        <>
            <style>{styles}</style>
            <div className="hover-preview-container border rounded-xl bg-card/30">
                <div className="ambient-glow" />

                <div className="content-container">
                    <div className="text-block">
                        <p>
                            Выбор формы бизнеса — ключевой шаг. Рассмотрите{" "}
                            <HoverLink
                                previewKey="ooo"
                                onHoverStart={handleHoverStart}
                                onHoverMove={handleHoverMove}
                                onHoverEnd={handleHoverEnd}
                            >
                                ООО
                            </HoverLink>{" "}
                            для партнёрства и привлечения инвестиций.
                        </p>

                        <p>
                            Если вы планируете нанимать сотрудников и масштабироваться, то{" "}
                            <HoverLink
                                previewKey="ip"
                                onHoverStart={handleHoverStart}
                                onHoverMove={handleHoverMove}
                                onHoverEnd={handleHoverEnd}
                            >
                                ИП (Индивидуальный Предприниматель)
                            </HoverLink>{" "}
                            станет отличным выбором.
                        </p>

                        <p>
                            Для старта с минимальными рисками и без отчётности идеально подходит{" "}
                            <HoverLink
                                previewKey="npd"
                                onHoverStart={handleHoverStart}
                                onHoverMove={handleHoverMove}
                                onHoverEnd={handleHoverEnd}
                            >
                                Самозанятость (НПД)
                            </HoverLink>
                            .
                        </p>
                    </div>
                </div>

                <PreviewCard data={activePreview} position={position} isVisible={isVisible} cardRef={cardRef} />
            </div>
        </>
    )
}
