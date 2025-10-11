import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Cookie, Settings, BarChart, Target, Shield, Mail } from "lucide-react";

export function CookiePolicy() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">Legal Document</Badge>
            <h1 className="mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">
              Last Updated: January 2026
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Cookie className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="mb-2">About Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    This Cookie Policy explains how Thakur College of Engineering and Technology ("TCET", "we", "us", or "our") uses cookies and similar technologies on the E-Summit 2026 website. This policy should be read together with our Privacy Policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* What Are Cookies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">1. What Are Cookies?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p className="text-sm text-muted-foreground">
                  Cookies allow us to recognize you, remember your preferences, and improve your browsing experience on our website.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">2. Types of Cookies We Use</h3>
                
                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="border-l-2 border-primary pl-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Shield className="h-4 w-4 text-primary mt-1" />
                      <h4 className="text-sm">2.1 Essential Cookies (Strictly Necessary)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Examples:</strong></p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Session authentication cookies</li>
                      <li>Security cookies to prevent fraud</li>
                      <li>Load balancing cookies</li>
                      <li>Cookie consent preferences</li>
                    </ul>
                    <p className="text-sm text-primary mt-2">These cookies cannot be disabled.</p>
                  </div>

                  {/* Performance Cookies */}
                  <div className="border-l-2 border-chart-2 pl-4">
                    <div className="flex items-start gap-2 mb-2">
                      <BarChart className="h-4 w-4 text-chart-2 mt-1" />
                      <h4 className="text-sm">2.2 Performance Cookies (Analytics)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Examples:</strong></p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Google Analytics cookies</li>
                      <li>Page visit tracking</li>
                      <li>Time spent on pages</li>
                      <li>Navigation patterns</li>
                      <li>Error tracking and debugging</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Duration:</strong> Up to 2 years</p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border-l-2 border-chart-3 pl-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Settings className="h-4 w-4 text-chart-3 mt-1" />
                      <h4 className="text-sm">2.3 Functional Cookies (Preferences)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      These cookies enable the website to provide enhanced functionality and personalization based on your interactions.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Examples:</strong></p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Language preferences</li>
                      <li>Dark/light mode settings</li>
                      <li>Remember login status</li>
                      <li>Video player settings</li>
                      <li>Form auto-fill preferences</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Duration:</strong> Up to 1 year</p>
                  </div>

                  {/* Targeting Cookies */}
                  <div className="border-l-2 border-chart-4 pl-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Target className="h-4 w-4 text-chart-4 mt-1" />
                      <h4 className="text-sm">2.4 Targeting/Marketing Cookies</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      These cookies track your browsing habits to display relevant advertisements and measure campaign effectiveness.
                    </p>
                    <p className="text-sm text-muted-foreground mb-2"><strong>Examples:</strong></p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Social media sharing cookies</li>
                      <li>Advertising network cookies</li>
                      <li>Retargeting cookies</li>
                      <li>Campaign tracking pixels</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Duration:</strong> Up to 1 year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">3. Third-Party Cookies</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We use services from third-party providers that may set their own cookies. These include:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm mb-1">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      We use Google Analytics to analyze website traffic and user behavior. Learn more: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm mb-1">Payment Gateways</h4>
                    <p className="text-sm text-muted-foreground">
                      Payment processors may use cookies to ensure secure transactions. These are essential for processing payments.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm mb-1">Social Media Platforms</h4>
                    <p className="text-sm text-muted-foreground">
                      Social media plugins (Facebook, Twitter, LinkedIn, Instagram) may set cookies to enable sharing and tracking.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm mb-1">Video Players</h4>
                    <p className="text-sm text-muted-foreground">
                      Embedded videos (YouTube, Vimeo) may set cookies to track viewing statistics and preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session vs Persistent */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">4. Session vs. Persistent Cookies</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm mb-1">Session Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Temporary cookies that are deleted when you close your browser. Used for essential website functions like maintaining your login session during a visit.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm mb-1">Persistent Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Remain on your device for a set period or until manually deleted. Used to remember your preferences and settings across multiple visits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Cookies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">5. How We Use Cookies</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We use cookies for the following purposes:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Authentication:</strong> To identify you when you log in and keep you logged in during your visit</li>
                  <li><strong>Security:</strong> To detect and prevent security risks and fraudulent activity</li>
                  <li><strong>Preferences:</strong> To remember your settings and customize your experience</li>
                  <li><strong>Analytics:</strong> To understand how visitors use our website and improve user experience</li>
                  <li><strong>Performance:</strong> To measure and optimize website performance</li>
                  <li><strong>Marketing:</strong> To deliver relevant content and measure campaign effectiveness</li>
                  <li><strong>Social Media:</strong> To enable social sharing and integration</li>
                </ul>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">6. How to Manage Cookies</h3>
                
                <h4 className="mb-2 text-sm">6.1 Browser Settings</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
                  <li>View and delete cookies</li>
                  <li>Block all cookies</li>
                  <li>Allow only first-party cookies</li>
                  <li>Clear cookies when closing the browser</li>
                </ul>

                <h4 className="mb-2 text-sm">6.2 Browser-Specific Instructions</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>

                <h4 className="mb-2 text-sm">6.3 Opt-Out Options</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You can opt out of specific tracking:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                  <li>Advertising: <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices</a></li>
                </ul>
              </CardContent>
            </Card>

            {/* Impact of Disabling */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">7. Impact of Disabling Cookies</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you disable or refuse cookies, please note that:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Some parts of our website may become inaccessible or not function properly</li>
                  <li>You may need to manually adjust preferences on each visit</li>
                  <li>You may not be able to complete registration or payment processes</li>
                  <li>We may not be able to remember your preferences</li>
                  <li>Your user experience may be degraded</li>
                </ul>
              </CardContent>
            </Card>

            {/* Mobile Devices */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">8. Cookies on Mobile Devices</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Mobile devices may use different technologies for tracking:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Device IDs:</strong> Unique identifiers for mobile devices</li>
                  <li><strong>Local Storage:</strong> Similar to cookies but with larger capacity</li>
                  <li><strong>App Tracking:</strong> If you use our mobile app (future implementation)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  You can manage mobile tracking through your device settings (iOS: Settings → Privacy; Android: Settings → Google → Ads).
                </p>
              </CardContent>
            </Card>

            {/* Legal Compliance */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">9. Legal Compliance</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Our use of cookies complies with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Information Technology Act, 2000</li>
                  <li>Information Technology (Reasonable Security Practices) Rules, 2011</li>
                  <li>Consumer Protection Act, 2019</li>
                  <li>Electronic consent requirements under Indian law</li>
                </ul>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">10. Updates to This Cookie Policy</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices. Updates will be posted on this page with a revised "Last Updated" date.
                </p>
                <p className="text-sm text-muted-foreground">
                  We encourage you to review this policy periodically to stay informed about our use of cookies.
                </p>
              </CardContent>
            </Card>

            {/* Your Consent */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">11. Your Consent</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  By using our website, you consent to our use of cookies as described in this policy. When you first visit our website, you will see a cookie notice banner. You can:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  You can change your preferences at any time through browser settings or by contacting us.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">12. Contact Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      If you have questions about our use of cookies or this Cookie Policy, please contact:
                    </p>
                    <div className="text-sm space-y-2">
                      <p><strong>Thakur College of Engineering and Technology</strong></p>
                      <p>E-Summit 2026 - Data Protection Officer</p>
                      <p>Kandivali East, Mumbai - 400101</p>
                      <p>Email: <a href="mailto:tcetedic@tcetmumbai.in" className="text-primary hover:underline">tcetedic@tcetmumbai.in</a></p>
                      <p>Phone: <a href="tel:+912228471000" className="text-primary hover:underline">+91 22 2847 1000</a></p>
                      <p className="text-muted-foreground">Office Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-center text-muted-foreground">
                  This Cookie Policy should be read in conjunction with our Privacy Policy and Terms of Service.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
