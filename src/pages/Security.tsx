import { Link } from 'react-router-dom';

export default function Security() {
  return (
    <div className="homepage bg-dark text-white">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg container-fluid p-4">
        <div className="container-fluid">
          <div className="main-logo">
            <Link to="/" className="d-block">
              <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body justify-content-lg-between">
              <div className="main-menu text-center d-lg-flex align-items-center">
                <ul className="menu-list list-unstyled d-lg-flex content-light m-0">
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/">Home</Link>
                  </li>
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/about">About</Link>
                  </li>
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/services">Services</Link>
                  </li>
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
              <div className="btn-wrap d-md-flex">
                <Link to="/login" className="btn btn-normal btn-medium align-self-center text-uppercase btn-rounded login-btn">Log in</Link>
                <Link to="/signup" className="btn btn-linear btn-medium align-self-center btn-rounded text-uppercase register-btn mt-3 mt-md-0">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Security Section */}
      <section className="padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-4 mb-4">Security & Compliance</h1>
              <p className="lead mb-5">
                At Astrid Global Ltd, your security is our top priority. We employ bank-grade security measures
                and maintain full regulatory compliance to protect your investments and personal information.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="security-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3 text-linear">🔐 Multi-Layer Security</h3>
                <p>
                  Our platform utilizes multiple layers of security including encryption, multi-signature
                  wallets, and cold storage solutions to ensure your assets remain safe.
                </p>
                <ul className="list-unstyled mt-3">
                  <li>• End-to-end encryption</li>
                  <li>• Multi-signature technology</li>
                  <li>• Cold storage for 95% of assets</li>
                  <li>• Two-factor authentication</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="security-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3 text-linear">⚖️ Regulatory Compliance</h3>
                <p>
                  We adhere to the highest regulatory standards and work with licensed financial institutions
                  to ensure full compliance with international financial regulations.
                </p>
                <ul className="list-unstyled mt-3">
                  <li>• KYC/AML compliance</li>
                  <li>• Licensed and regulated</li>
                  <li>• Regular security audits</li>
                  <li>• Transparent reporting</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="security-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3 text-linear">👁️ 24/7 Monitoring</h3>
                <p>
                  Our dedicated security team monitors the platform around the clock, utilizing advanced
                  threat detection systems to identify and prevent potential security risks.
                </p>
                <ul className="list-unstyled mt-3">
                  <li>• Real-time threat detection</li>
                  <li>• Automated security alerts</li>
                  <li>• Incident response team</li>
                  <li>• Regular penetration testing</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="security-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3 text-linear">🛡️ Insurance Coverage</h3>
                <p>
                  Your investments are protected by comprehensive insurance coverage, providing additional
                  peace of mind and security for your crypto assets.
                </p>
                <ul className="list-unstyled mt-3">
                  <li>• Digital asset insurance</li>
                  <li>• Cyber liability coverage</li>
                  <li>• Fidelity bond protection</li>
                  <li>• SOC 2 Type II compliance</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <div className="security-commitment p-4 border-set-bold border-rounded-20 text-center">
                <h3 className="mb-3">Our Security Commitment</h3>
                <p className="mb-4">
                  Astrid Global Ltd is committed to maintaining the highest standards of security and compliance
                  in the cryptocurrency and wealth management industry. We continuously invest in cutting-edge
                  security technologies and regularly undergo independent security audits to ensure your assets
                  are protected at all times.
                </p>
                <div className="row">
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h4 className="text-linear">$0</h4>
                      <p>Security Breaches</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h4 className="text-linear">99.9%</h4>
                      <p>Uptime</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h4 className="text-linear">24/7</h4>
                      <p>Security Monitoring</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-item">
                      <h4 className="text-linear">100%</h4>
                      <p>Regulatory Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="padding-large">
        <div className="container">
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col-sm-6 col-lg-4">
              <div className="footer-item item-001">
                <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
                <p>Astrid Global Ltd is your trusted partner in crypto and wealth management, offering comprehensive financial solutions that combine innovative cryptocurrency services with professional wealth management expertise.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-002 content-light">
                <h4 className="widget-title">About</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/services">Services</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-003 content-light">
                <h4 className="widget-title">Company</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/security">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-004 content-light">
                <h4 className="widget-title">Support</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/contact">Contact us</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <hr />
      <div id="footer-bottom">
        <div className="container">
          <div className="row text-center">
            <p>© 2024 Astrid Global Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
