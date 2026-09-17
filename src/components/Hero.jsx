import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Globe } from './icons.jsx'
import './Hero.css'

const stats = [
  { value: '€0.02', label: 'from this bottle' },
  { value: '100%', label: 'funding traceable' },
]

export default function Hero() {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    const play = video.play()
    if (play?.catch) play.catch(() => {})

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      setReady(true)
    }
  }, [])

  return (
    <>
    <section className="hero">
      <div className="hero__media">
        <video
          ref={videoRef}
          className={`hero__video ${ready ? 'is-ready' : ''}`}
          src="/hero-loop.mp4"
          autoPlay
          muted
          defaultMuted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen"
          preload="auto"
          aria-hidden="true"
          onLoadedData={() => setReady(true)}
        />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__rules" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>

      <div className="hero__inner">
        <div className="hero__lead">
          <p className="hero__note">
            <Globe className="hero__note-icon" />
            <span>TraceGood receipt · verified<br />18 September 2026</span>
          </p>

          <h1 className="hero__title">
            Your money is<br />
            on its way to<br />
            <em>clean water.</em>
          </h1>

          <p className="hero__sub">
            You bought ClearSpring Natural Water. €0.02 from this bottle is
            assigned to a water-pipeline repair in Kisumu County, Kenya.
          </p>

          <div className="hero__cta">
            <a className="btn btn--flame hero__go" href="#project-location">
              Track your money
              <span className="hero__go-dot" aria-hidden="true"><ArrowRight /></span>
            </a>

            <div className="hero__proof" aria-label="Verified on XRP Ledger">
              <span className="hero__check" aria-hidden="true">✓</span>
              <span className="hero__proof-text">
                <strong>Verified on XRPL</strong>
                Public, traceable transfers
              </span>
            </div>
          </div>

          <ul className="hero__stats">
            {stats.map((stat) => (
              <li key={stat.label} className="stat">
                <span className="stat__mark" aria-hidden="true">*</span>
                <span className="stat__value">{stat.value}</span>
                <span className="stat__label">{stat.label}</span>
                <span className="stat__rule" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <aside className="impact-card" id="proof">
          <span className="impact-card__eyebrow">Your scanned product</span>
          <h2>ClearSpring<br />Natural Water</h2>
          <div className="impact-card__meta">
            <span>500 ml bottle</span><span>Batch CS-KE-0426</span>
          </div>
          <div className="impact-card__project">
            <span className="impact-card__pin" aria-hidden="true">⌖</span>
            <div><small>Supporting</small><strong>Water pipeline repair<br />Kisumu County, Kenya</strong></div>
          </div>
          <div className="impact-card__funding">
            <span>Your contribution</span><strong>€0.02</strong>
          </div>
          <a className="impact-card__tx" href="#verification">View XRP Ledger transaction <ArrowRight /></a>
        </aside>
      </div>

    </section>

    <section className="impact-map" id="project-location">
      <div className="impact-map__copy">
        <div className="section-kicker">Your impact destination</div>
        <h2>Your contribution goes <em>here.</em></h2>
        <p>Funds from batch CS-KE-0426 are combined and sent directly to the project partner repairing a local water pipeline in Kisumu County.</p>
        <div className="impact-map__location"><span aria-hidden="true">●</span><div><strong>Kisumu County, Kenya</strong><small>Water pipeline repair project</small></div></div>
      </div>
      <div className="globe" role="img" aria-label="Globe showing a location pin in Kenya, Africa">
        <svg viewBox="0 0 520 520" aria-hidden="true">
          <defs><clipPath id="world"><circle cx="260" cy="260" r="214" /></clipPath></defs>
          <circle className="globe__halo" cx="260" cy="260" r="236" /><circle className="globe__ocean" cx="260" cy="260" r="214" />
          <g className="globe__grid"><ellipse cx="260" cy="260" rx="102" ry="214" /><ellipse cx="260" cy="260" rx="166" ry="214" /><path d="M47 260h426M62 172h396M62 348h396" /></g>
          <g clipPath="url(#world)" className="globe__land"><path d="M200 91c-35 23-56 51-52 85l-42 25 10 35 43 5 22 39 42-6 16-49-18-32 19-44-20-28Z" /><path d="M285 117c50-16 107 11 121 48l-24 20 1 40-36 13-19 53-38-7-18-47 18-35-5-35Z" /><path d="M251 195c35 1 72 32 66 71l-25 18-5 55-30 61-27-38 9-52-25-37 15-45Z" /><path d="M132 331l56 4 24 34-22 50-42-22-31-37 15-29Z" /></g>
          <g className="globe__pin"><circle cx="287" cy="282" r="31" /><path d="M287 250c-17 0-29 13-29 30 0 22 29 52 29 52s29-30 29-52c0-17-12-30-29-30Z" /><circle cx="287" cy="280" r="8" /></g>
        </svg>
        <span className="globe__label">Kisumu<br />County</span>
      </div>
    </section>

    <section className="verification" id="verification">
      <div>
        <div className="section-kicker">Traceable by design</div>
        <h2>Every batch has a story you can check.</h2>
        <p>Contributions are aggregated by product batch and transferred to the project’s wallet. The XRP Ledger provides a public record of the amount, time and destination.</p>
      </div>
      <div className="verification__record">
        <div><span>Batch contribution</span><strong>10,000 bottles × €0.02</strong></div>
        <div><span>Transferred to project</span><strong>€200.00</strong></div>
        <div><span>Transaction status</span><strong className="verified">✓ Funding verified on XRPL</strong></div>
        <code>TX · 7A31F…9B84E · 18 SEP 2026</code>
      </div>
    </section>

    </>
  )
}
