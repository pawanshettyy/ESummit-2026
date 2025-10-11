import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, Lock, Eye, Users, FileText, Mail } from "lucide-react";

export function PrivacyPolicy() {
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
            <h1 className="mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last Updated: January 2026
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="mb-2">Our Commitment to Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Thakur College of Engineering and Technology ("TCET", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you participate in E-Summit 2026.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Information Collection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">1. Information We Collect</h3>
                    
                    <h4 className="mb-2 text-sm">1.1 Personal Information</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      We collect the following personal information when you register for E-Summit 2026:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                      <li>Full Name</li>
                      <li>Email Address</li>
                      <li>Phone Number</li>
                      <li>Educational Institution Name</li>
                      <li>Year of Study/Graduation</li>
                      <li>Areas of Interest</li>
                      <li>Payment Information (processed through secure third-party gateways)</li>
                    </ul>

                    <h4 className="mb-2 text-sm">1.2 Automatically Collected Information</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      We may automatically collect:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Device Information (IP address, browser type, operating system)</li>
                      <li>Usage Data (pages visited, time spent, interactions)</li>
                      <li>Location Data (with your consent)</li>
                      <li>Cookies and Similar Technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use of Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">2. How We Use Your Information</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      We use the collected information for the following purposes:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>To process your registration and event participation</li>
                      <li>To communicate event updates, schedules, and important notifications</li>
                      <li>To facilitate networking opportunities with other participants</li>
                      <li>To process payments and issue QR code passes</li>
                      <li>To improve our event experience and services</li>
                      <li>To comply with legal obligations under Indian law</li>
                      <li>To prevent fraud and ensure event security</li>
                      <li>To send promotional materials about future events (with your consent)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">3. Data Protection and Security</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      In compliance with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, we implement:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Industry-standard encryption for data transmission</li>
                      <li>Secure servers with restricted access</li>
                      <li>Regular security audits and assessments</li>
                      <li>Employee training on data protection</li>
                      <li>Secure payment processing through PCI-DSS compliant gateways</li>
                      <li>Access controls and authentication mechanisms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">4. Information Sharing and Disclosure</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      We may share your information with:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
                      <li><strong>Event Sponsors:</strong> Limited information (name, institution) for networking purposes only with your consent</li>
                      <li><strong>Service Providers:</strong> Third-party vendors who assist in event management, payment processing, and communications</li>
                      <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                      <li><strong>Educational Partners:</strong> Other educational institutions participating in the event (with your consent)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      We do not sell your personal information to third parties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">5. Your Rights</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Under Indian law, you have the right to:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside mb-4">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal obligations)</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability</li>
                  <li>File a complaint with appropriate authorities</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  To exercise these rights, please contact us at <a href="mailto:tcetedic@tcetmumbai.in" className="text-primary hover:underline">tcetedic@tcetmumbai.in</a>
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">6. Data Retention</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We retain your personal information for:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Event registration data: Until the event concludes plus 1 year for follow-up communications</li>
                  <li>Financial records: 7 years as required by Indian tax laws</li>
                  <li>Marketing preferences: Until you withdraw consent</li>
                  <li>Legal compliance data: As required by applicable laws</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">7. Cookies and Tracking Technologies</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. See our Cookie Policy for more details.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">8. Children's Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  E-Summit 2026 is intended for individuals aged 16 and above. We do not knowingly collect information from children under 16. If you are under 16, please obtain parental consent before registering.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">9. Changes to This Privacy Policy</h3>
                <p className="text-sm text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or prominent notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">10. Governing Law and Jurisdiction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This Privacy Policy is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
                <p className="text-sm text-muted-foreground">
                  This policy complies with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mt-2">
                  <li>Information Technology Act, 2000</li>
                  <li>Information Technology (Reasonable Security Practices) Rules, 2011</li>
                  <li>Consumer Protection Act, 2019</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">11. Contact Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      For questions or concerns about this Privacy Policy or our data practices, please contact:
                    </p>
                    <div className="text-sm space-y-2">
                      <p><strong>Thakur College of Engineering and Technology</strong></p>
                      <p>E-Summit 2026 - Privacy Officer</p>
                      <p>Kandivali East, Mumbai - 400101</p>
                      <p>Email: <a href="mailto:tcetedic@tcetmumbai.in" className="text-primary hover:underline">tcetedic@tcetmumbai.in</a></p>
                      <p>Phone: <a href="tel:+912228471000" className="text-primary hover:underline">+91 22 2847 1000</a></p>
                      <p className="text-muted-foreground">Office Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
