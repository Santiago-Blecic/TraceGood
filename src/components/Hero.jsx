import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Globe } from './icons.jsx'
import './Hero.css'

const stats = [
  { value: '€0.02', label: 'from this bottle' },
  { value: '100%', label: 'funding traceable' },
]

const globePoints = Array.from({ length: 630 }, (_, index) => {
  const angle = index * 2.3999632297
  const radius = Math.sqrt((index + 0.5) / 630)
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const africa = x > -0.12 && x < 0.34 && y > -0.35 && y < 0.46 && y > -1.2 * x - 0.26 && y < 1.65 * x + 0.36
  return { left: `${50 + x * 47}%`, top: `${50 + y * 47}%`, africa, key: index }
})

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
        <div className="globe__sphere" aria-hidden="true">
          {globePoints.map((point) => <i key={point.key} className={point.africa ? 'is-africa' : ''} style={{ left: point.left, top: point.top }} />)}
          <span className="globe__pin" />
        </div>
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
