import { Link } from 'react-router-dom';

export default function Contact() {
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
                    <Link className="fw-bold active" to="/contact">Contact</Link>
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

      {/* Contact Section */}
      <section className="padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-4 mb-4">Contact Us</h1>
              <p className="lead mb-5">
                Get in touch with our expert team for personalized crypto and wealth management guidance.
                We're here to help you navigate the world of digital finance.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="contact-info p-4 border-set-bold border-rounded-20 mb-4">
                <h3 className="mb-4">Get In Touch</h3>
                <div className="contact-item mb-3">
                  <h5>Email</h5>
                  <p>support@astridglobal.com</p>
                </div>
                <div className="contact-item mb-3">
                  <h5>Phone</h5>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="contact-item mb-3">
                  <h5>Address</h5>
                  <p>123 Financial District<br />New York, NY 10001<br />United States</p>
                </div>
                <div className="contact-item">
                  <h5>Business Hours</h5>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST<br />Saturday: 10:00 AM - 4:00 PM EST<br />Sunday: Closed</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="contact-form p-4 border-set-bold border-rounded-20">
                <h3 className="mb-4">Send us a Message</h3>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Your Name" />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control bg-dark text-white border-secondary" placeholder="Your Email" />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Subject" />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control bg-dark text-white border-secondary" rows={5} placeholder="Your Message"></textarea>
                  </div>
                  <button type="submit" className="btn btn-linear btn-medium text-uppercase btn-rounded w-100">Send Message</button>
                </form>
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
