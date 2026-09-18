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
    video.play().catch(() => {})

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
          loop
          muted
          defaultMuted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen"
          preload="auto"
          aria-hidden="true"
          onLoadedData={(event) => {
            event.currentTarget.muted = true
            event.currentTarget.play().then(() => setReady(true)).catch(() => setReady(true))
          }}
          onPlaying={() => setReady(true)}
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
          <div className="impact-card__amount">
            <span>Your contribution</span><strong>€0.02</strong>
            <small>assigned to clean-water access</small>
          </div>
          <h2>ClearSpring Natural Water</h2>
          <div className="impact-card__meta">
            <span>500 ml bottle</span><span>Batch CS-KE-0426</span>
          </div>
          <div className="impact-card__project">
            <span className="impact-card__pin" aria-hidden="true">⌖</span>
            <div><small>Supporting</small><strong>Water pipeline repair<br />Kisumu County, Kenya</strong></div>
          </div>
          <div className="impact-card__batch" aria-label="Batch verification details">
            <div><span>Batch total</span><strong>10,000 bottles × €0.02</strong></div>
            <div><span>Transferred</span><strong>€200.00</strong></div>
            <code>TX · 7A31F…9B84E · 18 SEP 2026</code>
          </div>
          <a className="impact-card__tx" href="#proof">View XRP Ledger transaction <ArrowRight /></a>
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
      <div className="network-map" role="img" aria-label="Network world map with a location pin in Kisumu County, Kenya">
        <img src="/tracegood-network-map.png" alt="" />
        <span className="network-map__pin" aria-hidden="true" />
        <span className="network-map__label">Kisumu<br />County</span>
      </div>
    </section>

    </>
  )
}
