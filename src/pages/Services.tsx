import { Link } from 'react-router-dom';

export default function Services() {
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
                    <Link className="fw-bold active" to="/services">Services</Link>
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

      {/* Services Section */}
      <section className="padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-4 mb-4">Our Services</h1>
              <p className="lead mb-5">
                Comprehensive crypto and wealth management solutions designed to maximize your financial potential
                and secure your future in the evolving digital economy.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="service-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3">Cryptocurrency Trading</h3>
                <p className="mb-3">
                  Advanced trading platform with real-time market data, multiple cryptocurrencies,
                  and sophisticated trading tools for both beginners and experienced traders.
                </p>
                <ul className="list-unstyled">
                  <li>• Real-time market data</li>
                  <li>• Multiple cryptocurrency pairs</li>
                  <li>• Advanced charting tools</li>
                  <li>• Mobile trading app</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="service-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3">Portfolio Management</h3>
                <p className="mb-3">
                  Professional wealth management services with personalized investment strategies,
                  risk assessment, and ongoing portfolio optimization.
                </p>
                <ul className="list-unstyled">
                  <li>• Personalized investment plans</li>
                  <li>• Risk assessment & management</li>
                  <li>• Portfolio rebalancing</li>
                  <li>• Performance tracking</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="service-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3">Copy Trading</h3>
                <p className="mb-3">
                  Follow and replicate the strategies of successful traders. Learn from experts
                  while building your own trading knowledge and experience.
                </p>
                <ul className="list-unstyled">
                  <li>• Follow expert traders</li>
                  <li>• Automated trade replication</li>
                  <li>• Performance analytics</li>
                  <li>• Risk management tools</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="service-card p-4 border-set-bold border-rounded-20 h-100">
                <h3 className="mb-3">Security & Compliance</h3>
                <p className="mb-3">
                  Bank-grade security protocols and full regulatory compliance to protect your
                  investments and ensure peace of mind.
                </p>
                <ul className="list-unstyled">
                  <li>• Multi-signature wallets</li>
                  <li>• Cold storage solutions</li>
                  <li>• KYC/AML compliance</li>
                  <li>• 24/7 security monitoring</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12 text-center">
              <Link to="/signup" className="btn btn-linear btn-large text-uppercase btn-rounded">Get Started Today</Link>
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
